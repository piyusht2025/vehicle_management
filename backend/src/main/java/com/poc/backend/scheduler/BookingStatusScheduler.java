package com.poc.backend.scheduler;

import com.poc.backend.entity.Booking;
import com.poc.backend.entity.BookingStatus;
import com.poc.backend.entity.Vehicle;
import com.poc.backend.entity.VehicleStatus;
import com.poc.backend.exception.ResourceNotFoundException;
import com.poc.backend.repository.BookingRepo;
import com.poc.backend.repository.BookingStatusRepo;
import com.poc.backend.repository.VehicleRepo;
import com.poc.backend.repository.VehicleStatusRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingStatusScheduler {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private VehicleRepo vehicleRepo;

    @Autowired
    private BookingStatusRepo bookingStatusRepo;

    @Autowired
    private VehicleStatusRepo vehicleStatusRepo;

    @Scheduled(fixedRate = 60000)
    public void checkEndedBookings() {

        LocalDateTime now = LocalDateTime.now();

        List<Booking> expiredBookings = bookingRepo.findExpiredBookings(now);

        BookingStatus underReview = bookingStatusRepo.findByName("UNDER_REVIEW")
                .orElseThrow(() -> new RuntimeException("review status missing"));

        VehicleStatus reviewPending = vehicleStatusRepo.findByName("REVIEW_PENDING")
                .orElseThrow(() -> new RuntimeException("REVIEW_PENDING status missing"));

        for (Booking b : expiredBookings) {
            b.setStatus(underReview);
            bookingRepo.save(b);
            Vehicle v = b.getVehicle();
            v.setStatus(reviewPending);
            vehicleRepo.save(v);


            System.out.println("Booking " + b.getId() +
                    " completed. Vehicle " + v.getId() + " marked for review.");
        }
    }

    @Scheduled(fixedRate = 10800000)   // 3hrs cycle
    public void checkAcceptedBooking() {

        LocalDateTime time = LocalDateTime.now().minusHours(5);
        List<Booking> booking = bookingRepo.findByAcceptedBooking(time);
        VehicleStatus vehicleStatus = vehicleStatusRepo.findByName("AVAILABLE")
                .orElseThrow(() -> new ResourceNotFoundException("Status not Found"));
        BookingStatus bookingStatus = bookingStatusRepo.findByName("CANCELLED")
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));
        for (Booking b : booking) {
            b.setStatus(bookingStatus);
            bookingRepo.save(b);
            Vehicle v = b.getVehicle();
            v.setStatus(vehicleStatus);
            vehicleRepo.save(v);

            System.out.println("Booking " + b.getId() +
                    " Cancelled. Vehicle " + v.getId() + " marked available.");

        }
    }
}
