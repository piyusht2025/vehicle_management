package com.poc.backend.mapper;

public class TestMapper {

//    @Component
//    public class VehicleMapper {
//        @Autowired
//        private ModelMapper modelMapper;
//        @Autowired
//        private UserRepo userRepo;
//        @Autowired
//        private VehicleTypeRepo vehicleTypeRepo;
//        @Autowired
//        private FuelTypeRepo fuelTypeRepo;
//        @Autowired
//        private VehicleStatusRepo vehicleStatusRepo;
//        @Autowired
//        private VehicleImageRepo vehicleImageRepo;
//        /**
//         * Converts Vehicle Entity → VehicleResponseDto
//         */
//        public VehicleResponseDto toDto(Vehicle vehicle) {
//            List<String> imageUrls = vehicleImageRepo.findByVehicleId(vehicle.getId())
//                    .stream().map(VehicleImage::getUrl)
//                    .collect(Collectors.toList());
//            return VehicleResponseDto.builder()
//                    .id(vehicle.getId())
//                    .ownerName(vehicle.getOwner().getName())
//                    .type(vehicle.getType().getName())
//                    .fuelType(vehicle.getFuelType().getName())
//                    .status(vehicle.getStatus().getName())
//                    .brand(vehicle.getBrand())
//                    .model(vehicle.getModel())
//                    .registrationNo(vehicle.getRegistrationNo())
//                    .transmission(vehicle.getTransmission())
//                    .seat(vehicle.getSeat())
//                    .pricePerHour(vehicle.getPricePerHour())
//                    .pricePerDay(vehicle.getPricePerDay())
//                    .images(imageUrls)
//                    .build();
//        }
//        /**
//         * Converts VehicleRequestDto → Vehicle Entity
//         */
//        public Vehicle toEntity(VehicleRequestDto dto) {
//            Vehicle vehicle = new Vehicle();
//            User owner = userRepo.findById(dto.getOwnerId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Owner not found with ID " + dto.getOwnerId()));
//            VehicleType type = vehicleTypeRepo.findByNameIgnoreCase(dto.getType())
//                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle Type not found: " + dto.getType()));
//            FuelType fuelType = fuelTypeRepo.findByNameIgnoreCase(dto.getFuelType())
//                    .orElseThrow(() -> new ResourceNotFoundException("Fuel Type not found: " + dto.getFuelType()));
//            VehicleStatus status = vehicleStatusRepo.findByNameIgnoreCase(dto.getStatus())
//                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle Status not found: " + dto.getStatus()));
//            vehicle.setOwner(owner);
//            vehicle.setType(type);
//            vehicle.setFuelType(fuelType);
//            vehicle.setStatus(status);
//            vehicle.setBrand(dto.getBrand());
//            vehicle.setModel(dto.getModel());
//            vehicle.setRegistrationNo(dto.getRegistrationNo());
//            vehicle.setTransmission(dto.getTransmission());
//            vehicle.setSeat(dto.getSeat());
//            vehicle.setPricePerHour(dto.getPricePerHour());
//            vehicle.setPricePerDay(dto.getPricePerDay());
//            return vehicle;
//        }
//        /**
//         * Maps and links Vehicle Images to a Vehicle
//         */
//        public List<VehicleImage> mapImages(Vehicle vehicle, List<String> imageUrls) {
//            return imageUrls.stream()
//                    .map(url -> {
//                        VehicleImage img = new VehicleImage();
//                        img.setVehicle(vehicle);
//                        img.setUrl(url);
//                        return img;
//                    })
//                    .collect(Collectors.toList());
//        }
//    }
//l

}
//import com.poc.backend.dto.vehicle.VehicleRequestDto;
//import com.poc.backend.dto.vehicle.VehicleResponseDto;
//import com.poc.backend.entity.Vehicle;
//import com.poc.backend.entity.VehicleImage;
//import com.poc.backend.exception.ResourceNotFoundException;
//import com.poc.backend.mapper.VehicleMapper;
//import com.poc.backend.repository.VehicleImageRepo;
//import com.poc.backend.repository.VehicleRepo;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import java.util.List;
//import java.util.stream.Collectors;
//@Service
//@RequiredArgsConstructor
//public class VehicleService {
//    private final VehicleRepo vehicleRepo;
//    private final VehicleImageRepo vehicleImageRepo;
//    private final VehicleMapper vehicleMapper;
//    /**
//     * Add new vehicle
//     */
//    @Transactional
//    public VehicleResponseDto addVehicle(VehicleRequestDto dto) {
//        // Convert DTO → Entity
//        Vehicle vehicle = vehicleMapper.toEntity(dto);
//        Vehicle savedVehicle = vehicleRepo.save(vehicle);
//        // Map and save images
//        List<VehicleImage> images = vehicleMapper.mapImages(savedVehicle, dto.getImages());
//        vehicleImageRepo.saveAll(images);
//        // Convert back to DTO for response
//        return vehicleMapper.toDto(savedVehicle);
//    }
//    /**
//     * Get all vehicles
//     */
//    public List<VehicleResponseDto> getAllVehicles() {
//        return vehicleRepo.findAll()
//                .stream()
//                .map(vehicleMapper::toDto)
//                .collect(Collectors.toList());
//    }
//    /**
//     * Get vehicle by ID
//     */
//    public VehicleResponseDto getVehicleById(Long id) {
//        Vehicle vehicle = vehicleRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
//        return vehicleMapper.toDto(vehicle);
//    }
//    /**
//     * Update existing vehicle
//     */
//    @Transactional
//    public VehicleResponseDto updateVehicle(Long id, VehicleRequestDto dto) {
//        Vehicle existingVehicle = vehicleRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
//        // Update basic details from DTO
//        Vehicle updatedVehicle = vehicleMapper.toEntity(dto);
//        updatedVehicle.setId(existingVehicle.getId());
//        // Save updated vehicle
//        Vehicle savedVehicle = vehicleRepo.save(updatedVehicle);
//        // Update images if provided
//        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
//            vehicleImageRepo.deleteAll(vehicleImageRepo.findByVehicleId(id)); // Remove old
//            List<VehicleImage> newImages = vehicleMapper.mapImages(savedVehicle, dto.getImages());
//            vehicleImageRepo.saveAll(newImages);
//        }
//        return vehicleMapper.toDto(savedVehicle);
//    }
//    /**
//     * Delete vehicle by ID
//     */
//    @Transactional
//    public void deleteVehicle(Long id) {
//        Vehicle vehicle = vehicleRepo.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
//        // Cascade delete images
//        vehicleImageRepo.deleteAll(vehicleImageRepo.findByVehicleId(id));
//        vehicleRepo.delete(vehicle);
//    }
//}




















