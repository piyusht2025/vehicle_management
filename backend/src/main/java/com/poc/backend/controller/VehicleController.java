package com.poc.backend.controller;

import com.poc.backend.dto.vehicle.VehicleRequestDto;
import com.poc.backend.dto.vehicle.VehicleResponseDto;
import com.poc.backend.repository.VehicleImageRepo;
import com.poc.backend.repository.VehicleRepo;
import com.poc.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;
    @Autowired
    private VehicleRepo vehicleRepo;
    @Autowired
    private VehicleImageRepo vehicleImageRepo;
    @PostMapping
    public ResponseEntity<VehicleResponseDto> addVehicle(@RequestBody VehicleRequestDto dto) {
        return ResponseEntity.ok(vehicleService.addVehicle(dto));
    }
    @GetMapping
    public ResponseEntity<List<VehicleResponseDto>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }
    @GetMapping("/available")
    public ResponseEntity<List<VehicleResponseDto>> getAllAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.getAllAvailableVehicles());
    }
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getById(id));
    }
    @PatchMapping ("/{id}")
    public ResponseEntity<VehicleResponseDto> updateVehicle(
            @PathVariable Long id,
            @RequestBody VehicleRequestDto dto) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok("Vehicle deleted successfully");
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadVehicleImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        vehicleService.uploadImage(id,file);
        return ResponseEntity.ok("Image uploaded successfully: " );
    }
}