package com.smartbus2plus.rfid.repository;

import com.smartbus2plus.rfid.model.RFIDEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for RFID events
 */
@Repository
public interface RFIDEventRepository extends JpaRepository<RFIDEvent, Long> {
    
    List<RFIDEvent> findByBusIdOrderByEventTimeDesc(Long busId);
    
    @Query("SELECT r FROM RFIDEvent r WHERE r.busId = :busId AND r.eventTime > :cutoff ORDER BY r.eventTime DESC")
    List<RFIDEvent> findByBusIdAndEventTimeAfterOrderByEventTimeDesc(@Param("busId") Long busId, @Param("cutoff") LocalDateTime cutoff);
    
    List<RFIDEvent> findByTicketIdOrderByEventTimeDesc(String ticketId);
    
    List<RFIDEvent> findByPassengerIdOrderByEventTimeDesc(Long passengerId);
    
    @Query("SELECT r FROM RFIDEvent r WHERE r.eventType = :eventType AND r.eventTime > :cutoff ORDER BY r.eventTime DESC")
    List<RFIDEvent> findByEventTypeAndEventTimeAfterOrderByEventTimeDesc(@Param("eventType") RFIDEvent.EventType eventType, @Param("cutoff") LocalDateTime cutoff);
    
    @Query("SELECT COUNT(r) FROM RFIDEvent r WHERE r.busId = :busId AND r.eventType = :eventType AND r.success = true")
    Long countSuccessfulEventsByBusAndType(@Param("busId") Long busId, @Param("eventType") RFIDEvent.EventType eventType);
}

