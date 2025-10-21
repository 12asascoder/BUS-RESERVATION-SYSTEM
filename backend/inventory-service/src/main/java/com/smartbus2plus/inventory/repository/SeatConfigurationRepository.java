package com.smartbus2plus.inventory.repository;

import com.smartbus2plus.inventory.model.SeatConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for SeatConfiguration entity
 */
@Repository
public interface SeatConfigurationRepository extends JpaRepository<SeatConfiguration, Long> {
    List<SeatConfiguration> findByBusId(Long busId);
    Optional<SeatConfiguration> findByBusIdAndSeatNumber(Long busId, String seatNumber);
    
    @Query("SELECT sc FROM SeatConfiguration sc WHERE sc.busId = :busId AND sc.healthStatus = 'HEALTHY'")
    List<SeatConfiguration> findHealthySeatsByBusId(@Param("busId") Long busId);
    
    @Query("SELECT sc FROM SeatConfiguration sc WHERE sc.busId = :busId AND sc.seatType = :seatType")
    List<SeatConfiguration> findByBusIdAndSeatType(@Param("busId") Long busId, @Param("seatType") SeatConfiguration.SeatType seatType);
}
