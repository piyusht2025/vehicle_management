package com.poc.backend.repository;

import com.poc.backend.entity.Booking;
import com.poc.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepo extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v ORDER BY v.avgRating DESC")
    List<Vehicle> findAllOrderByAvgRatingDesc();


    List<Vehicle> findByOwnerId(Long id);

    @Query("SELECT v from Vehicle v where v.active=true")
    List<Vehicle> findAllActive();

    @Query("SELECT v FROM Vehicle v WHERE v.status.name = 'REVIEW_PENDING'")
    List<Vehicle> findPendingVehicles();

    @Query("SELECT COUNT(v) from Vehicle v WHERE v.active=true")
    Object[] getTotalVehicles();


}
