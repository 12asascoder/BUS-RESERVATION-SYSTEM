package com.smartbus2plus.iot.repository;

import com.smartbus2plus.iot.model.IoTTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for IoT Telemetry data
 */
@Repository
public interface IoTTelemetryRepository extends JpaRepository<IoTTelemetry, Long> {
    
    List<IoTTelemetry> findByBusIdOrderByTimestampDesc(Long busId);
    
    List<IoTTelemetry> findByBusIdAndSensorTypeOrderByTimestampDesc(Long busId, String sensorType);
    
    @Query("SELECT t FROM IoTTelemetry t WHERE t.busId = :busId AND t.timestamp > :cutoff ORDER BY t.timestamp DESC")
    List<IoTTelemetry> findByBusIdAndTimestampAfterOrderByTimestampDesc(@Param("busId") Long busId, @Param("cutoff") LocalDateTime cutoff);
    
    @Query("SELECT t FROM IoTTelemetry t WHERE t.sensorType = :sensorType AND t.timestamp > :cutoff ORDER BY t.timestamp DESC")
    List<IoTTelemetry> findBySensorTypeAndTimestampAfterOrderByTimestampDesc(@Param("sensorType") String sensorType, @Param("cutoff") LocalDateTime cutoff);
    
    @Query("SELECT t FROM IoTTelemetry t WHERE t.busId = :busId AND t.location = :location ORDER BY t.timestamp DESC")
    List<IoTTelemetry> findByBusIdAndLocationOrderByTimestampDesc(@Param("busId") Long busId, @Param("location") String location);
}
