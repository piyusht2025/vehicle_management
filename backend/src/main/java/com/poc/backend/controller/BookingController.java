package com.poc.backend.controller;

import com.poc.backend.dto.booking.BookingRequestDto;
import com.poc.backend.dto.booking.BookingResponseDto;
import com.poc.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("api/booking")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponseDto> addBooking(@RequestBody BookingRequestDto bookingRequestDto) {
        return new ResponseEntity<>(bookingService.addBooking(bookingRequestDto), HttpStatus.OK);
    }

    @GetMapping("user/{id}")
    public ResponseEntity<List<BookingResponseDto>> getVehicleByUserId(@PathVariable Long id) {
        return new ResponseEntity<>(bookingService.getBookingByUserId(id), HttpStatus.OK);
    }

    @GetMapping("owner/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN') and (#id==principal.id or hasRole('ADMIN'))")
    public ResponseEntity<List<BookingResponseDto>> getBookingByOwnerId(@PathVariable Long id) {
        return new ResponseEntity<>(bookingService.getBookingByOwnerId(id), HttpStatus.OK);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated() and @bookingService.isBookingCreator(#id, principal.id)")
    public ResponseEntity<String> cancelBookingStatus(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasRole('OWNER') and @bookingService.isVehicleOwnerForBooking(#id, principal.id)")
    public ResponseEntity<String> approveBooking(@PathVariable Long id) {
        bookingService.acceptBooking(id);
        return ResponseEntity.ok("Booking approved by owner.");
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('OWNER') and @bookingService.isVehicleOwnerForBooking(#id, principal.id)")
    public ResponseEntity<String> rejectBooking(@PathVariable Long id) {
        bookingService.rejectBooking(id);
        return ResponseEntity.ok("Booking rejected by owner.");
    }

    @PatchMapping("/{id}/pay")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> payBooking(@PathVariable Long id) {
        bookingService.payBooking(id);
        return ResponseEntity.ok("Payment successful & booking confirmed.");
    }


}
