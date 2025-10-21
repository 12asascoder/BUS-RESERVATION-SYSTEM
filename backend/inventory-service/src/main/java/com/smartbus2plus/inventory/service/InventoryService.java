package com.smartbus2plus.inventory.service;

import com.smartbus2plus.inventory.model.Bus;
import com.smartbus2plus.inventory.model.Schedule;
import com.smartbus2plus.inventory.model.SeatConfiguration;
import com.smartbus2plus.inventory.repository.BusRepository;
import com.smartbus2plus.inventory.repository.ScheduleRepository;
import com.smartbus2plus.inventory.repository.SeatConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Inventory service for SmartBus2+ bus and schedule management
 */
@Service
public class InventoryService {
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private ScheduleRepository scheduleRepository;
    
    @Autowired
    private SeatConfigurationRepository seatConfigurationRepository;
    
    // Bus operations
    public List<Bus> getAllActiveBuses() {
        return busRepository.findByIsActiveTrue();
    }
    
    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }
    
    public Optional<Bus> getBusByNumber(String busNumber) {
        return busRepository.findByBusNumber(busNumber);
    }
    
    public List<Bus> getBusesByCompany(Long companyId) {
        return busRepository.findByCompanyIdAndIsActiveTrue(companyId);
    }
    
    public Bus saveBus(Bus bus) {
        return busRepository.save(bus);
    }
    
    // Schedule operations
    public List<Schedule> getSchedulesByRoute(Long routeId) {
        return scheduleRepository.findByRouteIdAndIsActiveTrue(routeId);
    }
    
    public List<Schedule> getSchedulesByBus(Long busId) {
        return scheduleRepository.findByBusIdAndIsActiveTrue(busId);
    }
    
    public List<Schedule> getSchedulesByRouteAndDay(Long routeId, Integer dayOfWeek) {
        return scheduleRepository.findByRouteIdAndDayOfWeek(routeId, dayOfWeek);
    }
    
    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }
    
    public Schedule saveSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }
    
    // Seat configuration operations
    public List<SeatConfiguration> getSeatConfigurationsByBus(Long busId) {
        return seatConfigurationRepository.findByBusId(busId);
    }
    
    public Optional<SeatConfiguration> getSeatConfiguration(Long busId, String seatNumber) {
        return seatConfigurationRepository.findByBusIdAndSeatNumber(busId, seatNumber);
    }
    
    public List<SeatConfiguration> getHealthySeatsByBus(Long busId) {
        return seatConfigurationRepository.findHealthySeatsByBusId(busId);
    }
    
    public List<SeatConfiguration> getSeatsByType(Long busId, SeatConfiguration.SeatType seatType) {
        return seatConfigurationRepository.findByBusIdAndSeatType(busId, seatType);
    }
    
    public SeatConfiguration saveSeatConfiguration(SeatConfiguration seatConfiguration) {
        return seatConfigurationRepository.save(seatConfiguration);
    }
    
    public void updateSeatHealthStatus(Long busId, String seatNumber, SeatConfiguration.HealthStatus status) {
        Optional<SeatConfiguration> seat = seatConfigurationRepository.findByBusIdAndSeatNumber(busId, seatNumber);
        if (seat.isPresent()) {
            SeatConfiguration seatConfig = seat.get();
            seatConfig.setHealthStatus(status);
            seatConfigurationRepository.save(seatConfig);
        }
    }
}
