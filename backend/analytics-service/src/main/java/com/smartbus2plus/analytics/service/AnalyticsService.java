package com.smartbus2plus.analytics.service;

import com.smartbus2plus.analytics.model.EnergyAnalytics;
import com.smartbus2plus.analytics.repository.EnergyAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

/**
 * Analytics service for SmartBus2+ energy optimization
 */
@Service
public class AnalyticsService {
    
    @Autowired
    private EnergyAnalyticsRepository energyAnalyticsRepository;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    private final Random random = new Random();
    
    public EnergyAnalytics calculateGreenScore(Long busId, String tripId, Long driverId,
                                             BigDecimal fuelConsumption, BigDecimal distanceKm) {
        
        // Calculate fuel efficiency (km per liter)
        BigDecimal fuelEfficiency = distanceKm.divide(fuelConsumption, 2, BigDecimal.ROUND_HALF_UP);
        
        // Mock green score calculation based on various factors
        BigDecimal efficiencyScore = fuelEfficiency.divide(BigDecimal.valueOf(10), 2, BigDecimal.ROUND_HALF_UP)
                .min(BigDecimal.ONE); // Cap at 1.0
        
        BigDecimal smoothnessScore = BigDecimal.valueOf(0.7 + random.nextDouble() * 0.3);
        BigDecimal idleTimeScore = BigDecimal.valueOf(0.8 + random.nextDouble() * 0.2);
        
        // Weighted average for green score
        BigDecimal greenScore = efficiencyScore.multiply(BigDecimal.valueOf(0.5))
                .add(smoothnessScore.multiply(BigDecimal.valueOf(0.3)))
                .add(idleTimeScore.multiply(BigDecimal.valueOf(0.2)));
        
        // Create efficiency metrics JSON
        String efficiencyMetrics = String.format(
            "{\"fuelEfficiency\":%.2f,\"smoothnessScore\":%.2f,\"idleTimeScore\":%.2f,\"accelerationEvents\":%d,\"brakingEvents\":%d}",
            fuelEfficiency, smoothnessScore, idleTimeScore, random.nextInt(20), random.nextInt(15)
        );
        
        EnergyAnalytics analytics = new EnergyAnalytics(
            busId, tripId, driverId, fuelConsumption, distanceKm, LocalDate.now()
        );
        analytics.setGreenScore(greenScore);
        analytics.setEfficiencyMetrics(efficiencyMetrics);
        
        EnergyAnalytics saved = energyAnalyticsRepository.save(analytics);
        
        // Send to Kafka
        kafkaTemplate.send("energy-analytics", saved);
        
        return saved;
    }
    
    public List<EnergyAnalytics> getAnalyticsByBus(Long busId) {
        return energyAnalyticsRepository.findByBusIdOrderByTripDateDesc(busId);
    }
    
    public List<EnergyAnalytics> getAnalyticsByDriver(Long driverId) {
        return energyAnalyticsRepository.findByDriverIdOrderByTripDateDesc(driverId);
    }
    
    public List<EnergyAnalytics> getAnalyticsByDateRange(LocalDate startDate, LocalDate endDate) {
        return energyAnalyticsRepository.findByTripDateBetweenOrderByTripDateDesc(startDate, endDate);
    }
    
    public BigDecimal getAverageGreenScore(Long busId) {
        return energyAnalyticsRepository.findAverageGreenScoreByBusId(busId);
    }
    
    public BigDecimal getAverageFuelEfficiency(Long busId) {
        return energyAnalyticsRepository.findAverageFuelEfficiencyByBusId(busId);
    }
    
    // Mock data generation for demo
    @Scheduled(fixedRate = 60000) // Every minute
    public void generateMockAnalytics() {
        if (random.nextBoolean()) {
            Long busId = (long) (random.nextInt(4) + 1);
            String tripId = "TRIP_" + System.currentTimeMillis();
            Long driverId = (long) (random.nextInt(10) + 1);
            
            BigDecimal fuelConsumption = BigDecimal.valueOf(80 + random.nextDouble() * 40); // 80-120 liters
            BigDecimal distanceKm = BigDecimal.valueOf(200 + random.nextDouble() * 300); // 200-500 km
            
            calculateGreenScore(busId, tripId, driverId, fuelConsumption, distanceKm);
        }
    }
}

