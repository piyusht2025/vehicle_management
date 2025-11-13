package com.poc.backend.repository;

import com.poc.backend.entity.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FuelTypeRepo extends JpaRepository<FuelType,Long> {
    Optional<FuelType> findByName(String fuelType);
}
