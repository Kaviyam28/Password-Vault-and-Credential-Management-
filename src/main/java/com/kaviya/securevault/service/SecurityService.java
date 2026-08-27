package com.kaviya.securevault.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaviya.securevault.entity.AuditLog;
import com.kaviya.securevault.entity.SecurityAlert;
import com.kaviya.securevault.entity.SuspiciousActivity;
import com.kaviya.securevault.repository.AuditLogRepository;
import com.kaviya.securevault.repository.LoginActivityRepository;
import com.kaviya.securevault.repository.SecurityAlertRepository;
import com.kaviya.securevault.repository.SuspiciousActivityRepository;

@Service
public class SecurityService {

    // Suspicious activity threshold
    private static final int FAILED_LOGIN_THRESHOLD = 5;

    // Time period
    private static final int TIME_WINDOW_MINUTES = 5;

    @Autowired
    private LoginActivityRepository loginActivityRepository;

    @Autowired
    private SuspiciousActivityRepository suspiciousActivityRepository;

    @Autowired
    private SecurityAlertRepository securityAlertRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void analyzeFailedLogin(String email) {

        LocalDateTime timeLimit
                = LocalDateTime.now().minusMinutes(TIME_WINDOW_MINUTES);

        // Count failed login attempts in the last 5 minutes
        long failedAttempts
                = loginActivityRepository
                        .countByEmailAndStatusAndTimestampAfter(
                                email,
                                "FAILED",
                                timeLimit
                        );

        System.out.println(
                "Failed login attempts for "
                + email
                + " in last "
                + TIME_WINDOW_MINUTES
                + " minutes: "
                + failedAttempts
        );

        // Detect suspicious activity when threshold reaches 5
        if (failedAttempts == FAILED_LOGIN_THRESHOLD) {

            createSuspiciousActivity(email);

            createSecurityAlert(email);

            createAuditLog(
                    email,
                    "SUSPICIOUS_ACTIVITY",
                    "Multiple failed login attempts detected"
            );

            createAuditLog(
                    email,
                    "SECURITY_ALERT_CREATED",
                    "High severity security alert generated for multiple failed login attempts"
            );
        }
    }

    // ==========================================
    // CREATE SUSPICIOUS ACTIVITY
    // ==========================================
    private void createSuspiciousActivity(String email) {

        SuspiciousActivity activity
                = new SuspiciousActivity();

        activity.setEmail(email);

        activity.setActivityType(
                "MULTIPLE_FAILED_LOGINS"
        );

        activity.setDescription(
                FAILED_LOGIN_THRESHOLD
                + " failed login attempts detected within "
                + TIME_WINDOW_MINUTES
                + " minutes"
        );

        activity.setDetectedAt(
                LocalDateTime.now()
        );

        activity.setStatus("FLAGGED");

        suspiciousActivityRepository.save(activity);

        System.out.println(
                "Suspicious activity detected for: "
                + email
        );
    }

    // ==========================================
    // CREATE SECURITY ALERT
    // ==========================================
    private void createSecurityAlert(String email) {

        SecurityAlert alert
                = new SecurityAlert();

        alert.setEmail(email);

        alert.setAlertType(
                "MULTIPLE_FAILED_LOGINS"
        );

        alert.setMessage(
                "Multiple failed login attempts detected"
        );

        alert.setSeverity("HIGH");

        alert.setCreatedAt(
                LocalDateTime.now()
        );

        alert.setStatus("UNREAD");

        securityAlertRepository.save(alert);

        System.out.println(
                "Security alert created for: "
                + email
        );
    }

    // ==========================================
    // CREATE AUDIT LOG
    // ==========================================
    private void createAuditLog(
            String email,
            String action,
            String description) {

        AuditLog auditLog
                = new AuditLog();

        auditLog.setEmail(email);

        auditLog.setAction(action);

        auditLog.setDescription(description);

        auditLog.setTimestamp(
                LocalDateTime.now()
        );

        auditLogRepository.save(auditLog);

        System.out.println(
                "Audit log created: "
                + action
        );
    }
}
