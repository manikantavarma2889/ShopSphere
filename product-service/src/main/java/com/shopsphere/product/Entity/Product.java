package com.shopsphere.product.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products", schema = "product_schema")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(max = 200)
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(name = "price", nullable = false, precision = 19, scale = 2)
    private BigDecimal price;

    @NotBlank(message = "SKU is required")
    @Size(max = 50)
    @Column(name = "sku", nullable = false, unique = true, length = 50)
    private String sku;

    @Column(name = "image_url")
    private String imageUrl;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must not be negative")
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @NotNull(message = "Active status is required")
    @Column(name = "active", nullable = false)
    private boolean active;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Product() {
        this.active = true;
        this.stockQuantity = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Product(String name, String description, BigDecimal price, String sku,
                   String imageUrl, Integer stockQuantity, boolean active) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.sku = sku;
        this.imageUrl = imageUrl;
        this.stockQuantity = stockQuantity;
        this.active = active;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", sku='" + sku + '\'' +
                ", stockQuantity=" + stockQuantity +
                ", active=" + active +
                '}';
    }
}