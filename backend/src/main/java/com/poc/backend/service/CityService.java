package com.poc.backend.service;

import com.poc.backend.entity.City;
import com.poc.backend.repository.CityRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {
    @Autowired
    CityRepo cityRepo;
    public List<City> getAllCities() {
        return cityRepo.findAll();
    }
}
