package com.smartbus2plus.inventory.repository;

import com.smartbus2plus.inventory.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Schedule entity
 */
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByRouteIdAndIsActiveTrue(Long routeId);
    List<Schedule> findByBusIdAndIsActiveTrue(Long busId);
    
    @Query("SELECT s FROM Schedule s WHERE s.routeId = :routeId AND s.dayOfWeek = :dayOfWeek AND s.isActive = true")
    List<Schedule> findByRouteIdAndDayOfWeek(@Param("routeId") Long routeId, @Param("dayOfWeek") Integer dayOfWeek);
}
