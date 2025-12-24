package com.poc.backend.controller;

import com.poc.backend.dto.booking.MonthlyEarningsDto;
import com.poc.backend.dto.booking.TotalRevenueDto;
import com.poc.backend.dto.user.UserSpendDto;
import com.poc.backend.dto.vehicle.TopVehicleDto;
import com.poc.backend.service.BookingService;
import com.poc.backend.service.UserService;
import com.poc.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/admin")
public class AdminController {
    @Autowired
    UserService userService;
    @Autowired
    VehicleService vehicleService;
    @Autowired
    BookingService bookingService;
    @GetMapping("total-users")
    public ResponseEntity<Integer> getTotalUser(){
        return new ResponseEntity<>(userService.getTotalUser("USER"), HttpStatus.OK);
    }
    @GetMapping("total-owners")
    public ResponseEntity<Integer> getTotalOwner(){
        return new ResponseEntity<>(userService.getTotalUser("OWNER"), HttpStatus.OK);
    }
    @GetMapping("total-vehicles")
    public ResponseEntity<Integer> getTotalVehicles(){
        return new ResponseEntity<>(userService.getTotalVehicles(), HttpStatus.OK);
    }
    @GetMapping("total-revenues")
    public ResponseEntity<TotalRevenueDto> getTotalRevenue(){
        return new ResponseEntity<>(bookingService.getTotalRevenue(), HttpStatus.OK);
    }
    @GetMapping("pending-vehicle-approvals")
    public ResponseEntity<Integer> getPendingVehicles(){
        return new ResponseEntity<>(vehicleService.getPendingApprovals(), HttpStatus.OK);
    }

    @GetMapping("monthly-earnings")
    public ResponseEntity<MonthlyEarningsDto> getAllMonthlyEarnings() {
        return ResponseEntity.ok(bookingService.getMonthlyEarnings());
    }

    @GetMapping("top-spenders")
    public ResponseEntity<List<UserSpendDto>> getTopSpenders(){
        return ResponseEntity.ok(userService.getTopSpender());
    }

    @GetMapping("top-vehicles")
    public ResponseEntity<List<TopVehicleDto>> getTopVehicles(){
        return ResponseEntity.ok(bookingService.getTopRevenueVehicles());
    }
}
