package com.smartbus2plus.rfid;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * SmartBus2+ RFID Gateway Service
 * Handles RFID-based smart boarding and ticket verification
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class RFIDGatewayServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RFIDGatewayServiceApplication.class, args);
        System.out.println("🚌 SmartBus2+ RFID Gateway Service started successfully!");
    }
}
