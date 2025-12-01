package com.poc.backend.dto.booking;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequestDto {
    private Long vehicleId;
    private Long renterId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double amount;
}
