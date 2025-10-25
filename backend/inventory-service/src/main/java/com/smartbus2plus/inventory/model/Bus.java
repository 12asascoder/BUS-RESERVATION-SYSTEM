package com.smartbus2plus.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Bus entity for SmartBus2+ inventory management
 */
@Entity
@Table(name = "buses")
public class Bus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "company_id")
    private Long companyId;
    
    @NotBlank
    @Column(name = "bus_number", unique = true)
    private String busNumber;
    
    @Column(name = "model")
    private String model;
    
    @NotNull
    @Positive
    private Integer capacity;
    
    @Column(columnDefinition = "jsonb")
    private String features; // JSON string for bus features
    
    @Column(name = "rfid_enabled")
    private Boolean rfidEnabled = true;
    
    @Column(name = "iot_sensors_enabled")
    private Boolean iotSensorsEnabled = true;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public Bus() {}
    
    public Bus(Long companyId, String busNumber, String model, Integer capacity) {
        this.companyId = companyId;
        this.busNumber = busNumber;
        this.model = model;
        this.capacity = capacity;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    
    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }
    
    public Boolean getRfidEnabled() { return rfidEnabled; }
    public void setRfidEnabled(Boolean rfidEnabled) { this.rfidEnabled = rfidEnabled; }
    
    public Boolean getIotSensorsEnabled() { return iotSensorsEnabled; }
    public void setIotSensorsEnabled(Boolean iotSensorsEnabled) { this.iotSensorsEnabled = iotSensorsEnabled; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

