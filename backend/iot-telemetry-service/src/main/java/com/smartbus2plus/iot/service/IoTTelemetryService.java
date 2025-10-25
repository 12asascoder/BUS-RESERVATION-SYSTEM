package com.smartbus2plus.iot.service;

import com.smartbus2plus.iot.dto.IoTDto;
import com.smartbus2plus.iot.model.IoTTelemetry;
import com.smartbus2plus.iot.repository.IoTTelemetryRepository;
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
 * IoT Telemetry service for SmartBus2+ real-time sensor data
 */
@Service
public class IoTTelemetryService {
    
    @Autowired
    private IoTTelemetryRepository telemetryRepository;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    private final Random random = new Random();
    
    // Mock sensor data generation for demo purposes
    @Scheduled(fixedRate = 5000) // Every 5 seconds
    public void generateMockSensorData() {
        // Generate data for buses 1-4
        for (Long busId = 1L; busId <= 4L; busId++) {
            generateBusEnvironmentData(busId);
            generateSeatOccupancyData(busId);
        }
    }
    
    private void generateBusEnvironmentData(Long busId) {
        // Temperature: 18-28°C
        BigDecimal temperature = BigDecimal.valueOf(18 + random.nextDouble() * 10);
        
        // Humidity: 30-70%
        BigDecimal humidity = BigDecimal.valueOf(30 + random.nextDouble() * 40);
        
        // Vibration: 0-3 m/s²
        BigDecimal vibration = BigDecimal.valueOf(random.nextDouble() * 3);
        
        // Noise: 40-80 dB
        BigDecimal noiseLevel = BigDecimal.valueOf(40 + random.nextDouble() * 40);
        
        // Speed: 0-100 km/h
        BigDecimal speed = BigDecimal.valueOf(random.nextDouble() * 100);
        
        IoTDto.BusEnvironmentData envData = new IoTDto.BusEnvironmentData(
            busId, temperature, humidity, vibration, noiseLevel, speed
        );
        
        // Save to database
        saveTelemetryData(busId, "temperature", "TEMP_" + busId, temperature, "°C", "cabin");
        saveTelemetryData(busId, "humidity", "HUM_" + busId, humidity, "%", "cabin");
        saveTelemetryData(busId, "vibration", "VIB_" + busId, vibration, "m/s²", "cabin");
        saveTelemetryData(busId, "noise", "NOISE_" + busId, noiseLevel, "dB", "cabin");
        saveTelemetryData(busId, "speed", "SPEED_" + busId, speed, "km/h", "engine");
        
        // Send to Kafka
        kafkaTemplate.send("iot-telemetry", envData);
        
        // Send to WebSocket clients
        messagingTemplate.convertAndSend("/topic/iot/bus/" + busId, envData);
        messagingTemplate.convertAndSend("/topic/iot/environment", envData);
    }
    
    private void generateSeatOccupancyData(Long busId) {
        // Generate occupancy data for seats 1A-12D (48 seats)
        for (int row = 1; row <= 12; row++) {
            for (char col = 'A'; col <= 'D'; col++) {
                String seatNumber = row + String.valueOf(col);
                boolean occupied = random.nextBoolean();
                BigDecimal pressureValue = occupied ? 
                    BigDecimal.valueOf(50 + random.nextDouble() * 50) : 
                    BigDecimal.valueOf(random.nextDouble() * 5);
                
                IoTDto.SeatOccupancyData occupancyData = new IoTDto.SeatOccupancyData(
                    busId, seatNumber, occupied, pressureValue, "SENSOR_" + busId + "_" + seatNumber
                );
                
                // Save to database
                saveTelemetryData(busId, "pressure", "SENSOR_" + busId + "_" + seatNumber, 
                                pressureValue, "Pa", seatNumber);
                
                // Send to WebSocket clients
                messagingTemplate.convertAndSend("/topic/iot/seats/" + busId, occupancyData);
            }
        }
    }
    
    public IoTTelemetry saveTelemetryData(Long busId, String sensorType, String sensorId, 
                                        BigDecimal value, String unit, String location) {
        IoTTelemetry telemetry = new IoTTelemetry(busId, sensorType, sensorId, value, unit, location);
        telemetry.setTimestamp(LocalDateTime.now());
        return telemetryRepository.save(telemetry);
    }
    
    public List<IoTTelemetry> getTelemetryDataByBus(Long busId) {
        return telemetryRepository.findByBusIdOrderByTimestampDesc(busId);
    }
    
    public List<IoTTelemetry> getTelemetryDataByBusAndType(Long busId, String sensorType) {
        return telemetryRepository.findByBusIdAndSensorTypeOrderByTimestampDesc(busId, sensorType);
    }
    
    public List<IoTTelemetry> getRecentTelemetryData(Long busId, int minutes) {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(minutes);
        return telemetryRepository.findByBusIdAndTimestampAfterOrderByTimestampDesc(busId, cutoff);
    }
    
    public IoTDto.BusEnvironmentData getCurrentBusEnvironment(Long busId) {
        List<IoTTelemetry> recentData = getRecentTelemetryData(busId, 1);
        
        BigDecimal temperature = BigDecimal.ZERO;
        BigDecimal humidity = BigDecimal.ZERO;
        BigDecimal vibration = BigDecimal.ZERO;
        BigDecimal noiseLevel = BigDecimal.ZERO;
        BigDecimal speed = BigDecimal.ZERO;
        
        for (IoTTelemetry data : recentData) {
            switch (data.getSensorType()) {
                case "temperature" -> temperature = data.getValue();
                case "humidity" -> humidity = data.getValue();
                case "vibration" -> vibration = data.getValue();
                case "noise" -> noiseLevel = data.getValue();
                case "speed" -> speed = data.getValue();
            }
        }
        
        return new IoTDto.BusEnvironmentData(busId, temperature, humidity, vibration, noiseLevel, speed);
    }
}

