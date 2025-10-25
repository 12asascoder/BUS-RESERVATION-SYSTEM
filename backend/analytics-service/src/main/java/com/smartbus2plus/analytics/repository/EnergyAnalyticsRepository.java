package com.smartbus2plus.analytics.repository;

import com.smartbus2plus.analytics.model.EnergyAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Energy Analytics
 */
@Repository
public interface EnergyAnalyticsRepository extends JpaRepository<EnergyAnalytics, Long> {
    
    List<EnergyAnalytics> findByBusIdOrderByTripDateDesc(Long busId);
    
    List<EnergyAnalytics> findByDriverIdOrderByTripDateDesc(Long driverId);
    
    List<EnergyAnalytics> findByTripDateBetweenOrderByTripDateDesc(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT AVG(e.greenScore) FROM EnergyAnalytics e WHERE e.busId = :busId")
    BigDecimal findAverageGreenScoreByBusId(@Param("busId") Long busId);
    
    @Query("SELECT AVG(e.distanceKm / e.fuelConsumption) FROM EnergyAnalytics e WHERE e.busId = :busId")
    BigDecimal findAverageFuelEfficiencyByBusId(@Param("busId") Long busId);
    
    @Query("SELECT SUM(e.fuelConsumption) FROM EnergyAnalytics e WHERE e.busId = :busId AND e.tripDate >= :startDate")
    BigDecimal findTotalFuelConsumptionByBusIdAndDate(@Param("busId") Long busId, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT SUM(e.distanceKm) FROM EnergyAnalytics e WHERE e.busId = :busId AND e.tripDate >= :startDate")
    BigDecimal findTotalDistanceByBusIdAndDate(@Param("busId") Long busId, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT e FROM EnergyAnalytics e WHERE e.greenScore < :threshold ORDER BY e.tripDate DESC")
    List<EnergyAnalytics> findLowGreenScoreTrips(@Param("threshold") BigDecimal threshold);
}

