package com.poc.backend.repository;

import com.poc.backend.entity.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleStatusRepo extends JpaRepository<VehicleStatus, Long> {
    Optional<VehicleStatus> findByName(String vehicleStatus);

}
