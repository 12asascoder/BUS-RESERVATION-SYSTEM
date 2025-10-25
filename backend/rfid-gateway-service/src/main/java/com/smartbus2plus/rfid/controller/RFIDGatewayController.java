package com.smartbus2plus.rfid.controller;

import com.smartbus2plus.rfid.dto.RFIDDto;
import com.smartbus2plus.rfid.model.RFIDEvent;
import com.smartbus2plus.rfid.service.RFIDGatewayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RFID Gateway controller for SmartBus2+ smart boarding system
 */
@RestController
@RequestMapping("/api/rfid")
@Tag(name = "RFID Gateway", description = "RFID-based smart boarding system")
public class RFIDGatewayController {
    
    @Autowired
    private RFIDGatewayService rfidGatewayService;
    
    @PostMapping("/scan")
    @Operation(summary = "Process RFID scan", description = "Process RFID ticket scan for boarding")
    public ResponseEntity<RFIDDto.RFIDScanResponse> processRFIDScan(@RequestBody RFIDDto.RFIDScanRequest scanRequest) {
        RFIDDto.RFIDScanResponse response = rfidGatewayService.processRFIDScan(scanRequest);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/events/bus/{busId}")
    @Operation(summary = "Get RFID events by bus", description = "Retrieve all RFID events for a specific bus")
    public ResponseEntity<List<RFIDEvent>> getRFIDEventsByBus(@PathVariable Long busId) {
        List<RFIDEvent> events = rfidGatewayService.getRFIDEventsByBus(busId);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/events/bus/{busId}/recent/{minutes}")
    @Operation(summary = "Get recent RFID events", description = "Retrieve recent RFID events for a specific bus")
    public ResponseEntity<List<RFIDEvent>> getRecentRFIDEvents(
            @PathVariable Long busId, 
            @PathVariable int minutes) {
        List<RFIDEvent> events = rfidGatewayService.getRecentRFIDEvents(busId, minutes);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/boarding-status/{busId}")
    @Operation(summary = "Get boarding status", description = "Get current boarding status for a specific bus")
    public ResponseEntity<RFIDDto.BoardingStatus> getBoardingStatus(@PathVariable Long busId) {
        RFIDDto.BoardingStatus status = rfidGatewayService.getBoardingStatus(busId);
        return ResponseEntity.ok(status);
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check RFID Gateway service health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("RFID Gateway Service is running");
    }
}

