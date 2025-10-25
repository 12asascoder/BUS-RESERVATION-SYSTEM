package com.smartbus2plus.ai.controller;

import com.smartbus2plus.ai.model.AIRecommendation;
import com.smartbus2plus.ai.service.AIAssistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AI Assist controller for SmartBus2+
 */
@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Assistant", description = "AI-powered travel recommendations and insights")
public class AIAssistController {
    
    @Autowired
    private AIAssistService aiAssistService;
    
    @PostMapping("/recommendations/seat")
    @Operation(summary = "Generate seat recommendation", description = "Get AI-powered seat recommendations")
    public ResponseEntity<AIRecommendation> generateSeatRecommendation(
            @RequestParam Long userId,
            @RequestParam Long busId,
            @RequestParam(required = false) String preferences) {
        AIRecommendation recommendation = aiAssistService.generateSeatRecommendation(userId, busId, preferences);
        return ResponseEntity.ok(recommendation);
    }
    
    @PostMapping("/recommendations/route")
    @Operation(summary = "Generate route optimization", description = "Get AI-powered route optimization")
    public ResponseEntity<AIRecommendation> generateRouteOptimization(
            @RequestParam Long userId,
            @RequestParam String origin,
            @RequestParam String destination) {
        AIRecommendation recommendation = aiAssistService.generateRouteOptimization(userId, origin, destination);
        return ResponseEntity.ok(recommendation);
    }
    
    @PostMapping("/recommendations/timing")
    @Operation(summary = "Generate timing recommendation", description = "Get AI-powered optimal timing suggestions")
    public ResponseEntity<AIRecommendation> generateTimingRecommendation(
            @RequestParam Long userId,
            @RequestParam String routeId) {
        AIRecommendation recommendation = aiAssistService.generateTimingRecommendation(userId, routeId);
        return ResponseEntity.ok(recommendation);
    }
    
    @PostMapping("/recommendations/comfort")
    @Operation(summary = "Generate comfort analysis", description = "Get AI-powered comfort analysis")
    public ResponseEntity<AIRecommendation> generateComfortAnalysis(
            @RequestParam Long userId,
            @RequestParam Long busId) {
        AIRecommendation recommendation = aiAssistService.generateComfortAnalysis(userId, busId);
        return ResponseEntity.ok(recommendation);
    }
    
    @GetMapping("/recommendations/user/{userId}")
    @Operation(summary = "Get user recommendations", description = "Retrieve all AI recommendations for a user")
    public ResponseEntity<List<AIRecommendation>> getUserRecommendations(@PathVariable Long userId) {
        List<AIRecommendation> recommendations = aiAssistService.getRecommendationsByUser(userId);
        return ResponseEntity.ok(recommendations);
    }
    
    @GetMapping("/recommendations/type/{type}")
    @Operation(summary = "Get recommendations by type", description = "Retrieve recommendations by type")
    public ResponseEntity<List<AIRecommendation>> getRecommendationsByType(@PathVariable String type) {
        List<AIRecommendation> recommendations = aiAssistService.getRecommendationsByType(type);
        return ResponseEntity.ok(recommendations);
    }
    
    @PutMapping("/recommendations/{id}/apply")
    @Operation(summary = "Mark recommendation as applied", description = "Mark a recommendation as applied")
    public ResponseEntity<AIRecommendation> markAsApplied(@PathVariable Long id) {
        AIRecommendation recommendation = aiAssistService.markAsApplied(id);
        if (recommendation != null) {
            return ResponseEntity.ok(recommendation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check AI Assist service health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("AI Assist Service is running");
    }
}

