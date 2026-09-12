package com.shopsphere.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.core.env.Environment;

@SpringBootApplication
@EnableDiscoveryClient
public class ShopSphereProductApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopSphereProductApplication.class, args);
    }
}