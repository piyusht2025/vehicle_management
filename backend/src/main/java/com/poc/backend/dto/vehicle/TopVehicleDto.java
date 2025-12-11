package com.poc.backend.dto.vehicle;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopVehicleDto {
    private String name;
    private String ownerName;
    private String type;
    public Long totalBooking;
    public Double totalRevenue;
}