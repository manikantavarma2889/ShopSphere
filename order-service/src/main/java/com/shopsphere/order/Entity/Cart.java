package com.shopsphere.order.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "carts", schema = "order_schema")
public class Cart {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false) private Long id;

    @Column(name = "user_id", nullable = false) private Long userId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> items = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at") private LocalDateTime updatedAt;

    public Cart() { this.createdAt = LocalDateTime.now(); this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Set<CartItem> getItems() { return items; }
    public void setItems(Set<CartItem> items) { this.items = items; }
    public void addItem(CartItem item) { this.items.add(item); }
    public void removeItem(CartItem item) { this.items.remove(item); }
    public int getItemCount() { return items == null ? 0 : items.stream().mapToInt(CartItem::getQuantity).sum(); }
    public BigDecimal getSubtotal() { return items == null ? BigDecimal.ZERO : items.stream().map(CartItem::getSubtotal).reduce(BigDecimal.ZERO, BigDecimal::add); }
    public boolean isEmpty() { return items == null || items.isEmpty(); }

    @Override public String toString() { return "Cart{id=" + id + ", userId=" + userId + ", itemCount=" + getItemCount() + ", subtotal=" + getSubtotal() + '}'; }
}
