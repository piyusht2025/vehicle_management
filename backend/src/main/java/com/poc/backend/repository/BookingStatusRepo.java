package com.poc.backend.repository;

import com.poc.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingStatusRepo extends JpaRepository<BookingStatus, Long> {
    Optional<BookingStatus> findByName(String name);
}
