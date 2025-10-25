package com.smartbus2plus.ai.service;

import com.smartbus2plus.ai.model.AIRecommendation;
import com.smartbus2plus.ai.repository.AIRecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

/**
 * AI Assist service for SmartBus2+ travel recommendations
 */
@Service
public class AIAssistService {
    
    @Autowired
    private AIRecommendationRepository recommendationRepository;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    private final Random random = new Random();
    
    public AIRecommendation generateSeatRecommendation(Long userId, Long busId, String preferences) {
        // Mock AI seat recommendation logic
        String[] recommendedSeats = {"3A", "7A", "11A", "5C", "9D"};
        String selectedSeat = recommendedSeats[random.nextInt(recommendedSeats.length)];
        
        String content = String.format(
            "{\"recommendedSeat\":\"%s\",\"reason\":\"Optimal comfort and view\",\"busId\":%d,\"preferences\":\"%s\"}",
            selectedSeat, busId, preferences
        );
        
        BigDecimal confidence = BigDecimal.valueOf(0.85 + random.nextDouble() * 0.15);
        
        AIRecommendation recommendation = new AIRecommendation(
            userId, "seat_suggestion", content, confidence
        );
        
        AIRecommendation saved = recommendationRepository.save(recommendation);
        
        // Send to Kafka
        kafkaTemplate.send("ai-recommendations", saved);
        
        // Send to WebSocket clients
        messagingTemplate.convertAndSend("/topic/ai/recommendations", saved);
        
        return saved;
    }
    
    public AIRecommendation generateRouteOptimization(Long userId, String origin, String destination) {
        // Mock AI route optimization logic
        String[] routes = {"Route A via I-95", "Route B via Highway 1", "Route C via Expressway"};
        String selectedRoute = routes[random.nextInt(routes.length)];
        
        int timeSavings = random.nextInt(30) + 5; // 5-35 minutes
        int efficiencyGain = random.nextInt(20) + 10; // 10-30%
        
        String content = String.format(
            "{\"recommendedRoute\":\"%s\",\"timeSavings\":%d,\"efficiencyGain\":%d,\"origin\":\"%s\",\"destination\":\"%s\"}",
            selectedRoute, timeSavings, efficiencyGain, origin, destination
        );
        
        BigDecimal confidence = BigDecimal.valueOf(0.80 + random.nextDouble() * 0.20);
        
        AIRecommendation recommendation = new AIRecommendation(
            userId, "route_optimization", content, confidence
        );
        
        AIRecommendation saved = recommendationRepository.save(recommendation);
        
        // Send to Kafka
        kafkaTemplate.send("ai-recommendations", saved);
        
        // Send to WebSocket clients
        messagingTemplate.convertAndSend("/topic/ai/recommendations", saved);
        
        return saved;
    }
    
    public AIRecommendation generateTimingRecommendation(Long userId, String routeId) {
        // Mock AI timing recommendation logic
        String[] optimalTimes = {"08:00", "10:30", "14:00", "16:30"};
        String selectedTime = optimalTimes[random.nextInt(optimalTimes.length)];
        
        int punctualityScore = random.nextInt(20) + 80; // 80-100%
        int comfortScore = random.nextInt(15) + 85; // 85-100%
        
        String content = String.format(
            "{\"optimalTime\":\"%s\",\"punctualityScore\":%d,\"comfortScore\":%d,\"routeId\":\"%s\"}",
            selectedTime, punctualityScore, comfortScore, routeId
        );
        
        BigDecimal confidence = BigDecimal.valueOf(0.88 + random.nextDouble() * 0.12);
        
        AIRecommendation recommendation = new AIRecommendation(
            userId, "timing_recommendation", content, confidence
        );
        
        AIRecommendation saved = recommendationRepository.save(recommendation);
        
        // Send to Kafka
        kafkaTemplate.send("ai-recommendations", saved);
        
        // Send to WebSocket clients
        messagingTemplate.convertAndSend("/topic/ai/recommendations", saved);
        
        return saved;
    }
    
    public AIRecommendation generateComfortAnalysis(Long userId, Long busId) {
        // Mock AI comfort analysis logic
        String[] conditions = {"Excellent", "Good", "Fair", "Needs Attention"};
        String condition = conditions[random.nextInt(conditions.length)];
        
        double temperature = 18 + random.nextDouble() * 12; // 18-30°C
        double humidity = 30 + random.nextDouble() * 40; // 30-70%
        double vibration = random.nextDouble() * 3; // 0-3 m/s²
        double noiseLevel = 40 + random.nextDouble() * 40; // 40-80 dB
        
        String content = String.format(
            "{\"condition\":\"%s\",\"temperature\":%.1f,\"humidity\":%.1f,\"vibration\":%.1f,\"noiseLevel\":%.1f,\"busId\":%d}",
            condition, temperature, humidity, vibration, noiseLevel, busId
        );
        
        BigDecimal confidence = BigDecimal.valueOf(0.90 + random.nextDouble() * 0.10);
        
        AIRecommendation recommendation = new AIRecommendation(
            userId, "comfort_analysis", content, confidence
        );
        
        AIRecommendation saved = recommendationRepository.save(recommendation);
        
        // Send to Kafka
        kafkaTemplate.send("ai-recommendations", saved);
        
        // Send to WebSocket clients
        messagingTemplate.convertAndSend("/topic/ai/recommendations", saved);
        
        return saved;
    }
    
    public List<AIRecommendation> getRecommendationsByUser(Long userId) {
        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<AIRecommendation> getRecommendationsByType(String recommendationType) {
        return recommendationRepository.findByRecommendationTypeOrderByCreatedAtDesc(recommendationType);
    }
    
    public AIRecommendation markAsApplied(Long recommendationId) {
        return recommendationRepository.findById(recommendationId)
                .map(recommendation -> {
                    recommendation.setIsApplied(true);
                    return recommendationRepository.save(recommendation);
                })
                .orElse(null);
    }
    
    // Mock AI processing for demo
    @Scheduled(fixedRate = 30000) // Every 30 seconds
    public void generateMockRecommendations() {
        if (random.nextBoolean()) {
            Long userId = (long) (random.nextInt(100) + 1);
            Long busId = (long) (random.nextInt(4) + 1);
            
            String[] types = {"seat_suggestion", "route_optimization", "timing_recommendation", "comfort_analysis"};
            String type = types[random.nextInt(types.length)];
            
            switch (type) {
                case "seat_suggestion":
                    generateSeatRecommendation(userId, busId, "window_preference");
                    break;
                case "route_optimization":
                    generateRouteOptimization(userId, "New York", "Boston");
                    break;
                case "timing_recommendation":
                    generateTimingRecommendation(userId, "ROUTE_001");
                    break;
                case "comfort_analysis":
                    generateComfortAnalysis(userId, busId);
                    break;
            }
        }
    }
}

