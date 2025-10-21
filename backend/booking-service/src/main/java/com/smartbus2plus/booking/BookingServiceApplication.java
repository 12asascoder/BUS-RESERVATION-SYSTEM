package com.smartbus2plus.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * SmartBus2+ Booking Service
 * Handles seat booking and hold management
 */
@SpringBootApplication
@EnableDiscoveryClient
public class BookingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookingServiceApplication.class, args);
        System.out.println("🚌 SmartBus2+ Booking Service started successfully!");
    }
}
