package com.shopsphere.order.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@FeignClient(name = "product-service")
public interface ProductClient {
    @GetMapping("/api/products/{id}")
    ProductDto getProduct(@PathVariable Long id);

    @PutMapping("/api/products/{id}/inventory")
    ProductDto updateInventory(@PathVariable Long id, @RequestBody InventoryUpdateRequest request);

    record ProductDto(Long id, String name, String description, BigDecimal price, String sku,
                      String imageUrl, Integer stockQuantity, boolean active, Long categoryId, String categoryName) {}
    record InventoryUpdateRequest(Integer quantityDelta) {}
}
