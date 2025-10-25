package com.smartbus2plus.booking.controller;

import com.smartbus2plus.booking.model.Booking;
import com.smartbus2plus.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Booking controller for SmartBus2+
 */
@RestController
@RequestMapping("/api/booking")
@Tag(name = "Booking", description = "Seat booking and hold management")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @PostMapping("/create")
    @Operation(summary = "Create booking", description = "Create a new seat booking")
    public ResponseEntity<Booking> createBooking(
            @RequestParam Long userId,
            @RequestParam Long scheduleId,
            @RequestParam String seatNumber,
            @RequestParam BigDecimal totalAmount,
            @RequestParam LocalDate travelDate) {
        Booking booking = bookingService.createBooking(userId, scheduleId, seatNumber, totalAmount, travelDate);
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user bookings", description = "Retrieve all bookings for a user")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/schedule/{scheduleId}")
    @Operation(summary = "Get schedule bookings", description = "Retrieve bookings for a specific schedule")
    public ResponseEntity<List<Booking>> getScheduleBookings(@PathVariable Long scheduleId) {
        List<Booking> bookings = bookingService.getBookingsBySchedule(scheduleId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/reference/{bookingReference}")
    @Operation(summary = "Get booking by reference", description = "Retrieve booking by reference number")
    public ResponseEntity<Booking> getBookingByReference(@PathVariable String bookingReference) {
        Booking booking = bookingService.getBookingByReference(bookingReference);
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/rfid/{rfidTicketId}")
    @Operation(summary = "Get booking by RFID ticket", description = "Retrieve booking by RFID ticket ID")
    public ResponseEntity<Booking> getBookingByRfidTicket(@PathVariable String rfidTicketId) {
        Booking booking = bookingService.getBookingByRfidTicket(rfidTicketId);
        return ResponseEntity.ok(booking);
    }
    
    @PutMapping("/{bookingId}/confirm")
    @Operation(summary = "Confirm booking", description = "Confirm a pending booking")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long bookingId) {
        Booking booking = bookingService.confirmBooking(bookingId);
        return ResponseEntity.ok(booking);
    }
    
    @PutMapping("/{bookingId}/cancel")
    @Operation(summary = "Cancel booking", description = "Cancel a booking")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long bookingId) {
        Booking booking = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(booking);
    }
    
    @PutMapping("/{bookingId}/board")
    @Operation(summary = "Mark as boarded", description = "Mark passenger as boarded")
    public ResponseEntity<Booking> markAsBoarded(@PathVariable Long bookingId) {
        Booking booking = bookingService.markAsBoarded(bookingId);
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/seat/available")
    @Operation(summary = "Check seat availability", description = "Check if a seat is available")
    public ResponseEntity<Boolean> isSeatAvailable(
            @RequestParam Long scheduleId,
            @RequestParam String seatNumber,
            @RequestParam LocalDate travelDate) {
        boolean available = bookingService.isSeatAvailable(scheduleId, seatNumber, travelDate);
        return ResponseEntity.ok(available);
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check Booking service health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Booking Service is running");
    }
}

