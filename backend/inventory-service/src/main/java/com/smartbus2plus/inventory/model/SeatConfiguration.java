package com.smartbus2plus.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Seat Configuration entity for SmartBus2+ smart seat system
 */
@Entity
@Table(name = "seat_configurations")
public class SeatConfiguration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "bus_id")
    private Long busId;
    
    @NotBlank
    @Column(name = "seat_number")
    private String seatNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "seat_type", columnDefinition = "varchar(20) default 'STANDARD'")
    private SeatType seatType = SeatType.STANDARD;
    
    @NotNull
    @Column(name = "row_number")
    private Integer rowNumber;
    
    @NotNull
    @Column(name = "column_number")
    private Integer columnNumber;
    
    @Column(name = "comfort_score", precision = 3, scale = 2)
    private BigDecimal comfortScore = BigDecimal.valueOf(1.00);
    
    @Enumerated(EnumType.STRING)
    @Column(name = "health_status", columnDefinition = "varchar(20) default 'HEALTHY'")
    private HealthStatus healthStatus = HealthStatus.HEALTHY;
    
    @Column(name = "pressure_sensor_id")
    private String pressureSensorId;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public enum SeatType {
        STANDARD, PREMIUM, WINDOW, AISLE
    }
    
    public enum HealthStatus {
        HEALTHY, MAINTENANCE, BROKEN
    }
    
    // Constructors
    public SeatConfiguration() {}
    
    public SeatConfiguration(Long busId, String seatNumber, SeatType seatType, 
                           Integer rowNumber, Integer columnNumber) {
        this.busId = busId;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }
    
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    
    public SeatType getSeatType() { return seatType; }
    public void setSeatType(SeatType seatType) { this.seatType = seatType; }
    
    public Integer getRowNumber() { return rowNumber; }
    public void setRowNumber(Integer rowNumber) { this.rowNumber = rowNumber; }
    
    public Integer getColumnNumber() { return columnNumber; }
    public void setColumnNumber(Integer columnNumber) { this.columnNumber = columnNumber; }
    
    public BigDecimal getComfortScore() { return comfortScore; }
    public void setComfortScore(BigDecimal comfortScore) { this.comfortScore = comfortScore; }
    
    public HealthStatus getHealthStatus() { return healthStatus; }
    public void setHealthStatus(HealthStatus healthStatus) { this.healthStatus = healthStatus; }
    
    public String getPressureSensorId() { return pressureSensorId; }
    public void setPressureSensorId(String pressureSensorId) { this.pressureSensorId = pressureSensorId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
