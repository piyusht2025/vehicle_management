package com.poc.backend.service;

import com.poc.backend.dto.booking.BookingResponseDto;
import com.poc.backend.dto.user.UserDashboardDto;
import com.poc.backend.dto.user.UserRequestDto;
import com.poc.backend.dto.user.UserResponse;
import com.poc.backend.dto.user.UserSpendDto;
import com.poc.backend.entity.Role;
import com.poc.backend.entity.User;
import com.poc.backend.entity.Vehicle;
import com.poc.backend.exception.ResourceNotFoundException;
import com.poc.backend.mapper.UserMapper;
import com.poc.backend.repository.BookingRepo;
import com.poc.backend.repository.RoleRepo;
import com.poc.backend.repository.UserRepo;
import com.poc.backend.repository.VehicleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    UserRepo userRepo;
    @Autowired
    UserMapper userMapper;
    @Autowired
    BookingService bookingService;
    @Autowired
    RoleRepo roleRepo;
    @Autowired
    VehicleRepo vehicleRepo;
    @Autowired
    BookingRepo bookingRepo;

    public UserResponse registerUser(UserRequestDto userRequestDto) {
        User user = userMapper.toEntity(userRequestDto);
        user = userRepo.save(user);
        return userMapper.toDto(user);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toDto(user);

    }

    public List<UserResponse> getAllUsers() {
        List<User> user = userRepo.findAll();
        List<UserResponse> users = user.stream().map(userMapper::toDto).collect(Collectors.toList());
        return users;

    }

    public UserDashboardDto getUserdashboardData(Long id) {
        List<BookingResponseDto> bookings = bookingService.getBookingByUserId(id);
        UserDashboardDto userDashboardDto = new UserDashboardDto();
        userDashboardDto.setTotalBookings((long) bookings.size());
        userDashboardDto.setTotalSpent(bookings
                .stream()
                .filter(booking -> booking.getStatus().equals("COMPLETED"))
                .mapToDouble(BookingResponseDto::getAmount)
                .sum());
        userDashboardDto.setActiveBookings(bookings
                .stream()
                .filter(booking -> booking.getStatus().equals("AVAILABLE")).count());
        List<BookingResponseDto> recentBookings = bookingService.getRecentBookings(id);
        userDashboardDto.setRecentBookings(recentBookings);
        return userDashboardDto;
    }

    public Integer getTotalUser(String roleName) {
        Role role = roleRepo.findByName(roleName)
                .orElseThrow(()->new ResourceNotFoundException("No user With this role found"));
        List<User> users=userRepo.findByRole(role);
        return users.size();
    }

    public Integer getTotalVehicles() {
        List<Vehicle> vehicles= vehicleRepo.findAllActive();
        return vehicles.size();
    }

    public List<UserSpendDto> getTopSpender() {
        Pageable top3 = PageRequest.of(0, 3);
        return bookingRepo.getTopSpenders(top3);
    }

    public void updateUserById(Long id , UserRequestDto dto) {
        User user=userRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found to update "));
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getLicenseNo() != null) user.setLicenseNo(dto.getLicenseNo());
        userRepo.save(user);
    }
}






















