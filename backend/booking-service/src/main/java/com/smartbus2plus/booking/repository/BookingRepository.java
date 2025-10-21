package com.smartbus2plus.booking.repository;

import com.smartbus2plus.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Bookings
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Booking> findByScheduleIdAndTravelDateOrderByCreatedAtDesc(Long scheduleId, LocalDate travelDate);
    
    Optional<Booking> findByBookingReference(String bookingReference);
    
    Optional<Booking> findByRfidTicketId(String rfidTicketId);
    
    List<Booking> findByTravelDateAndBookingStatus(LocalDate travelDate, Booking.BookingStatus status);
    
    List<Booking> findByBoardingStatus(Booking.BoardingStatus boardingStatus);
    
    @Query("SELECT b FROM Booking b WHERE b.userId = :userId AND b.travelDate >= :date ORDER BY b.travelDate ASC")
    List<Booking> findUpcomingBookingsByUser(@Param("userId") Long userId, @Param("date") LocalDate date);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.scheduleId = :scheduleId AND b.travelDate = :travelDate AND b.bookingStatus = 'CONFIRMED'")
    Long countConfirmedBookingsByScheduleAndDate(@Param("scheduleId") Long scheduleId, @Param("travelDate") LocalDate travelDate);
}
