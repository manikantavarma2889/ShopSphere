package com.shopsphere.order.Notification;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OrderNotificationConfig {
    @Bean
    public Queue orderConfirmationQueue(
            @Value("${shopsphere.notifications.order-confirmation-queue}") String queueName) {
        return QueueBuilder.durable(queueName).build();
    }

    @Bean
    public DirectExchange orderNotificationExchange(
            @Value("${shopsphere.notifications.exchange}") String exchangeName) {
        return new DirectExchange(exchangeName, true, false);
    }

    @Bean
    public Binding orderConfirmationBinding(
            Queue orderConfirmationQueue,
            DirectExchange orderNotificationExchange,
            @Value("${shopsphere.notifications.routing-key}") String routingKey) {
        return BindingBuilder.bind(orderConfirmationQueue)
                .to(orderNotificationExchange)
                .with(routingKey);
    }

    @Bean
    public MessageConverter orderNotificationMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
