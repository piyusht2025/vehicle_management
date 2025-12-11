package com.poc.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSpendDto {
    private String name;
    private String email;
    private Double totalSpent;
    private Long totalBooking;
}
