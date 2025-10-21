package com.smartbus2plus.rfid.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smartbus2plus.rfid.model.RFIDEvent;

import java.time.LocalDateTime;

/**
 * DTOs for RFID events and boarding data
 */
public class RFIDDto {
    
    public static class RFIDScanRequest {
        private Long busId;
        private String rfidReaderId;
        private String ticketId;
        private String location;
        
        public RFIDScanRequest() {}
        
        public RFIDScanRequest(Long busId, String rfidReaderId, String ticketId, String location) {
            this.busId = busId;
            this.rfidReaderId = rfidReaderId;
            this.ticketId = ticketId;
            this.location = location;
        }
        
        // Getters and Setters
        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }
        
        public String getRfidReaderId() { return rfidReaderId; }
        public void setRfidReaderId(String rfidReaderId) { this.rfidReaderId = rfidReaderId; }
        
        public String getTicketId() { return ticketId; }
        public void setTicketId(String ticketId) { this.ticketId = ticketId; }
        
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }
    
    public static class RFIDScanResponse {
        private boolean success;
        private String message;
        private RFIDEvent.EventType eventType;
        private Long passengerId;
        private String seatNumber;
        private String busNumber;
        private LocalDateTime scanTime;
        
        public RFIDScanResponse() {}
        
        public RFIDScanResponse(boolean success, String message, RFIDEvent.EventType eventType) {
            this.success = success;
            this.message = message;
            this.eventType = eventType;
            this.scanTime = LocalDateTime.now();
        }
        
        // Getters and Setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public RFIDEvent.EventType getEventType() { return eventType; }
        public void setEventType(RFIDEvent.EventType eventType) { this.eventType = eventType; }
        
        public Long getPassengerId() { return passengerId; }
        public void setPassengerId(Long passengerId) { this.passengerId = passengerId; }
        
        public String getSeatNumber() { return seatNumber; }
        public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
        
        public String getBusNumber() { return busNumber; }
        public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
        
        public LocalDateTime getScanTime() { return scanTime; }
        public void setScanTime(LocalDateTime scanTime) { this.scanTime = scanTime; }
    }
    
    public static class BoardingStatus {
        private Long busId;
        private String busNumber;
        private int totalPassengers;
        private int boardedPassengers;
        private int missedPassengers;
        private double boardingPercentage;
        private LocalDateTime lastUpdate;
        
        public BoardingStatus() {}
        
        public BoardingStatus(Long busId, String busNumber, int totalPassengers, 
                            int boardedPassengers, int missedPassengers) {
            this.busId = busId;
            this.busNumber = busNumber;
            this.totalPassengers = totalPassengers;
            this.boardedPassengers = boardedPassengers;
            this.missedPassengers = missedPassengers;
            this.boardingPercentage = totalPassengers > 0 ? (double) boardedPassengers / totalPassengers * 100 : 0;
            this.lastUpdate = LocalDateTime.now();
        }
        
        // Getters and Setters
        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }
        
        public String getBusNumber() { return busNumber; }
        public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
        
        public int getTotalPassengers() { return totalPassengers; }
        public void setTotalPassengers(int totalPassengers) { this.totalPassengers = totalPassengers; }
        
        public int getBoardedPassengers() { return boardedPassengers; }
        public void setBoardedPassengers(int boardedPassengers) { this.boardedPassengers = boardedPassengers; }
        
        public int getMissedPassengers() { return missedPassengers; }
        public void setMissedPassengers(int missedPassengers) { this.missedPassengers = missedPassengers; }
        
        public double getBoardingPercentage() { return boardingPercentage; }
        public void setBoardingPercentage(double boardingPercentage) { this.boardingPercentage = boardingPercentage; }
        
        public LocalDateTime getLastUpdate() { return lastUpdate; }
        public void setLastUpdate(LocalDateTime lastUpdate) { this.lastUpdate = lastUpdate; }
    }
    
    public static class PassengerAlert {
        private Long passengerId;
        private String passengerName;
        private String ticketId;
        private String busNumber;
        private String seatNumber;
        private String alertType; // MISSED_BOARDING, DELAYED_BOARDING, etc.
        private String message;
        private LocalDateTime alertTime;
        
        public PassengerAlert() {}
        
        public PassengerAlert(Long passengerId, String passengerName, String ticketId, 
                            String busNumber, String seatNumber, String alertType, String message) {
            this.passengerId = passengerId;
            this.passengerName = passengerName;
            this.ticketId = ticketId;
            this.busNumber = busNumber;
            this.seatNumber = seatNumber;
            this.alertType = alertType;
            this.message = message;
            this.alertTime = LocalDateTime.now();
        }
        
        // Getters and Setters
        public Long getPassengerId() { return passengerId; }
        public void setPassengerId(Long passengerId) { this.passengerId = passengerId; }
        
        public String getPassengerName() { return passengerName; }
        public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
        
        public String getTicketId() { return ticketId; }
        public void setTicketId(String ticketId) { this.ticketId = ticketId; }
        
        public String getBusNumber() { return busNumber; }
        public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
        
        public String getSeatNumber() { return seatNumber; }
        public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
        
        public String getAlertType() { return alertType; }
        public void setAlertType(String alertType) { this.alertType = alertType; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public LocalDateTime getAlertTime() { return alertTime; }
        public void setAlertTime(LocalDateTime alertTime) { this.alertTime = alertTime; }
    }
}
