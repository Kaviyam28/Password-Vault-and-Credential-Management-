package com.kaviya.securevault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaviya.securevault.entity.SecurityAlert;

public interface SecurityAlertRepository
        extends JpaRepository<SecurityAlert, Long> {

    List<SecurityAlert> findByEmailOrderByCreatedAtDesc(
            String email
    );
}
