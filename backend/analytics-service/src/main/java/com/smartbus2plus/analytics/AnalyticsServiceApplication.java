package com.smartbus2plus.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * SmartBus2+ Analytics Service
 * Handles energy optimization and performance analytics
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class AnalyticsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsServiceApplication.class, args);
        System.out.println("🚌 SmartBus2+ Analytics Service started successfully!");
    }
}

