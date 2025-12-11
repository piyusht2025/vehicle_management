package com.poc.backend.dto.vehicle;

import lombok.Data;

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
    private Boolean active;
}
