package com.smartbus2plus.analytics.controller;

import com.smartbus2plus.analytics.model.EnergyAnalytics;
import com.smartbus2plus.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Analytics controller for SmartBus2+
 */
@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Energy optimization and performance analytics")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @PostMapping("/energy")
    @Operation(summary = "Calculate green score", description = "Calculate energy efficiency and green score for a trip")
    public ResponseEntity<EnergyAnalytics> calculateGreenScore(
            @RequestParam Long busId,
            @RequestParam String tripId,
            @RequestParam Long driverId,
            @RequestParam BigDecimal fuelConsumption,
            @RequestParam BigDecimal distanceKm) {
        EnergyAnalytics analytics = analyticsService.calculateGreenScore(
            busId, tripId, driverId, fuelConsumption, distanceKm
        );
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/energy/bus/{busId}")
    @Operation(summary = "Get analytics by bus", description = "Retrieve energy analytics for a specific bus")
    public ResponseEntity<List<EnergyAnalytics>> getAnalyticsByBus(@PathVariable Long busId) {
        List<EnergyAnalytics> analytics = analyticsService.getAnalyticsByBus(busId);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/energy/driver/{driverId}")
    @Operation(summary = "Get analytics by driver", description = "Retrieve energy analytics for a specific driver")
    public ResponseEntity<List<EnergyAnalytics>> getAnalyticsByDriver(@PathVariable Long driverId) {
        List<EnergyAnalytics> analytics = analyticsService.getAnalyticsByDriver(driverId);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/energy/date-range")
    @Operation(summary = "Get analytics by date range", description = "Retrieve analytics within a date range")
    public ResponseEntity<List<EnergyAnalytics>> getAnalyticsByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<EnergyAnalytics> analytics = analyticsService.getAnalyticsByDateRange(startDate, endDate);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/energy/bus/{busId}/average-green-score")
    @Operation(summary = "Get average green score", description = "Get average green score for a bus")
    public ResponseEntity<BigDecimal> getAverageGreenScore(@PathVariable Long busId) {
        BigDecimal averageScore = analyticsService.getAverageGreenScore(busId);
        return ResponseEntity.ok(averageScore);
    }
    
    @GetMapping("/energy/bus/{busId}/average-efficiency")
    @Operation(summary = "Get average fuel efficiency", description = "Get average fuel efficiency for a bus")
    public ResponseEntity<BigDecimal> getAverageFuelEfficiency(@PathVariable Long busId) {
        BigDecimal averageEfficiency = analyticsService.getAverageFuelEfficiency(busId);
        return ResponseEntity.ok(averageEfficiency);
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check Analytics service health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Analytics Service is running");
    }
}
