package com.shopsphere.product.Repository;

import com.shopsphere.product.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = "SELECT p FROM Product p WHERE p.active = true", nativeQuery = false)
    List<Product> findAllActive();

    @Query(value = "SELECT p FROM Product p WHERE p.name LIKE CONCAT('%', :name, '%')", nativeQuery = false)
    List<Product> findByNameContaining(@Param("name") String name);

    @Query(value = "SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.active = true", nativeQuery = false)
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query(value = "SELECT p FROM Product p WHERE p.sku = :sku", nativeQuery = false)
    Optional<Product> findBySku(@Param("sku") String sku);

    @Query(value = "SELECT p FROM Product p WHERE p.active = true ORDER BY p.createdAt DESC", nativeQuery = false)
    List<Product> findLatestArrivals();

    @Query(value = "SELECT p FROM Product p WHERE p.active = true", nativeQuery = false)
    int countByActiveTrue();
}