package com.smartbus2plus.rfid.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * RFID Event entity for SmartBus2+ boarding system
 */
@Entity
@Table(name = "rfid_events")
public class RFIDEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "bus_id")
    private Long busId;
    
    @NotBlank
    @Column(name = "rfid_reader_id")
    private String rfidReaderId;
    
    @NotBlank
    @Column(name = "ticket_id")
    private String ticketId;
    
    @Column(name = "passenger_id")
    private Long passengerId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type")
    private EventType eventType;
    
    @CreationTimestamp
    @Column(name = "event_time")
    private LocalDateTime eventTime;
    
    @Column(name = "location")
    private String location; // boarding_gate, seat_location
    
    @NotNull
    private Boolean success;
    
    @Column(columnDefinition = "jsonb")
    private String metadata; // Additional event data
    
    public enum EventType {
        BOARDING, ALIGHTING, SCAN_FAILED, TICKET_VALIDATED, TICKET_INVALID
    }
    
    // Constructors
    public RFIDEvent() {}
    
    public RFIDEvent(Long busId, String rfidReaderId, String ticketId, 
                    Long passengerId, EventType eventType, String location, Boolean success) {
        this.busId = busId;
        this.rfidReaderId = rfidReaderId;
        this.ticketId = ticketId;
        this.passengerId = passengerId;
        this.eventType = eventType;
        this.location = location;
        this.success = success;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }
    
    public String getRfidReaderId() { return rfidReaderId; }
    public void setRfidReaderId(String rfidReaderId) { this.rfidReaderId = rfidReaderId; }
    
    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    
    public Long getPassengerId() { return passengerId; }
    public void setPassengerId(Long passengerId) { this.passengerId = passengerId; }
    
    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }
    
    public LocalDateTime getEventTime() { return eventTime; }
    public void setEventTime(LocalDateTime eventTime) { this.eventTime = eventTime; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }
    
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
}
