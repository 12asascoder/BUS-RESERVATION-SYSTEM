package com.smartbus2plus.iot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * SmartBus2+ IoT Telemetry Service
 * Handles real-time sensor data collection and streaming
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class IoTTelemetryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(IoTTelemetryServiceApplication.class, args);
        System.out.println("🚌 SmartBus2+ IoT Telemetry Service started successfully!");
    }
}

