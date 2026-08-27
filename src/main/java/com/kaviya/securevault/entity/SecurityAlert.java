package com.kaviya.securevault.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class SecurityAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String alertType;

    private String message;

    private String severity;

    private LocalDateTime createdAt;

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

    // Get Alert Type
    public String getAlertType() {
        return alertType;
    }

    // Set Alert Type
    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    // Get Message
    public String getMessage() {
        return message;
    }

    // Set Message
    public void setMessage(String message) {
        this.message = message;
    }

    // Get Severity
    public String getSeverity() {
        return severity;
    }

    // Set Severity
    public void setSeverity(String severity) {
        this.severity = severity;
    }

    // Get Created At
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Set Created At
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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
