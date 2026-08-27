package com.kaviya.securevault.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String action;

    private String description;

    private LocalDateTime timestamp;

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

    // Get Action
    public String getAction() {
        return action;
    }

    // Set Action
    public void setAction(String action) {
        this.action = action;
    }

    // Get Description
    public String getDescription() {
        return description;
    }

    // Set Description
    public void setDescription(String description) {
        this.description = description;
    }

    // Get Timestamp
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    // Set Timestamp
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
