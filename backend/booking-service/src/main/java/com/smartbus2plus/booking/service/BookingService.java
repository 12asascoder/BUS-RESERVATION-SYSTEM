package com.smartbus2plus.booking.service;

import com.smartbus2plus.booking.model.Booking;
import com.smartbus2plus.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Booking service for SmartBus2+
 */
@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    public Booking createBooking(Long userId, Long scheduleId, String seatNumber, 
                               BigDecimal totalAmount, LocalDate travelDate) {
        
        // Check if seat is available
        if (!isSeatAvailable(scheduleId, seatNumber, travelDate)) {
            throw new RuntimeException("Seat is not available");
        }
        
        // Hold seat for 15 minutes
        holdSeat(scheduleId, seatNumber, travelDate, 15);
        
        // Generate booking reference and RFID ticket ID
        String bookingReference = "SB" + System.currentTimeMillis();
        String rfidTicketId = "RFID_" + UUID.randomUUID().toString().substring(0, 8);
        String qrCode = "QR_" + bookingReference;
        
        Booking booking = new Booking(userId, scheduleId, seatNumber, bookingReference, totalAmount, travelDate);
        booking.setRfidTicketId(rfidTicketId);
        booking.setQrCode(qrCode);
        booking.setBookingDate(LocalDateTime.now());
        
        Booking saved = bookingRepository.save(booking);
        
        // Send to Kafka
        kafkaTemplate.send("booking-events", saved);
        
        return saved;
    }
    
    public boolean isSeatAvailable(Long scheduleId, String seatNumber, LocalDate travelDate) {
        String key = String.format("seat:%s:%s:%s", scheduleId, seatNumber, travelDate);
        return !redisTemplate.hasKey(key);
    }
    
    public void holdSeat(Long scheduleId, String seatNumber, LocalDate travelDate, int minutes) {
        String key = String.format("seat:%s:%s:%s", scheduleId, seatNumber, travelDate);
        redisTemplate.opsForValue().set(key, "held", minutes, TimeUnit.MINUTES);
    }
    
    public void releaseSeat(Long scheduleId, String seatNumber, LocalDate travelDate) {
        String key = String.format("seat:%s:%s:%s", scheduleId, seatNumber, travelDate);
        redisTemplate.delete(key);
    }
    
    public Booking confirmBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .map(booking -> {
                    booking.setBookingStatus(Booking.BookingStatus.CONFIRMED);
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    public Booking cancelBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .map(booking -> {
                    booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
                    releaseSeat(booking.getScheduleId(), booking.getSeatNumber(), booking.getTravelDate());
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    public Booking markAsBoarded(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .map(booking -> {
                    booking.setBoardingStatus(Booking.BoardingStatus.BOARDED);
                    booking.setBoardingTime(LocalDateTime.now());
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Booking> getBookingsBySchedule(Long scheduleId) {
        return bookingRepository.findByScheduleIdAndTravelDateOrderByCreatedAtDesc(scheduleId, LocalDate.now());
    }
    
    public Booking getBookingByReference(String bookingReference) {
        return bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    public Booking getBookingByRfidTicket(String rfidTicketId) {
        return bookingRepository.findByRfidTicketId(rfidTicketId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}
