package com.smartbus2plus.iot.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTOs for IoT telemetry data
 */
public class IoTDto {
    
    public static class TelemetryData {
        private Long busId;
        private String sensorType;
        private String sensorId;
        private BigDecimal value;
        private String unit;
        private String location;
        private String metadata;
        
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime timestamp;
        
        public TelemetryData() {}
        
        public TelemetryData(Long busId, String sensorType, String sensorId, 
                           BigDecimal value, String unit, String location) {
            this.busId = busId;
            this.sensorType = sensorType;
            this.sensorId = sensorId;
            this.value = value;
            this.unit = unit;
            this.location = location;
            this.timestamp = LocalDateTime.now();
        }
        
        // Getters and Setters
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
    
    public static class BusEnvironmentData {
        private Long busId;
        private BigDecimal temperature;
        private BigDecimal humidity;
        private BigDecimal vibration;
        private BigDecimal noiseLevel;
        private BigDecimal speed;
        private BigDecimal comfortScore;
        private String weatherCondition;
        private LocalDateTime timestamp;
        
        public BusEnvironmentData() {}
        
        public BusEnvironmentData(Long busId, BigDecimal temperature, BigDecimal humidity, 
                                 BigDecimal vibration, BigDecimal noiseLevel, BigDecimal speed) {
            this.busId = busId;
            this.temperature = temperature;
            this.humidity = humidity;
            this.vibration = vibration;
            this.noiseLevel = noiseLevel;
            this.speed = speed;
            this.timestamp = LocalDateTime.now();
            this.comfortScore = calculateComfortScore(temperature, humidity, vibration, noiseLevel);
        }
        
        private BigDecimal calculateComfortScore(BigDecimal temp, BigDecimal humidity, 
                                               BigDecimal vibration, BigDecimal noise) {
            // Simple comfort score calculation (0-1 scale)
            BigDecimal tempScore = BigDecimal.valueOf(Math.max(0, 1 - Math.abs(temp.doubleValue() - 22) / 10));
            BigDecimal humidityScore = BigDecimal.valueOf(Math.max(0, 1 - Math.abs(humidity.doubleValue() - 50) / 30));
            BigDecimal vibrationScore = BigDecimal.valueOf(Math.max(0, 1 - vibration.doubleValue() / 5));
            BigDecimal noiseScore = BigDecimal.valueOf(Math.max(0, 1 - noise.doubleValue() / 80));
            
            return tempScore.add(humidityScore).add(vibrationScore).add(noiseScore)
                    .divide(BigDecimal.valueOf(4), 2, BigDecimal.ROUND_HALF_UP);
        }
        
        // Getters and Setters
        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }
        
        public BigDecimal getTemperature() { return temperature; }
        public void setTemperature(BigDecimal temperature) { this.temperature = temperature; }
        
        public BigDecimal getHumidity() { return humidity; }
        public void setHumidity(BigDecimal humidity) { this.humidity = humidity; }
        
        public BigDecimal getVibration() { return vibration; }
        public void setVibration(BigDecimal vibration) { this.vibration = vibration; }
        
        public BigDecimal getNoiseLevel() { return noiseLevel; }
        public void setNoiseLevel(BigDecimal noiseLevel) { this.noiseLevel = noiseLevel; }
        
        public BigDecimal getSpeed() { return speed; }
        public void setSpeed(BigDecimal speed) { this.speed = speed; }
        
        public BigDecimal getComfortScore() { return comfortScore; }
        public void setComfortScore(BigDecimal comfortScore) { this.comfortScore = comfortScore; }
        
        public String getWeatherCondition() { return weatherCondition; }
        public void setWeatherCondition(String weatherCondition) { this.weatherCondition = weatherCondition; }
        
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
    
    public static class SeatOccupancyData {
        private Long busId;
        private String seatNumber;
        private boolean occupied;
        private BigDecimal pressureValue;
        private String sensorId;
        private LocalDateTime timestamp;
        
        public SeatOccupancyData() {}
        
        public SeatOccupancyData(Long busId, String seatNumber, boolean occupied, 
                               BigDecimal pressureValue, String sensorId) {
            this.busId = busId;
            this.seatNumber = seatNumber;
            this.occupied = occupied;
            this.pressureValue = pressureValue;
            this.sensorId = sensorId;
            this.timestamp = LocalDateTime.now();
        }
        
        // Getters and Setters
        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }
        
        public String getSeatNumber() { return seatNumber; }
        public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
        
        public boolean isOccupied() { return occupied; }
        public void setOccupied(boolean occupied) { this.occupied = occupied; }
        
        public BigDecimal getPressureValue() { return pressureValue; }
        public void setPressureValue(BigDecimal pressureValue) { this.pressureValue = pressureValue; }
        
        public String getSensorId() { return sensorId; }
        public void setSensorId(String sensorId) { this.sensorId = sensorId; }
        
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
}

