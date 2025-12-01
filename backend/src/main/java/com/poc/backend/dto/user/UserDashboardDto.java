package com.poc.backend.dto.user;

import com.poc.backend.dto.booking.BookingResponseDto;
import lombok.Data;

import java.util.List;

@Data
public class UserDashboardDto {
    private Long activeBookings;
    private Long totalBookings;
    private Double totalSpent;
    private List<BookingResponseDto> recentBookings;
}
