package com.smartbus2plus.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * SmartBus2+ AI Assist Service
 * Provides AI-powered travel recommendations and insights
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class AIAssistServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AIAssistServiceApplication.class, args);
        System.out.println("🚌 SmartBus2+ AI Assist Service started successfully!");
    }
}
