package com.poc.backend.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "vehicle_image")
public class VehicleImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name="vehicle_id")
    private Vehicle vehicle;
    @Column(name="image_url")
    private String url;
    private LocalDateTime createdAt=LocalDateTime.now();
}
