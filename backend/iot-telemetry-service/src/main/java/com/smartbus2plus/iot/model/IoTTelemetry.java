package com.smartbus2plus.iot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * IoT Telemetry entity for SmartBus2+ sensor data
 */
@Entity
@Table(name = "iot_telemetry")
public class IoTTelemetry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "bus_id")
    private Long busId;
    
    @NotBlank
    @Column(name = "sensor_type")
    private String sensorType; // temperature, humidity, vibration, pressure, speed, etc.
    
    @NotBlank
    @Column(name = "sensor_id")
    private String sensorId;
    
    @NotNull
    @Column(precision = 10, scale = 4)
    private BigDecimal value;
    
    @NotBlank
    private String unit; // °C, %, m/s², Pa, km/h, etc.
    
    @Column(name = "location")
    private String location; // seat_number, cabin, engine, etc.
    
    @Column(columnDefinition = "jsonb")
    private String metadata; // Additional sensor data
    
    @CreationTimestamp
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    // Constructors
    public IoTTelemetry() {}
    
    public IoTTelemetry(Long busId, String sensorType, String sensorId, 
                       BigDecimal value, String unit, String location) {
        this.busId = busId;
        this.sensorType = sensorType;
        this.sensorId = sensorId;
        this.value = value;
        this.unit = unit;
        this.location = location;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }
    
    public String getSensorType() { return sensorType; }
    public void setSensorType(String sensorType) { this.sensorType = sensorType; }
    
    public String getSensorId() { return sensorId; }
    public void setSensorId(String sensorId) { this.sensorId = sensorId; }
    
    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }
    
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

