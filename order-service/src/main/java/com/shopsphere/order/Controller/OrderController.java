package com.shopsphere.order.Controller;

import com.shopsphere.order.DTO.AddCartItemRequest;
import com.shopsphere.order.DTO.CreateOrderRequest;
import com.shopsphere.order.DTO.UpdateCartItemRequest;
import com.shopsphere.order.Entity.Cart;
import com.shopsphere.order.Entity.Order;
import com.shopsphere.order.Service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/api/cart")
    public Cart getCart(@RequestHeader("X-User-Id") Long userId) {
        return orderService.getCart(userId);
    }

    @PostMapping("/api/cart/items")
    public Cart addToCart(@RequestHeader("X-User-Id") Long userId,
                          @Valid @RequestBody AddCartItemRequest request) {
        return orderService.addToCart(userId, request);
    }

    @PatchMapping("/api/cart/items/{productId}")
    public Cart updateCartItem(@RequestHeader("X-User-Id") Long userId,
                               @PathVariable Long productId,
                               @Valid @RequestBody UpdateCartItemRequest request) {
        return orderService.updateCartItem(userId, productId, request);
    }

    @DeleteMapping("/api/cart/items/{productId}")
    public void removeCartItem(@RequestHeader("X-User-Id") Long userId,
                               @PathVariable Long productId) {
        orderService.removeCartItem(userId, productId);
    }

    @PostMapping("/api/orders")
    public Order createOrder(@RequestHeader("X-User-Id") Long userId,
                             @Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(userId, request);
    }

    @GetMapping("/api/orders")
    public List<Order> getOrders(@RequestHeader("X-User-Id") Long userId) {
        return orderService.getOrders(userId);
    }

    @GetMapping("/api/orders/{id}")
    public Order getOrder(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id) {
        return orderService.getOrder(userId, id);
    }
}
