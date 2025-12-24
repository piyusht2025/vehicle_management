package com.poc.backend.mapper;

import com.poc.backend.dto.vehicle.VehicleRequestDto;
import com.poc.backend.dto.vehicle.VehicleResponseDto;
import com.poc.backend.entity.User;
import com.poc.backend.entity.Vehicle;
import com.poc.backend.entity.VehicleImage;
import com.poc.backend.exception.ResourceNotFoundException;
import com.poc.backend.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class VehicleMapper {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private VehicleTypesRepo vehicleTypesRepo;
    @Autowired
    private FuelTypeRepo fuelTypeRepo;
    @Autowired
    private VehicleStatusRepo vehicleStatusRepo;
    @Autowired
    private CityRepo cityRepo;

    public VehicleResponseDto toDto(Vehicle vehicle) {
        VehicleResponseDto vehicleDto = modelMapper.map(vehicle, VehicleResponseDto.class);
        vehicleDto.setOwnerName(vehicle.getOwner().getName());
        vehicleDto.setType(vehicle.getType().getName());
        vehicleDto.setFuelType(vehicle.getFuelType().getName());
        vehicleDto.setStatus(vehicle.getStatus().getName());
        vehicleDto.setCity(vehicle.getCity().getName());
        vehicleDto.setImages(
                vehicle.getImages() != null ?
                        vehicle.getImages().stream()
                                .map(img -> img.getUrl())
                                .collect(Collectors.toList())
                        : null);
        return vehicleDto;
    }

    public Vehicle toEntity(VehicleRequestDto dto) {
//        System.out.println(dto);
        Vehicle vehicle = modelMapper.map(dto, Vehicle.class);
        vehicle.setId(null);

        User owner = userRepo.findById(dto.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Owner doesn't exist"));
        vehicle.setOwner(owner);

        vehicle.setType(vehicleTypesRepo.findByName(dto.getType().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("VehicleType doesn't exist")));
        vehicle.setFuelType(fuelTypeRepo.findByName(dto.getFuelType().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("FuelType doesn't exist")));
        vehicle.setCity(cityRepo.findByName(dto.getCity().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("City Not supported")));
        if (dto.getStatus() != null) {
            vehicle.setStatus(vehicleStatusRepo.findByName(dto.getStatus().toUpperCase())
                    .orElseThrow(() -> new ResourceNotFoundException("VehicleStatus doesn't exist")));
        }
        vehicle.setImages(null);
        vehicle.setActive(false);
        return vehicle;
    }

    public List<VehicleImage> mapImages(Vehicle vehicle, List<String> imageUrls) {
        return imageUrls.stream()
                .map(url -> {
                    VehicleImage img = new VehicleImage();
                    img.setVehicle(vehicle);
                    img.setUrl(url);
                    return img;
                })
                .collect(Collectors.toList());
    }

}

