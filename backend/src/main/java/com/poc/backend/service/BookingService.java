package com.poc.backend.service;

import com.poc.backend.dto.booking.*;
import com.poc.backend.dto.vehicle.TopVehicleDto;
import com.poc.backend.entity.*;
import com.poc.backend.exception.ResourceNotFoundException;
import com.poc.backend.mapper.BookingMapper;
import com.poc.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service("bookingService")
@RequiredArgsConstructor
public class BookingService {
    @Autowired
    private final BookingRepo bookingRepo;
    @Autowired
    private final VehicleRepo vehicleRepo;
    @Autowired
    private final UserRepo userRepo;
    @Autowired
    private final BookingMapper bookingMapper;
    @Autowired
    private final VehicleService vehicleService;
    @Autowired
    private final VehicleStatusRepo vehicleStatusRepo;
    @Autowired
    BookingStatusRepo bookingStatusRepo;


    @Transactional
    public BookingResponseDto addBooking(BookingRequestDto dto) {
        User renter = userRepo.findById(dto.getRenterId())
                .orElseThrow(() -> new ResourceNotFoundException("Renter not found with id: " + dto.getRenterId()));

        Vehicle vehicle = vehicleRepo.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + dto.getVehicleId()));

        if (vehicle.getStatus().getId() != 1) {
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

        //parsing the date time from utc to local
        LocalDateTime normalizedStart = normalizeToIST(dto.getStartTime());
        LocalDateTime normalizedEnd = normalizeToIST(dto.getEndTime());
        booking.setStartTime(normalizedStart);
        booking.setEndTime(normalizedEnd);
        booking.setAmount(dto.getAmount());
        booking.setStatus(status);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepo.save(booking);

        vehicle.setAvailable(false);
        vehicleRepo.save(vehicle);

        return bookingMapper.toDto(savedBooking);
    }

    public List<BookingResponseDto> getBookingByUserId(Long id) {
        List<Booking> b = bookingRepo.findByRenterId(id).orElseThrow(() -> new ResourceNotFoundException("No Bookings found"));
        return b.stream()
                .map(booking -> bookingMapper.toDto(booking))
                .collect(Collectors.toList());
    }

    public List<BookingResponseDto> getBookingByOwnerId(Long id) {
        List<Booking> bookings = bookingRepo.findByOwnerId(id)
                .orElseThrow(() -> new ResourceNotFoundException("No Bookings Found"));
        return bookings.stream()
                .map(booking -> bookingMapper.toDto(booking))
                .collect(Collectors.toList());
    }

    public void cancelBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getStatus().getName().equals("UNCONFIRMED")) {
            throw new IllegalStateException("Only UNCONFIRMED bookings can be canceled.");
        }

        BookingStatus cancelled = bookingStatusRepo.findByName("CANCELLED")
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));

        booking.setStatus(cancelled);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepo.save(booking);
    }

    public void payBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getStatus().getName().equals("ACCEPTED")) {
            throw new IllegalStateException("Payment allowed only after owner approval.");
        }
        Long vehicleId = booking.getVehicle().getId();

        BookingStatus paid = bookingStatusRepo.findByName("CONFIRMED")
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));

        booking.setStatus(paid);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepo.save(booking);

        vehicleService.updateStatus(vehicleId, "booked");   //update vehicle status

    }

    public void acceptBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getStatus().getName().equals("UNCONFIRMED")) {
            throw new IllegalStateException("Only PENDING booking can be approved.");
        }

        BookingStatus accepted = bookingStatusRepo.findByName("ACCEPTED")
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));

        VehicleStatus reserved = vehicleStatusRepo.findByName("RESERVED")
                .orElseThrow(() -> new ResourceNotFoundException(" Vehicle Status not found"));

        Vehicle v = booking.getVehicle();
        v.setStatus(reserved);
        vehicleRepo.save(v);        // update vehicle status

        booking.setStatus(accepted);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepo.save(booking);
    }

    private LocalDateTime normalizeToIST(LocalDateTime dateTime) {
        return dateTime.atOffset(ZoneOffset.UTC)
                .atZoneSameInstant(ZoneId.of("Asia/Kolkata"))
                .toLocalDateTime();
    }

    public void rejectBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getStatus().getName().equals("UNCONFIRMED")) {
            throw new IllegalStateException("Booking cannot be rejected now.");
        }

        BookingStatus rejected = bookingStatusRepo.findByName("REJECTED")
                .orElseThrow(() -> new ResourceNotFoundException("Status not found"));

        booking.setStatus(rejected);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepo.save(booking);
    }


    public List<BookingResponseDto> getRecentBookings(Long id) {
        Pageable limit = PageRequest.of(0, 3);  // Top 3
        return bookingRepo.findRecentBookings(id, limit)
                .stream()
                .map(bookingMapper::toDto)
                .collect(Collectors.toList());
    }
    public boolean isBookingCreator(Long bookingId, Long userId) {
        Booking booking=bookingRepo.findById(bookingId)
                .orElseThrow(()->new ResourceNotFoundException("Booking not found"));
        return booking.getRenter().getId().equals(userId);

    }

    public boolean isVehicleOwnerForBooking(Long bookingId, Long ownerId) {

        Booking booking=bookingRepo.findById(bookingId)
                .orElseThrow(()->new ResourceNotFoundException("Booking not found"));

        return booking.getVehicle().getOwner().getId().equals(ownerId);
    }

    public MonthlyEarningsDto getMonthlyEarnings(Long ownerId) {
        List<Object[]> data = bookingRepo.findMonthlyEarnings(ownerId);

        List<String> months = new ArrayList<>();
        List<Double> earnings = new ArrayList<>();

        for (Object[] row : data) {
            months.add((String) row[0]);
            earnings.add(((Number) row[1]).doubleValue());
        }

        MonthlyEarningsDto dto = new MonthlyEarningsDto();
        dto.setMonths(months);
        dto.setEarnings(earnings); 

        return dto;
    }

    public MonthlyEarningsDto getMonthlyEarnings() {
        List<Object[]> data = bookingRepo.findMonthlyEarnings();

        List<String> months = new ArrayList<>();
        List<Double> earnings = new ArrayList<>();

        for (Object[] row : data) {
            months.add((String) row[0]);
            earnings.add(((Number) row[1]).doubleValue());
        }

        MonthlyEarningsDto dto = new MonthlyEarningsDto();
        dto.setMonths(months);
        dto.setEarnings(earnings);

        return dto;
    }

    public List<RevenuePerVehicleDto> getRevenuePerVehicleByOwnerId(Long id) {
        List<Object[]> result = bookingRepo.getRevenuePerVehicle(id);
        return result.stream().map(row -> {
            RevenuePerVehicleDto dto = new RevenuePerVehicleDto();
            dto.setVehicleName((String) row[0]);
            dto.setRevenue(String.valueOf(row[1]));
            return dto;
        }).toList();
    }

    public TotalRevenueDto getTotalRevenue() {
        Object[] revenue=bookingRepo.getTotalRevenue();
        Object[] vehicle=vehicleRepo.getTotalVehicles();
        TotalRevenueDto dto=new TotalRevenueDto();
        dto.setTotalRevenue(revenue[0].toString());
        dto.setTotalVehicles(vehicle[0].toString());
        return dto;
    }

    public List<TopVehicleDto> getTopRevenueVehicles() {
        Pageable top3 = PageRequest.of(0, 3);
        return bookingRepo.getTopRevenueVehicles(top3);
    }

    @Transactional
    public void rateVehicle(Long bookingId, Integer rating) {
        // validate rating range
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus().getName())) {
            throw new IllegalStateException("Can only rate vehicle after booking is COMPLETED.");
        }

        booking.setVehicleRatingByRenter(rating);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepo.save(booking);

    }

    @Transactional
    public void rateRenter(Long bookingId, Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus().getName())) {
            throw new IllegalStateException("Can only rate renter after booking is COMPLETED.");
        }

        booking.setRenterRatingByOwner(rating);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepo.save(booking);

    }

    public void completeBooking(Long id) {
        Booking b = bookingRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Not found "));
        BookingStatus status = bookingStatusRepo.findByName("COMPLETED").orElseThrow(()-> new ResourceNotFoundException("Not found "));
        b.setStatus(status);
        bookingRepo.save(b);
    }
}
