package com.poc.backend.controller;

import com.poc.backend.dto.booking.BookingRequestDto;
import com.poc.backend.dto.booking.BookingResponseDto;
import com.poc.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping("api/booking")
public class BookingController {
    @Autowired
    BookingService bookingService;
    @PostMapping
    public ResponseEntity<BookingResponseDto> addBooking(@RequestBody BookingRequestDto bookingRequestDto){
        return new ResponseEntity<>(bookingService.addBooking(bookingRequestDto), HttpStatus.OK);
    }

}
