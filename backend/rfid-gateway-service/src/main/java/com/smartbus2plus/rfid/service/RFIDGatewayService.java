package com.smartbus2plus.rfid.service;

import com.smartbus2plus.rfid.dto.RFIDDto;
import com.smartbus2plus.rfid.model.RFIDEvent;
import com.smartbus2plus.rfid.repository.RFIDEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

/**
 * RFID Gateway service for SmartBus2+ smart boarding system
 */
@Service
public class RFIDGatewayService {
    
    @Autowired
    private RFIDEventRepository rfidEventRepository;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    private final Random random = new Random();
    
    public RFIDDto.RFIDScanResponse processRFIDScan(RFIDDto.RFIDScanRequest scanRequest) {
        // Simulate RFID ticket validation
        boolean isValidTicket = validateTicket(scanRequest.getTicketId());
        
        RFIDEvent.EventType eventType;
        boolean success;
        String message;
        
        if (isValidTicket) {
            eventType = RFIDEvent.EventType.BOARDING;
            success = true;
            message = "Boarding successful";
        } else {
            eventType = RFIDEvent.EventType.SCAN_FAILED;
            success = false;
            message = "Invalid ticket";
        }
        
        // Create RFID event
        RFIDEvent event = new RFIDEvent(
            scanRequest.getBusId(),
            scanRequest.getRfidReaderId(),
            scanRequest.getTicketId(),
            getPassengerIdFromTicket(scanRequest.getTicketId()),
            eventType,
            scanRequest.getLocation(),
            success
        );
        
        event.setEventTime(LocalDateTime.now());
        rfidEventRepository.save(event);
        
        // Send to Kafka
        kafkaTemplate.send("rfid-events", event);
        
        // Send to WebSocket clients
        messagingTemplate.convertAndSend("/topic/rfid/events", event);
        messagingTemplate.convertAndSend("/topic/rfid/bus/" + scanRequest.getBusId(), event);
        
        // Create response
        RFIDDto.RFIDScanResponse response = new RFIDDto.RFIDScanResponse(success, message, eventType);
        if (success) {
            response.setPassengerId(getPassengerIdFromTicket(scanRequest.getTicketId()));
            response.setSeatNumber(getSeatNumberFromTicket(scanRequest.getTicketId()));
            response.setBusNumber("BUS-" + scanRequest.getBusId());
        }
        
        return response;
    }
    
    private boolean validateTicket(String ticketId) {
        // Mock ticket validation logic
        // In real implementation, this would check against booking database
        return ticketId != null && ticketId.length() > 5;
    }
    
    private Long getPassengerIdFromTicket(String ticketId) {
        // Mock passenger ID extraction
        return random.nextLong(1000) + 1;
    }
    
    private String getSeatNumberFromTicket(String ticketId) {
        // Mock seat number extraction
        int row = random.nextInt(12) + 1;
        char col = (char) ('A' + random.nextInt(4));
        return row + String.valueOf(col);
    }
    
    public List<RFIDEvent> getRFIDEventsByBus(Long busId) {
        return rfidEventRepository.findByBusIdOrderByEventTimeDesc(busId);
    }
    
    public List<RFIDEvent> getRecentRFIDEvents(Long busId, int minutes) {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(minutes);
        return rfidEventRepository.findByBusIdAndEventTimeAfterOrderByEventTimeDesc(busId, cutoff);
    }
    
    public RFIDDto.BoardingStatus getBoardingStatus(Long busId) {
        List<RFIDEvent> recentEvents = getRecentRFIDEvents(busId, 60); // Last hour
        
        int totalPassengers = recentEvents.size();
        int boardedPassengers = (int) recentEvents.stream()
            .filter(event -> event.getEventType() == RFIDEvent.EventType.BOARDING && event.getSuccess())
            .count();
        int missedPassengers = totalPassengers - boardedPassengers;
        
        return new RFIDDto.BoardingStatus(busId, "BUS-" + busId, totalPassengers, boardedPassengers, missedPassengers);
    }
    
    // Mock RFID scanner simulation
    @Scheduled(fixedRate = 10000) // Every 10 seconds
    public void simulateRFIDScans() {
        // Simulate random RFID scans for demo purposes
        if (random.nextBoolean()) {
            Long busId = (long) (random.nextInt(4) + 1);
            String ticketId = "TICKET_" + (random.nextInt(1000) + 1);
            String readerId = "READER_" + busId + "_" + (random.nextInt(3) + 1);
            String location = "boarding_gate_" + (random.nextInt(2) + 1);
            
            RFIDDto.RFIDScanRequest scanRequest = new RFIDDto.RFIDScanRequest(
                busId, readerId, ticketId, location
            );
            
            RFIDDto.RFIDScanResponse response = processRFIDScan(scanRequest);
            
            // Send boarding status update
            RFIDDto.BoardingStatus status = getBoardingStatus(busId);
            messagingTemplate.convertAndSend("/topic/rfid/boarding-status", status);
            
            // Send passenger alerts if needed
            if (!response.isSuccess()) {
                RFIDDto.PassengerAlert alert = new RFIDDto.PassengerAlert(
                    response.getPassengerId(),
                    "Passenger " + response.getPassengerId(),
                    scanRequest.getTicketId(),
                    response.getBusNumber(),
                    response.getSeatNumber(),
                    "SCAN_FAILED",
                    "RFID scan failed - please contact conductor"
                );
                messagingTemplate.convertAndSend("/topic/rfid/alerts", alert);
            }
        }
    }
}
