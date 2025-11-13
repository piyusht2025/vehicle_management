package com.poc.backend.service;

import com.fasterxml.jackson.databind.annotation.JsonAppend;
import com.poc.backend.dto.booking.BookingRequestDto;
import com.poc.backend.dto.booking.BookingResponseDto;
import com.poc.backend.entity.Booking;
import com.poc.backend.entity.BookingStatus;
import com.poc.backend.entity.User;
import com.poc.backend.entity.Vehicle;
import com.poc.backend.exception.ResourceNotFoundException;
import com.poc.backend.mapper.BookingMapper;
import com.poc.backend.repository.BookingRepo;
import com.poc.backend.repository.BookingStatusRepo;
import com.poc.backend.repository.UserRepo;
import com.poc.backend.repository.VehicleRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingService {
    @Autowired
    private final BookingRepo bookingRepo;
    @Autowired
    private final VehicleRepo vehicleRepo;
    @Autowired
    private final UserRepo userRepo;

    @Autowired
    BookingStatusRepo bookingStatusRepo;
    @Autowired
    private final BookingMapper bookingMapper;

    @Transactional
    public BookingResponseDto addBooking(BookingRequestDto dto) {
        User renter = userRepo.findById(dto.getRenterId())
                .orElseThrow(() -> new ResourceNotFoundException("Renter not found with id: " + dto.getRenterId()));

        Vehicle vehicle = vehicleRepo.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + dto.getVehicleId()));

        if (!Boolean.TRUE.equals(vehicle.getAvailable())) {
            throw new IllegalStateException("Vehicle is currently not available for booking.");
        }

        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new IllegalArgumentException("Start time cannot be after end time.");
        }

        BookingStatus status = bookingStatusRepo.findByName("unconfirmed".toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Booking status 'UNCONFIRMED' not found."));

        Booking booking = new Booking();
        booking.setRenter(renter);
        booking.setVehicle(vehicle);
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setAmount(dto.getAmount());
        booking.setStatus(status);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepo.save(booking);

        vehicle.setAvailable(false);
        vehicleRepo.save(vehicle);

        return bookingMapper.toDto(savedBooking);
    }
}
