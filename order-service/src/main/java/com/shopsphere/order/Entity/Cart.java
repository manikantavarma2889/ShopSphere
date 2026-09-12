package com.shopsphere.order.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.shopsphere.product.Entity.Product;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "carts", schema = "order_schema")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> items = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Cart() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<CartItem> getItems() {
        return items;
    }

    public void setItems(Set<CartItem> items) {
        this.items = items;
    }

    public void addItem(CartItem item) {
        this.items.add(item);
    }

    public void removeItem(CartItem item) {
        this.items.remove(item);
    }

    public boolean hasItem(String sku) {
        // Simplified check: iterate items and compare productName or productId
        if (items == null || items.isEmpty()) return false;
        return items.stream().anyMatch(item -> sku.equals(item.getProductName()));
    }

    public int getItemCount() {
        if (items == null) return 0;
        int count = 0;
        for (CartItem item : items) {
            count += item.getQuantity();
        }
        return count;
    }

    public BigDecimal getSubtotal() {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return items.stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    @Override
    public String toString() {
        return "Cart{" +
                "id=" + id +
                ", itemCount=" + getItemCount() +
                ", subtotal=" + getSubtotal() +
                '}';
    }
}