package com.shopsphere.order.Notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class OrderConfirmationPublisher {
    private static final Logger log = LoggerFactory.getLogger(OrderConfirmationPublisher.class);

    private final RabbitTemplate rabbitTemplate;
    private final String exchange;
    private final String routingKey;

    public OrderConfirmationPublisher(
            RabbitTemplate rabbitTemplate,
            @Value("${shopsphere.notifications.exchange}") String exchange,
            @Value("${shopsphere.notifications.routing-key}") String routingKey) {
        this.rabbitTemplate = rabbitTemplate;
        this.exchange = exchange;
        this.routingKey = routingKey;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publishAfterOrderCommit(OrderConfirmationJob job) {
        rabbitTemplate.convertAndSend(exchange, routingKey, job, message ->
                {
                    message.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                    return message;
                });
        log.info("Queued order confirmation job for orderId={}", job.orderId());
    }
}
