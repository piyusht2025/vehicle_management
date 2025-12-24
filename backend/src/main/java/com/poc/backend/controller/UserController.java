package com.poc.backend.controller;

import com.poc.backend.dto.user.UserDashboardDto;
import com.poc.backend.dto.user.UserRequestDto;
import com.poc.backend.dto.user.UserResponse;
import com.poc.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserService userService;
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/greet")
    public String greet() {
        return "HEllo";
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRequestDto userRequestDto) {
        return new ResponseEntity<>(userService.registerUser(userRequestDto), HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/getUserById/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @PatchMapping("/updateUserById/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<String> updateUserById(@PathVariable Long id,@RequestBody UserRequestDto userRequestDto) {
        userService.updateUserById(id,userRequestDto);
        return ResponseEntity.ok("Updated successfully");
    }

    @GetMapping("/{id}/dashboard-data")
    @PreAuthorize("isAuthenticated() and #id == principal.id")
    public ResponseEntity<UserDashboardDto> getUserDashboardData(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUserdashboardData(id), HttpStatus.OK);
    }
}
