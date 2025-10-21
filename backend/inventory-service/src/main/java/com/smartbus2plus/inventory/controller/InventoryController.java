package com.smartbus2plus.inventory.controller;

import com.smartbus2plus.inventory.model.Bus;
import com.smartbus2plus.inventory.model.Schedule;
import com.smartbus2plus.inventory.model.SeatConfiguration;
import com.smartbus2plus.inventory.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Inventory controller for SmartBus2+ bus and schedule management
 */
@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventory", description = "Bus inventory, routes, and schedules management")
public class InventoryController {
    
    @Autowired
    private InventoryService inventoryService;
    
    // Bus endpoints
    @GetMapping("/buses")
    @Operation(summary = "Get all active buses", description = "Retrieve all active buses in the system")
    public ResponseEntity<List<Bus>> getAllBuses() {
        List<Bus> buses = inventoryService.getAllActiveBuses();
        return ResponseEntity.ok(buses);
    }
    
    @GetMapping("/buses/{id}")
    @Operation(summary = "Get bus by ID", description = "Retrieve a specific bus by its ID")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        Optional<Bus> bus = inventoryService.getBusById(id);
        return bus.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/buses/number/{busNumber}")
    @Operation(summary = "Get bus by number", description = "Retrieve a specific bus by its number")
    public ResponseEntity<Bus> getBusByNumber(@PathVariable String busNumber) {
        Optional<Bus> bus = inventoryService.getBusByNumber(busNumber);
        return bus.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/buses/company/{companyId}")
    @Operation(summary = "Get buses by company", description = "Retrieve all buses for a specific company")
    public ResponseEntity<List<Bus>> getBusesByCompany(@PathVariable Long companyId) {
        List<Bus> buses = inventoryService.getBusesByCompany(companyId);
        return ResponseEntity.ok(buses);
    }
    
    // Schedule endpoints
    @GetMapping("/schedules/route/{routeId}")
    @Operation(summary = "Get schedules by route", description = "Retrieve all schedules for a specific route")
    public ResponseEntity<List<Schedule>> getSchedulesByRoute(@PathVariable Long routeId) {
        List<Schedule> schedules = inventoryService.getSchedulesByRoute(routeId);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/schedules/bus/{busId}")
    @Operation(summary = "Get schedules by bus", description = "Retrieve all schedules for a specific bus")
    public ResponseEntity<List<Schedule>> getSchedulesByBus(@PathVariable Long busId) {
        List<Schedule> schedules = inventoryService.getSchedulesByBus(busId);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/schedules/route/{routeId}/day/{dayOfWeek}")
    @Operation(summary = "Get schedules by route and day", description = "Retrieve schedules for a specific route and day of week")
    public ResponseEntity<List<Schedule>> getSchedulesByRouteAndDay(
            @PathVariable Long routeId, 
            @PathVariable Integer dayOfWeek) {
        List<Schedule> schedules = inventoryService.getSchedulesByRouteAndDay(routeId, dayOfWeek);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/schedules/{id}")
    @Operation(summary = "Get schedule by ID", description = "Retrieve a specific schedule by its ID")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        Optional<Schedule> schedule = inventoryService.getScheduleById(id);
        return schedule.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    // Seat configuration endpoints
    @GetMapping("/seats/bus/{busId}")
    @Operation(summary = "Get seat configurations by bus", description = "Retrieve all seat configurations for a specific bus")
    public ResponseEntity<List<SeatConfiguration>> getSeatConfigurationsByBus(@PathVariable Long busId) {
        List<SeatConfiguration> seats = inventoryService.getSeatConfigurationsByBus(busId);
        return ResponseEntity.ok(seats);
    }
    
    @GetMapping("/seats/bus/{busId}/seat/{seatNumber}")
    @Operation(summary = "Get specific seat configuration", description = "Retrieve a specific seat configuration")
    public ResponseEntity<SeatConfiguration> getSeatConfiguration(
            @PathVariable Long busId, 
            @PathVariable String seatNumber) {
        Optional<SeatConfiguration> seat = inventoryService.getSeatConfiguration(busId, seatNumber);
        return seat.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/seats/bus/{busId}/healthy")
    @Operation(summary = "Get healthy seats by bus", description = "Retrieve all healthy seats for a specific bus")
    public ResponseEntity<List<SeatConfiguration>> getHealthySeatsByBus(@PathVariable Long busId) {
        List<SeatConfiguration> seats = inventoryService.getHealthySeatsByBus(busId);
        return ResponseEntity.ok(seats);
    }
    
    @GetMapping("/seats/bus/{busId}/type/{seatType}")
    @Operation(summary = "Get seats by type", description = "Retrieve seats of a specific type for a bus")
    public ResponseEntity<List<SeatConfiguration>> getSeatsByType(
            @PathVariable Long busId, 
            @PathVariable SeatConfiguration.SeatType seatType) {
        List<SeatConfiguration> seats = inventoryService.getSeatsByType(busId, seatType);
        return ResponseEntity.ok(seats);
    }
    
    @PutMapping("/seats/bus/{busId}/seat/{seatNumber}/health")
    @Operation(summary = "Update seat health status", description = "Update the health status of a specific seat")
    public ResponseEntity<Void> updateSeatHealthStatus(
            @PathVariable Long busId, 
            @PathVariable String seatNumber,
            @RequestParam SeatConfiguration.HealthStatus status) {
        inventoryService.updateSeatHealthStatus(busId, seatNumber, status);
        return ResponseEntity.ok().build();
    }
}
