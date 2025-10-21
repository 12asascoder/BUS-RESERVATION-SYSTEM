package com.smartbus2plus.booking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Booking entity for SmartBus2+
 */
@Entity
@Table(name = "bookings")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "user_id")
    private Long userId;
    
    @NotNull
    @Column(name = "schedule_id")
    private Long scheduleId;
    
    @NotBlank
    @Column(name = "seat_number")
    private String seatNumber;
    
    @NotBlank
    @Column(name = "booking_reference", unique = true)
    private String bookingReference;
    
    @Column(name = "rfid_ticket_id", unique = true)
    private String rfidTicketId;
    
    @Column(name = "qr_code")
    private String qrCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", columnDefinition = "varchar(20) default 'CONFIRMED'")
    private BookingStatus bookingStatus = BookingStatus.CONFIRMED;
    
    @NotNull
    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @CreationTimestamp
    @Column(name = "booking_date")
    private LocalDateTime bookingDate;
    
    @NotNull
    @Column(name = "travel_date")
    private LocalDate travelDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "boarding_status", columnDefinition = "varchar(20) default 'NOT_BOARDED'")
    private BoardingStatus boardingStatus = BoardingStatus.NOT_BOARDED;
    
    @Column(name = "boarding_time")
    private LocalDateTime boardingTime;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }
    
    public enum BoardingStatus {
        NOT_BOARDED, BOARDED, MISSED
    }
    
    // Constructors
    public Booking() {}
    
    public Booking(Long userId, Long scheduleId, String seatNumber, 
                  String bookingReference, BigDecimal totalAmount, LocalDate travelDate) {
        this.userId = userId;
        this.scheduleId = scheduleId;
        this.seatNumber = seatNumber;
        this.bookingReference = bookingReference;
        this.totalAmount = totalAmount;
        this.travelDate = travelDate;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getScheduleId() { return scheduleId; }
    public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }
    
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    
    public String getRfidTicketId() { return rfidTicketId; }
    public void setRfidTicketId(String rfidTicketId) { this.rfidTicketId = rfidTicketId; }
    
    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    
    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    
    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }
    
    public BoardingStatus getBoardingStatus() { return boardingStatus; }
    public void setBoardingStatus(BoardingStatus boardingStatus) { this.boardingStatus = boardingStatus; }
    
    public LocalDateTime getBoardingTime() { return boardingTime; }
    public void setBoardingTime(LocalDateTime boardingTime) { this.boardingTime = boardingTime; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
