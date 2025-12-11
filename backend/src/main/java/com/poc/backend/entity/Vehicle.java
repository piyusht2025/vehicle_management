package com.poc.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "vehicles")
@JsonIgnoreProperties({"owner", "images"})
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonIgnoreProperties("vehicles")
    private User owner;
    @ManyToOne
    @JoinColumn(name = "type")
    private VehicleType type;
    @ManyToOne
    @JoinColumn(name = "fuel_type")
    private FuelType fuelType;
    @ManyToOne
    @JoinColumn(name = "status")
    private VehicleStatus status;
    private String brand;
    private String model;
    private String registrationNo;
    private String transmission;
    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;
    private Integer seat;
    private Double pricePerHour;
    private Double pricePerDay;
    @Column(name = "is_available")
    private Boolean available = false;
    @Column(name = "is_active")
    private Boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("vehicle")
    private List<VehicleImage> images = new ArrayList<>();

    @Column(name = "avg_rating")
    private Double avgRating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Override
    public String toString() {
        return "Vehicle{id=" + id + ", brand=" + brand + ", model=" + model + ", registrationNo=" + registrationNo + "}";
    }
}
