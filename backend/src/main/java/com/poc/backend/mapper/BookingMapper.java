package com.poc.backend.mapper;

import com.poc.backend.dto.booking.BookingResponseDto;
import com.poc.backend.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponseDto toDto(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setVehicleModel(booking.getVehicle().getModel());
        dto.setOwnerName(booking.getVehicle().getOwner().getName());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setAmount(booking.getAmount());
        dto.setStatus(booking.getStatus().getName());
        dto.setVehicleId(booking.getVehicle().getId());
        dto.setVehicleStatus(booking.getVehicle().getStatus().getName());
        return dto;
    }
}

