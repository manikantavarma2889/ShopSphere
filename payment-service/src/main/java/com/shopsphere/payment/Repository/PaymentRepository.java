package com.shopsphere.payment.Repository;

import com.shopsphere.payment.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderIdAndUserId(Long orderId, Long userId);
    Payment findByOrderId(Long orderId);
}
