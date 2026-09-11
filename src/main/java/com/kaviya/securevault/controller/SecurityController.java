package com.kaviya.securevault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaviya.securevault.entity.AuditLog;
import com.kaviya.securevault.entity.SecurityAlert;
import com.kaviya.securevault.entity.SuspiciousActivity;
import com.kaviya.securevault.repository.AuditLogRepository;
import com.kaviya.securevault.repository.SecurityAlertRepository;
import com.kaviya.securevault.repository.SuspiciousActivityRepository;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
    "http://localhost:5179",
    "http://localhost:3000"
})
public class SecurityController {

    @Autowired
    private SuspiciousActivityRepository suspiciousActivityRepository;

    @Autowired
    private SecurityAlertRepository securityAlertRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    // ==========================================
    // GET SUSPICIOUS ACTIVITIES
    // ==========================================
    @GetMapping("/suspicious/{email}")
    public List<SuspiciousActivity> getSuspiciousActivities(
            @PathVariable String email) {

        return suspiciousActivityRepository
                .findByEmailOrderByDetectedAtDesc(email);
    }

    // ==========================================
    // GET SECURITY ALERTS
    // ==========================================
    @GetMapping("/alerts/{email}")
    public List<SecurityAlert> getSecurityAlerts(
            @PathVariable String email) {

        return securityAlertRepository
                .findByEmailOrderByCreatedAtDesc(email);
    }

    // ==========================================
    // GET AUDIT LOGS
    // ==========================================
    @GetMapping("/audit/{email}")
    public List<AuditLog> getAuditLogs(
            @PathVariable String email) {

        return auditLogRepository
                .findByEmailOrderByTimestampDesc(email);
    }
}
