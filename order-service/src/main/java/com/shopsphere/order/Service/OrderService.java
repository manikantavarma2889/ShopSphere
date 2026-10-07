package com.shopsphere.order.Service;

import com.shopsphere.order.Client.ProductClient;
import com.shopsphere.order.DTO.AddCartItemRequest;
import com.shopsphere.order.DTO.CreateOrderRequest;
import com.shopsphere.order.DTO.UpdateCartItemRequest;
import com.shopsphere.order.Entity.Cart;
import com.shopsphere.order.Entity.CartItem;
import com.shopsphere.order.Entity.Order;
import com.shopsphere.order.Entity.OrderItem;
import com.shopsphere.order.Repository.CartRepository;
import com.shopsphere.order.Repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductClient productClient;

    public OrderService(CartRepository cartRepository, OrderRepository orderRepository, ProductClient productClient) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.productClient = productClient;
    }

    @Transactional
    public Cart getCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUserId(userId);
            return cartRepository.save(cart);
        });
    }

    @Transactional
    public Cart addToCart(Long userId, AddCartItemRequest request) {
        Cart cart = getCart(userId);
        ProductClient.ProductDto product = productClient.getProduct(request.productId());
        if (!product.active() || product.stockQuantity() < request.quantity()) {
            throw new IllegalArgumentException("Product is unavailable or has insufficient stock");
        }

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(request.productId()))
                .findFirst().orElse(null);

        if (item == null) {
            item = new CartItem(product.id(), product.name(), product.price(), request.quantity());
            item.setCart(cart);
            cart.addItem(item);
        } else {
            int quantity = item.getQuantity() + request.quantity();
            if (quantity > product.stockQuantity()) {
                throw new IllegalArgumentException("Insufficient stock");
            }
            item.setQuantity(quantity);
        }

        cart.setUpdatedAt(java.time.LocalDateTime.now());
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItem(Long userId, Long productId, UpdateCartItemRequest request) {
        Cart cart = getCart(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        ProductClient.ProductDto product = productClient.getProduct(productId);
        if (request.quantity() > product.stockQuantity()) {
            throw new IllegalArgumentException("Insufficient stock");
        }
        item.setQuantity(request.quantity());
        cart.setUpdatedAt(java.time.LocalDateTime.now());
        return cartRepository.save(cart);
    }

    @Transactional
    public void removeCartItem(Long userId, Long productId) {
        Cart cart = getCart(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        cart.removeItem(item);
        cartRepository.save(cart);
    }

    @Transactional
    public Order createOrder(Long userId, CreateOrderRequest request) {
        Cart cart = getCart(userId);
        if (cart.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Order order = new Order(userId, cart.getSubtotal(), request.shippingAddress());

        for (CartItem item : cart.getItems()) {
            ProductClient.ProductDto product = productClient.getProduct(item.getProductId());
            if (product.stockQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for " + product.name());
            }

            productClient.updateInventory(item.getProductId(),
                    new ProductClient.InventoryUpdateRequest(-item.getQuantity()));

            OrderItem orderItem = new OrderItem(item.getProductName(), item.getUnitPrice(), item.getQuantity());
            orderItem.setProductId(item.getProductId());
            orderItem.setOrder(order);
            order.addOrderItem(orderItem);
        }

        order.recalculateTotal();
        Order saved = orderRepository.save(order);

        cart.getItems().clear();
        cart.setUpdatedAt(java.time.LocalDateTime.now());
        cartRepository.save(cart);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Order> getOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Order getOrder(Long userId, Long orderId) {
        return orderRepository.findById(orderId)
                .filter(order -> order.getUserId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }
}
