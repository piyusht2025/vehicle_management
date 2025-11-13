package com.poc.backend.dto.vehicle;

import com.poc.backend.entity.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class VehicleRequestDto {
    private Long ownerId;
    private String type;
    private String fuelType;
    private String status;
    private String brand;
    private String model;
    private String registrationNo;
    private String transmission;
    private String city;
    private Integer seat;
    private Double pricePerHour;
    private Double pricePerDay;
    private Boolean available;
    private List<String> images;
}
