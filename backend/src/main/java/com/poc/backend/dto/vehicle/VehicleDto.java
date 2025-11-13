package com.poc.backend.dto.vehicle;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
public class VehicleDto{
    private Long id;
    private String brand;
    private String model;
    private String registrationNo;
    private String type;
    private String fuelType;
    private String transmission;
    private Integer seat;
    private Double pricePerHour;
    private Double pricePerDay;
    private Boolean isAvailable;

}