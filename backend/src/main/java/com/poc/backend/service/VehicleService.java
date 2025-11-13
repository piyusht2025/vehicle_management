package com.poc.backend.service;

import com.poc.backend.dto.vehicle.VehicleRequestDto;
import com.poc.backend.dto.vehicle.VehicleResponseDto;
import com.poc.backend.entity.Vehicle;
import com.poc.backend.entity.VehicleImage;
import com.poc.backend.entity.VehicleStatus;
import com.poc.backend.entity.VehicleType;
import com.poc.backend.exception.ResourceNotFoundException;
import com.poc.backend.mapper.VehicleMapper;
import com.poc.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class VehicleService {
    @Autowired
    private VehicleRepo vehicleRepo;
    @Autowired
    private VehicleMapper vehicleMapper;
    @Autowired
    private VehicleImageRepo vehicleImageRepo;
    @Autowired
    private VehicleTypesRepo vehicleTypesRepo;
    @Autowired
    private FuelTypeRepo fuelTypeRepo;
    @Autowired
    private VehicleStatusRepo vehicleStatusRepo;
    private static final String UPLOAD_DIR = "uploads/vehicles/";

    @Transactional
    public VehicleResponseDto addVehicle(VehicleRequestDto dto) {
        Vehicle vehicle = vehicleMapper.toEntity(dto);
        vehicle.setStatus(vehicleStatusRepo.findByName("PENDING").orElseThrow(()->new ResourceNotFoundException("Status not found")));
        vehicle = vehicleRepo.save(vehicle);
        List<VehicleImage> vehicleImage = vehicleMapper.mapImages(vehicle, dto.getImages());
        List<VehicleImage> savedVehicleImages = vehicleImageRepo.saveAll(vehicleImage);
        vehicle.setImages(savedVehicleImages);
        vehicleRepo.save(vehicle);
        return vehicleMapper.toDto(vehicle);
    }

    public List<VehicleResponseDto> getAllAvailableVehicles() {
        List<Vehicle> vehicles = vehicleRepo.findAll()
                                    .stream()
                                    .filter(Vehicle::getActive)
                                    .filter(vehicle -> vehicle.getStatus().getId()==1)
                                    .toList();
        return vehicles.stream()
                .map(veh -> {
                    return vehicleMapper.toDto(veh);
                }).collect(Collectors.toList());
    }
    public List<VehicleResponseDto> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepo.findAll();
        return vehicles.stream()
                .map(veh -> {
                    return vehicleMapper.toDto(veh);
                }).collect(Collectors.toList());
    }

    public VehicleResponseDto getById(Long id) {
        return vehicleMapper.toDto(vehicleRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("No Vehicle with id  " + id)));
    }

    @Transactional
    public VehicleResponseDto updateVehicle(Long id, VehicleRequestDto dto) {
        Vehicle existingVehicle=vehicleRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("No vehicle with id "+id));

        if (dto.getBrand() != null) existingVehicle.setBrand(dto.getBrand());
        if (dto.getModel() != null) existingVehicle.setModel(dto.getModel());
        if (dto.getRegistrationNo() != null) existingVehicle.setRegistrationNo(dto.getRegistrationNo());
        if (dto.getTransmission() != null) existingVehicle.setTransmission(dto.getTransmission());
        if (dto.getSeat() != null) existingVehicle.setSeat(dto.getSeat());
        if (dto.getPricePerHour() != null) existingVehicle.setPricePerHour(dto.getPricePerHour());
        if (dto.getPricePerDay() != null) existingVehicle.setPricePerDay(dto.getPricePerDay());
        if (dto.getAvailable() != null) existingVehicle.setAvailable(dto.getAvailable());

        if(dto.getType()!=null){
            VehicleType type=vehicleTypesRepo.findByName(dto.getType())
                    .orElseThrow(()->new ResourceNotFoundException("No vehicle with id "+id));
            existingVehicle.setType(type);
        }
        if(dto.getStatus()!=null){
            VehicleStatus status=vehicleStatusRepo.findByName(dto.getStatus())
                    .orElseThrow(()->new ResourceNotFoundException("No vehicle with id "+id));
            existingVehicle.setStatus(status);
        }
        if (dto.getFuelType() != null) {
            existingVehicle.setFuelType(fuelTypeRepo.findByName(dto.getFuelType().toUpperCase())
                    .orElseThrow(() -> new ResourceNotFoundException("FuelType doesn't exist")));
        }

        if (dto.getImages() != null) {
            existingVehicle.getImages().clear();

            if (!dto.getImages().isEmpty()) {
                List<VehicleImage> images = vehicleMapper.mapImages(existingVehicle, dto.getImages());
                existingVehicle.getImages().addAll(images);
            }
        }
        existingVehicle.setUpdatedAt(LocalDateTime.now());

        Vehicle updatedVehicle = vehicleRepo.save(existingVehicle);
        return vehicleMapper.toDto(updatedVehicle);
    }


@Transactional
public void deleteVehicle(Long id) {
    Vehicle existingVehicle = vehicleRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("No Vehicle with id " + id));

    vehicleImageRepo.deleteByVehicleId(id);

    existingVehicle.getImages().clear();

    existingVehicle.setActive(false);
    existingVehicle.setAvailable(false);
    existingVehicle.setUpdatedAt(LocalDateTime.now());

    vehicleRepo.save(existingVehicle);
}


    public void uploadImage(Long id, MultipartFile file) throws IOException {
        Vehicle vehicle = vehicleRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id " + id));

        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
           throw new ResourceNotFoundException("Invalid file type. Only JPEG or PNG allowed.");
        }

        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileExtension = contentType.equals("image/png") ? ".png" : ".jpg";
        String fileName = UUID.randomUUID() + "_" + id + fileExtension;

        Path filePath = Paths.get(UPLOAD_DIR, fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        VehicleImage vehicleImage = new VehicleImage();
        vehicleImage.setVehicle(vehicle);
        vehicleImage.setUrl("/uploads/vehicles/" + fileName);
        vehicleImageRepo.save(vehicleImage);

    }
}
