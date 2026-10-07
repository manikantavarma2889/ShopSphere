package com.shopsphere.product.Controller;

import com.shopsphere.product.Entity.Product;
import com.shopsphere.product.Service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "newest") String sort) {
        return productService.search(search, categoryId, sort).stream()
                .map(ProductResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Long id) {
        return ProductResponse.from(productService.getById(id));
    }

    @PutMapping("/{id}/inventory")
    public ProductResponse updateInventory(@PathVariable Long id, @Valid @RequestBody InventoryUpdateRequest request) {
        return ProductResponse.from(productService.updateInventory(id, request.quantityDelta()));
    }

    public record InventoryUpdateRequest(@NotNull Integer quantityDelta) {}

    public record ProductResponse(
            Long id, String name, String description, java.math.BigDecimal price,
            String sku, String imageUrl, Integer stockQuantity, boolean active, Long categoryId, String categoryName) {
        static ProductResponse from(Product p) {
            return new ProductResponse(
                    p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getSku(),
                    p.getImageUrl(), p.getStockQuantity(), p.isActive(),
                    p.getCategory() == null ? null : p.getCategory().getId(),
                    p.getCategory() == null ? null : p.getCategory().getName());
        }
    }
}
