package com.poc.backend.dto.booking;

import lombok.Data;

import java.util.List;

@Data
public class MonthlyEarningsDto {
    private List<String> months;
    private List<Double> earnings;
}
