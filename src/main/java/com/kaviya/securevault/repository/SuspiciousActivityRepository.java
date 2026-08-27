package com.kaviya.securevault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaviya.securevault.entity.SuspiciousActivity;

public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    List<SuspiciousActivity> findByEmailOrderByDetectedAtDesc(
            String email
    );
}
