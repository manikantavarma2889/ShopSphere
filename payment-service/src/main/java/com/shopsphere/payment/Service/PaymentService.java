package com.shopsphere.payment.Service;

import com.shopsphere.payment.Entity.Payment;
import com.shopsphere.payment.Entity.PaymentStatus;
import com.shopsphere.payment.Repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public PaymentService() {
        // Default constructor for testing
    }

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public Payment createPayment(Long orderId, Long userId, BigDecimal amount, String paymentMethod) {
        // Check for existing payment (idempotency)
        Optional<Payment> existingPayment = paymentRepository.findByOrderIdAndUserId(orderId, userId);
        if (existingPayment.isPresent()) {
            // Return existing payment - no duplicates
            return existingPayment.get();
        }

        Payment payment = new Payment(orderId, userId, amount);
        // Set status based on payment method
        // For demo: SUCCESS for valid card numbers, FAILED for invalid
        if (isSuccessfulCard(paymentMethod)) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionReference("DEMO-" + System.currentTimeMillis());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }
        return paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId).orElse(null);
    }

    @Transactional(readOnly = true)
    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    private boolean isSuccessfulCard(String paymentMethod) {
        // Demo/test card validation
        // SUCCESS: 4242 4242 4242 4242
        // FAILED: 4000 0000 0000 0002
        if (paymentMethod == null) {
            return false;
        }
        String cleaned = paymentMethod.replaceAll("\\s", "");
        // Test with demo card numbers
        return cleaned.equals("4242424242424242") || cleaned.startsWith("4242");
    }

    // Idempotency: Check if a payment for this order/user already exists
    @Transactional(readOnly = true)
    public boolean existsByOrderIdAndUserId(Long orderId, Long userId) {
        return paymentRepository.findByOrderIdAndUserId(orderId, userId).isPresent();
    }
}