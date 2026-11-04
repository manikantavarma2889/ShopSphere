package com.shopsphere.order.Notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class OrderConfirmationWorker {
    private static final Logger log = LoggerFactory.getLogger(OrderConfirmationWorker.class);

    @RabbitListener(queues = "${shopsphere.notifications.order-confirmation-queue}")
    public void process(OrderConfirmationJob job) {
        // This worker demonstrates asynchronous processing. Connect an email provider
        // here when delivery credentials and a provider are configured.
        log.info(
                "Processed order confirmation job: orderId={}, userId={}, totalAmount={}, createdAt={}",
                job.orderId(),
                job.userId(),
                job.totalAmount(),
                job.createdAt()
        );
    }
}
