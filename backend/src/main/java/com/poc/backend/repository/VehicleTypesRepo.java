package com.poc.backend.repository;

import com.poc.backend.entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleTypesRepo extends JpaRepository<VehicleType,Long> {
    Optional<VehicleType> findByName(String type);
}
