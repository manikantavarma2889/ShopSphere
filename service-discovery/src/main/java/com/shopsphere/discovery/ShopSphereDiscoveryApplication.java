package com.shopsphere.discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
@EntityScan(basePackages = "com.shopsphere")
public class ShopSphereDiscoveryApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopSphereDiscoveryApplication.class, args);
    }
}