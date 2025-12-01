package com.poc.backend.repository;

import com.poc.backend.entity.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleImageRepo extends JpaRepository<VehicleImage, Long> {
    List<String> findAllById(Long ownerId);

    @Modifying
    @Query("DELETE FROM VehicleImage vi WHERE vi.vehicle.id = :vehicleId")
    void deleteByVehicleId(@Param("vehicleId") Long vehicleId);
}
