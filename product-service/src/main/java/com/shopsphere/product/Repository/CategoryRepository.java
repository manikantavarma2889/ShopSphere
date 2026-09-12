package com.shopsphere.product.Repository;

import com.shopsphere.product.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query(value = "SELECT c FROM Category c", nativeQuery = false)
    List<Category> findAllActive();

    @Query(value = "SELECT c FROM Category c WHERE c.name = :name", nativeQuery = false)
    Optional<Category> findByName(@Param("name") String name);
}