package com.poc.backend.repository;

import com.poc.backend.entity.Booking;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {
    Optional<List<Booking>> findByRenterId(Long id);

    Optional<List<Booking>> findByVehicleOwnerId(Long id);

    @Query("select b from Booking b where b.vehicle.owner.id=:ownerId")
    Optional<List<Booking>> findByOwnerId(@Param("ownerId") Long id);

    @Query("SELECT b FROM Booking b WHERE b.endTime < :now AND b.status.name = 'CONFIRMED'")
    List<Booking> findExpiredBookings(LocalDateTime now);

    @Query("select b from Booking b where b.updatedAt < :now AND b.status.name = 'ACCEPTED'")
    List<Booking> findByAcceptedBooking(LocalDateTime now);

    @Query("select b from Booking b where b.renter.id = :id  order by b.createdAt DESC")
    List<Booking> findRecentBookings(Long id, Pageable pageable);
}
