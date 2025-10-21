package com.smartbus2plus.analytics.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Energy Analytics entity for SmartBus2+
 */
@Entity
@Table(name = "energy_analytics")
public class EnergyAnalytics {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "bus_id")
    private Long busId;
    
    @NotBlank
    @Column(name = "trip_id")
    private String tripId;
    
    @Column(name = "driver_id")
    private Long driverId;
    
    @Column(name = "fuel_consumption", precision = 10, scale = 2)
    private BigDecimal fuelConsumption; // liters
    
    @Column(name = "distance_km", precision = 10, scale = 2)
    private BigDecimal distanceKm;
    
    @Column(name = "green_score", precision = 3, scale = 2)
    private BigDecimal greenScore = BigDecimal.valueOf(0.00); // 0.00 to 1.00
    
    @Column(name = "efficiency_metrics", columnDefinition = "jsonb")
    private String efficiencyMetrics; // JSON string for efficiency data
    
    @NotNull
    @Column(name = "trip_date")
    private LocalDate tripDate;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public EnergyAnalytics() {}
    
    public EnergyAnalytics(Long busId, String tripId, Long driverId, 
                          BigDecimal fuelConsumption, BigDecimal distanceKm, LocalDate tripDate) {
        this.busId = busId;
        this.tripId = tripId;
        this.driverId = driverId;
        this.fuelConsumption = fuelConsumption;
        this.distanceKm = distanceKm;
        this.tripDate = tripDate;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }
    
    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }
    
    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    
    public BigDecimal getFuelConsumption() { return fuelConsumption; }
    public void setFuelConsumption(BigDecimal fuelConsumption) { this.fuelConsumption = fuelConsumption; }
    
    public BigDecimal getDistanceKm() { return distanceKm; }
    public void setDistanceKm(BigDecimal distanceKm) { this.distanceKm = distanceKm; }
    
    public BigDecimal getGreenScore() { return greenScore; }
    public void setGreenScore(BigDecimal greenScore) { this.greenScore = greenScore; }
    
    public String getEfficiencyMetrics() { return efficiencyMetrics; }
    public void setEfficiencyMetrics(String efficiencyMetrics) { this.efficiencyMetrics = efficiencyMetrics; }
    
    public LocalDate getTripDate() { return tripDate; }
    public void setTripDate(LocalDate tripDate) { this.tripDate = tripDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
