package com.shopsphere.payment.Controller;

import com.shopsphere.payment.Entity.Payment;
import com.shopsphere.payment.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestParam Long orderId,
                                           @RequestParam Long userId,
                                           @RequestParam BigDecimal amount,
                                           @RequestParam String paymentMethod) {
        try {
            Payment payment = paymentService.createPayment(orderId, userId, amount, paymentMethod);
            String json = "{\"paymentId\": " + payment.getId() +
                          ", \"transactionReference\": \"" + payment.getTransactionReference() +
                          "\", \"amount\": " + payment.getAmount() +
                          ", \"status\": \"" + payment.getStatus() + "\"}";
            return new ResponseEntity<>(json, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            String err = "{\"error\": \"" + e.getMessage() + "\"}";
            return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long paymentId) {
        Payment payment = paymentService.getPaymentById(paymentId);
        if (payment != null) {
            return ResponseEntity.ok()
                    .body("{\"paymentId\": " + payment.getId() +
                            ", \"orderId\": " + payment.getOrderId() +
                            ", \"userId\": " + payment.getUserId() +
                            ", \"amount\": " + payment.getAmount() +
                            ", \"status\": \"" + payment.getStatus() + "\"" +
                            ", \"transactionReference\": \"" + payment.getTransactionReference() + "\"}");
        }
        return new ResponseEntity<>("{\"error\": \"Payment not found\"}", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getPaymentByOrderId(@PathVariable Long orderId) {
        Payment payment = paymentService.getPaymentByOrderId(orderId);
        if (payment != null) {
            return ResponseEntity.ok()
                    .body("{\"paymentId\": " + payment.getId() +
                            ", \"orderId\": " + payment.getOrderId() +
                            ", \"userId\": " + payment.getUserId() +
                            ", \"amount\": " + payment.getAmount() +
                            ", \"status\": \"" + payment.getStatus() + "\"" +
                            ", \"transactionReference\": \"" + payment.getTransactionReference() + "\"}");
        }
        return new ResponseEntity<>("{\"error\": \"Payment not found for this order\"}", HttpStatus.NOT_FOUND);
    }
}