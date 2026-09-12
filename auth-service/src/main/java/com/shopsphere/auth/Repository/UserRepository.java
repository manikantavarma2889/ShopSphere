package com.shopsphere.auth.Repository;

import com.shopsphere.auth.Entity.User;
import com.shopsphere.auth.Entity.User.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT u FROM User u WHERE u.email = :email", nativeQuery = false)
    Optional<User> findByEmail(@Param("email") String email);

    @Query(value = "SELECT u FROM User u WHERE u.role = :role AND u.enabled = :enabled", nativeQuery = false)
    java.util.List<User> findByRoleEnabled(@Param("role") Role role, @Param("enabled") boolean enabled);
}