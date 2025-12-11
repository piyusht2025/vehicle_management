package com.poc.backend.repository;

import com.poc.backend.dto.user.UserSpendDto;
import com.poc.backend.dto.vehicle.TopVehicleDto;
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

    @Query("""
        SELECT TO_CHAR(b.startTime, 'Mon') as month,SUM(b.amount)
        FROM Booking b
        WHERE b.vehicle.owner.id = :ownerId AND b.status.name = 'COMPLETED'
        GROUP BY month, EXTRACT(MONTH FROM b.startTime)
        ORDER BY EXTRACT(MONTH FROM b.startTime)
       """)
    List<Object[]> findMonthlyEarnings(Long ownerId);

    @Query("""
        SELECT TO_CHAR(b.startTime, 'Mon') as month,SUM(b.amount)
        FROM Booking b
        WHERE b.status.name = 'COMPLETED'
        GROUP BY month, EXTRACT(MONTH FROM b.startTime)
        ORDER BY EXTRACT(MONTH FROM b.startTime)
       """)
    List<Object[]> findMonthlyEarnings();

    @Query("""
        SELECT CONCAT(b.vehicle.brand, ' ', b.vehicle.model) AS vehicleName, SUM(b.amount) AS revenue
        FROM Booking b
        WHERE b.vehicle.owner.id = :ownerId 
        AND b.status.name = 'COMPLETED'
        GROUP BY CONCAT(b.vehicle.brand, ' ', b.vehicle.model)
       """)
    List<Object[]> getRevenuePerVehicle(Long ownerId);

    @Query("""
            SELECT SUM(b.amount) from Booking b WHERE b.status.name='COMPLETED'
            """)
    Object[] getTotalRevenue();


    @Query("""
       SELECT new com.poc.backend.dto.user.UserSpendDto(
           b.renter.name,
           b.renter.email,
           SUM(b.amount),
           COUNT(b.id)
       )
       FROM Booking b WHERE b.status.name = 'COMPLETED'
       GROUP BY b.renter.id, b.renter.name, b.renter.email
       ORDER BY SUM(b.amount) DESC
       """)
    List<UserSpendDto> getTopSpenders(Pageable pageable);

    @Query("""
       SELECT new com.poc.backend.dto.vehicle.TopVehicleDto(
           CONCAT(v.brand, ' ', v.model),
           v.owner.name,
           v.type.name,
           COUNT(b.id),
           SUM(b.amount)
       )
       FROM Booking b
       JOIN b.vehicle v
       WHERE b.status.name = 'COMPLETED'
       GROUP BY v.id, v.brand, v.model, v.owner.name, v.type
       ORDER BY SUM(b.amount) DESC
       """)
    List<TopVehicleDto> getTopRevenueVehicles(Pageable pageable);


}
