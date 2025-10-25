package com.smartbus2plus.iot.controller;

import com.smartbus2plus.iot.dto.IoTDto;
import com.smartbus2plus.iot.model.IoTTelemetry;
import com.smartbus2plus.iot.service.IoTTelemetryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * IoT Telemetry controller for SmartBus2+
 */
@RestController
@RequestMapping("/api/iot")
@Tag(name = "IoT Telemetry", description = "IoT sensor data collection and real-time streaming")
public class IoTTelemetryController {
    
    @Autowired
    private IoTTelemetryService telemetryService;
    
    @PostMapping("/telemetry")
    @Operation(summary = "Send telemetry data", description = "Send IoT sensor data to the system")
    public ResponseEntity<IoTTelemetry> sendTelemetryData(@RequestBody IoTDto.TelemetryData telemetryData) {
        IoTTelemetry saved = telemetryService.saveTelemetryData(
            telemetryData.getBusId(),
            telemetryData.getSensorType(),
            telemetryData.getSensorId(),
            telemetryData.getValue(),
            telemetryData.getUnit(),
            telemetryData.getLocation()
        );
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/bus/{busId}/telemetry")
    @Operation(summary = "Get telemetry data by bus", description = "Retrieve all telemetry data for a specific bus")
    public ResponseEntity<List<IoTTelemetry>> getTelemetryDataByBus(@PathVariable Long busId) {
        List<IoTTelemetry> data = telemetryService.getTelemetryDataByBus(busId);
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/bus/{busId}/telemetry/{sensorType}")
    @Operation(summary = "Get telemetry data by bus and sensor type", description = "Retrieve telemetry data for a specific bus and sensor type")
    public ResponseEntity<List<IoTTelemetry>> getTelemetryDataByBusAndType(
            @PathVariable Long busId, 
            @PathVariable String sensorType) {
        List<IoTTelemetry> data = telemetryService.getTelemetryDataByBusAndType(busId, sensorType);
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/bus/{busId}/recent/{minutes}")
    @Operation(summary = "Get recent telemetry data", description = "Retrieve recent telemetry data for a specific bus within the last N minutes")
    public ResponseEntity<List<IoTTelemetry>> getRecentTelemetryData(
            @PathVariable Long busId, 
            @PathVariable int minutes) {
        List<IoTTelemetry> data = telemetryService.getRecentTelemetryData(busId, minutes);
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/bus/{busId}/environment")
    @Operation(summary = "Get current bus environment", description = "Get current environmental conditions for a specific bus")
    public ResponseEntity<IoTDto.BusEnvironmentData> getCurrentBusEnvironment(@PathVariable Long busId) {
        IoTDto.BusEnvironmentData environment = telemetryService.getCurrentBusEnvironment(busId);
        return ResponseEntity.ok(environment);
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check IoT service health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("IoT Telemetry Service is running");
    }
}

