package com.shopsphere.product.Service;

import com.shopsphere.product.Entity.Category;
import com.shopsphere.product.Entity.Product;
import com.shopsphere.product.Repository.CategoryRepository;
import com.shopsphere.product.Repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> search(String query, Long categoryId, String sort) {
        List<Product> products = productRepository.findAllActive();

        if (query != null && !query.isBlank()) {
            String needle = query.trim().toLowerCase();
            products = products.stream()
                    .filter(p -> p.getName().toLowerCase().contains(needle)
                            || (p.getDescription() != null && p.getDescription().toLowerCase().contains(needle))
                            || p.getSku().toLowerCase().contains(needle))
                    .toList();
        }

        if (categoryId != null) {
            products = products.stream()
                    .filter(p -> p.getCategory() != null && categoryId.equals(p.getCategory().getId()))
                    .toList();
        }

        Comparator<Product> comparator = switch (sort == null ? "newest" : sort) {
            case "price-asc" -> Comparator.comparing(Product::getPrice);
            case "price-desc" -> Comparator.comparing(Product::getPrice).reversed();
            case "name" -> Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER);
            default -> Comparator.comparing(Product::getCreatedAt).reversed();
        };

        return products.stream().sorted(comparator).toList();
    }

    @Transactional(readOnly = true)
    public Product getById(Long id) {
        return productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    @Transactional(readOnly = true)
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public Product updateInventory(Long id, int quantityDelta) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        int newQuantity = product.getStockQuantity() + quantityDelta;
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        product.setStockQuantity(newQuantity);
        product.setUpdatedAt(java.time.LocalDateTime.now());
        return productRepository.save(product);
    }
}
