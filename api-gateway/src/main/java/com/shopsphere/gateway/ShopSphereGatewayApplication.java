package com.shopsphere.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@SpringBootApplication
@EnableDiscoveryClient
public class ShopSphereGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopSphereGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**").filters(f -> f.filter(new LoggingFilter())).uri("lb://auth-service"))
                .route("product-service", r -> r.path("/api/products/**").filters(f -> f.filter(new LoggingFilter())).uri("lb://product-service"))
                .route("category-service", r -> r.path("/api/categories/**").filters(f -> f.filter(new LoggingFilter())).uri("lb://product-service"))
                .route("order-service", r -> r.path("/api/orders/**").filters(f -> f.filter(new LoggingFilter())).uri("lb://order-service"))
                .route("cart-service", r -> r.path("/api/cart/**").filters(f -> f.filter(new LoggingFilter())).uri("lb://order-service"))
                .route("payment-service", r -> r.path("/api/payments/**").filters(f -> f.filter(new LoggingFilter())).uri("lb://payment-service"))
                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
