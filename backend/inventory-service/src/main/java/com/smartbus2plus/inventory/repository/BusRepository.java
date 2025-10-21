package com.smartbus2plus.inventory.repository;

import com.smartbus2plus.inventory.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Bus entity
 */
@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findByIsActiveTrue();
    Optional<Bus> findByBusNumber(String busNumber);
    List<Bus> findByCompanyIdAndIsActiveTrue(Long companyId);
}
