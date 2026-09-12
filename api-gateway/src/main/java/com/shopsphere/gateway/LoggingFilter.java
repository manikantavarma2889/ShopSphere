package com.shopsphere.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingFilter implements GatewayFilter {

    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        HttpHeaders headers = exchange.getRequest().getHeaders();
        logger.info("Gateway request: {} {}", exchange.getRequest().getMethod(), exchange.getRequest().getURI().getPath());
        headers.forEach((key, value) -> logger.info("  Header: {} = {}", key, value));

        return chain.filter(exchange)
                .then(Mono.fromRunnable(() -> {
                    logger.info("Gateway response: {} - {}", exchange.getRequest().getMethod(),
                            exchange.getResponse().getStatusCode());
                }));
    }
}