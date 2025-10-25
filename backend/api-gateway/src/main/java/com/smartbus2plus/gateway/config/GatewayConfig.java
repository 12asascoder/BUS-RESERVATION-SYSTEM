package com.smartbus2plus.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Gateway Route Configuration for SmartBus2+
 */
@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service Routes
                .route("auth-service", r -> r.path("/api/auth/**")
                        .uri("lb://auth-service"))
                
                // Inventory Service Routes
                .route("inventory-service", r -> r.path("/api/inventory/**")
                        .uri("lb://inventory-service"))
                
                // Booking Service Routes
                .route("booking-service", r -> r.path("/api/booking/**")
                        .uri("lb://booking-service"))
                
                // Payment Service Routes
                .route("payment-service", r -> r.path("/api/payment/**")
                        .uri("lb://payment-service"))
                
                // IoT Telemetry Service Routes
                .route("iot-telemetry-service", r -> r.path("/api/iot/**")
                        .uri("lb://iot-telemetry-service"))
                
                // RFID Gateway Service Routes
                .route("rfid-gateway-service", r -> r.path("/api/rfid/**")
                        .uri("lb://rfid-gateway-service"))
                
                // AI Assist Service Routes
                .route("ai-assist-service", r -> r.path("/api/ai/**")
                        .uri("lb://ai-assist-service"))
                
                // Analytics Service Routes
                .route("analytics-service", r -> r.path("/api/analytics/**")
                        .uri("lb://analytics-service"))
                
                // WebSocket Routes
                .route("websocket-iot", r -> r.path("/ws/iot/**")
                        .uri("lb://iot-telemetry-service"))
                
                .route("websocket-rfid", r -> r.path("/ws/rfid/**")
                        .uri("lb://rfid-gateway-service"))
                
                .route("websocket-ai", r -> r.path("/ws/ai/**")
                        .uri("lb://ai-assist-service"))
                
                .build();
    }
}

