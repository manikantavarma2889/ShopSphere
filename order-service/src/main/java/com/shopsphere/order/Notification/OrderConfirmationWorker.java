package com.shopsphere.order.Notification;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class OrderConfirmationWorker {
    private final RestClient restClient;
    private final String notificationServiceUrl;
    private final String notificationServiceToken;

    public OrderConfirmationWorker(
            RestClient.Builder restClientBuilder,
            @Value("${shopsphere.notifications.service-url}") String notificationServiceUrl,
            @Value("${shopsphere.notifications.service-token}") String notificationServiceToken) {
        this.restClient = restClientBuilder.build();
        this.notificationServiceUrl = notificationServiceUrl;
        this.notificationServiceToken = notificationServiceToken;
    }

    @RabbitListener(queues = "${shopsphere.notifications.order-confirmation-queue}")
    public void process(OrderConfirmationJob job) {
        restClient.post()
                .uri(notificationServiceUrl + "/internal/order-confirmations")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + notificationServiceToken)
                .body(job)
                .retrieve()
                .toBodilessEntity();
    }
}
