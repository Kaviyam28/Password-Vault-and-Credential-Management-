package com.kaviya.securevault.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class SuspiciousActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String activityType;

    private String description;

    private LocalDateTime detectedAt;

    private String status;

    // Get ID
    public Long getId() {
        return id;
    }

    // Get Email
    public String getEmail() {
        return email;
    }

    // Set Email
    public void setEmail(String email) {
        this.email = email;
    }

    // Get Activity Type
    public String getActivityType() {
        return activityType;
    }

    // Set Activity Type
    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    // Get Description
    public String getDescription() {
        return description;
    }

    // Set Description
    public void setDescription(String description) {
        this.description = description;
    }

    // Get Detected At
    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    // Set Detected At
    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }

    // Get Status
    public String getStatus() {
        return status;
    }

    // Set Status
    public void setStatus(String status) {
        this.status = status;
    }
}