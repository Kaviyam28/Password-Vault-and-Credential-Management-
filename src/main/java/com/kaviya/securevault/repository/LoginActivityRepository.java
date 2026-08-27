package com.kaviya.securevault.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaviya.securevault.entity.LoginActivity;

public interface LoginActivityRepository
        extends JpaRepository<LoginActivity, Long> {

    // Get login history for a user
    List<LoginActivity> findByEmailOrderByTimestampDesc(String email);

    // Count failed login attempts after a specific time
    long countByEmailAndStatusAndTimestampAfter(
            String email,
            String status,
            LocalDateTime time
    );
}