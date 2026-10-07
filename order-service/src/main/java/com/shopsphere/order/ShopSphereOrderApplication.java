package com.shopsphere.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ShopSphereOrderApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopSphereOrderApplication.class, args);
    }
}
