package com.shopsphere.order.Notification;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Message payload for asynchronous order-confirmation processing.
 */
public record OrderConfirmationJob(
        Long orderId,
        Long userId,
        BigDecimal totalAmount,
        Instant createdAt
) {
}
