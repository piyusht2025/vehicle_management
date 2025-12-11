package com.poc.backend.controller;
import com.poc.backend.dto.auth.AuthRequest;
import com.poc.backend.dto.auth.AuthResponse;
import com.poc.backend.dto.auth.RefreshTokenRequest;
import com.poc.backend.dto.user.UserRequestDto;
import com.poc.backend.entity.Role;
import com.poc.backend.entity.User;
import com.poc.backend.repository.RoleRepo;
import com.poc.backend.repository.UserRepo;
import com.poc.backend.security.CustomUserDetails;
import com.poc.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private final AuthenticationManager authManager;
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final com.poc.backend.security.AppUserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequestDto userRequestDto) {
        if (userRepo.findByEmail(userRequestDto.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }
        Role role = roleRepo.findByName(userRequestDto.getRole().toUpperCase()).orElseGet(() -> roleRepo.findByName("USER").orElseThrow());
        User u = new User();
        u.setName(userRequestDto.getName());
        u.setEmail(userRequestDto.getEmail());
        u.setPhone(userRequestDto.getPhone());
        u.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        u.setRole(role);
        u.setActive(true);
        userRepo.save(u);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);


        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, userDetails.getUsername()));
    }


    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        String username = jwtUtil.extractUsernameFromRefreshToken(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtUtil.validateRefreshToken(refreshToken, userDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newAccessToken = jwtUtil.generateAccessToken(userDetails);

        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(newAccessToken, newRefreshToken,userDetails.getUsername()));
    }
}
