package com.shopsphere.product.Controller;

import com.shopsphere.product.Entity.Category;
import com.shopsphere.product.Service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final ProductService productService;

    public CategoryController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Category> list() {
        return productService.getCategories();
    }
}
