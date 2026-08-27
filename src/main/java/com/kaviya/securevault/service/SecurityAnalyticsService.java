package com.kaviya.securevault.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaviya.securevault.dto.SecurityAnalyticsResponse;
import com.kaviya.securevault.entity.AuditLog;
import com.kaviya.securevault.entity.LoginActivity;
import com.kaviya.securevault.entity.SecurityAlert;
import com.kaviya.securevault.entity.SuspiciousActivity;
import com.kaviya.securevault.repository.AuditLogRepository;
import com.kaviya.securevault.repository.LoginActivityRepository;
import com.kaviya.securevault.repository.SecurityAlertRepository;
import com.kaviya.securevault.repository.SuspiciousActivityRepository;

@Service
public class SecurityAnalyticsService {

    @Autowired
    private LoginActivityRepository loginActivityRepository;

    @Autowired
    private SuspiciousActivityRepository suspiciousActivityRepository;

    @Autowired
    private SecurityAlertRepository securityAlertRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    // ==========================================
    // GET SECURITY ANALYTICS
    // ==========================================

    public SecurityAnalyticsResponse getSecurityAnalytics(
            String email) {

        SecurityAnalyticsResponse response =
                new SecurityAnalyticsResponse();

        // ==========================================
        // LOGIN ACTIVITIES
        // ==========================================

        List<LoginActivity> loginActivities =
                loginActivityRepository
                        .findByEmailOrderByTimestampDesc(email);

        long totalLogins = loginActivities.size();

        long successfulLogins =
                loginActivities.stream()
                        .filter(activity ->
                                "SUCCESS".equalsIgnoreCase(
                                        activity.getStatus()))
                        .count();

        long failedLogins =
                loginActivities.stream()
                        .filter(activity ->
                                "FAILED".equalsIgnoreCase(
                                        activity.getStatus()))
                        .count();

        // ==========================================
        // SUSPICIOUS ACTIVITIES
        // ==========================================

        List<SuspiciousActivity> suspiciousActivities =
                suspiciousActivityRepository
                        .findByEmailOrderByDetectedAtDesc(email);

        // ==========================================
        // SECURITY ALERTS
        // ==========================================

        List<SecurityAlert> securityAlerts =
                securityAlertRepository
                        .findByEmailOrderByCreatedAtDesc(email);

        // ==========================================
        // AUDIT LOGS
        // ==========================================

        List<AuditLog> auditLogs =
                auditLogRepository
                        .findByEmailOrderByTimestampDesc(email);

        // ==========================================
        // SET STATISTICS
        // ==========================================

        response.setTotalLogins(totalLogins);

        response.setSuccessfulLogins(
                successfulLogins);

        response.setFailedLogins(
                failedLogins);

        response.setSuspiciousActivities(
                suspiciousActivities.size());

        response.setSecurityAlerts(
                securityAlerts.size());

        // ==========================================
        // SET RECENT DATA
        // ==========================================

        response.setRecentLoginActivities(
                loginActivities.stream()
                        .limit(10)
                        .toList());

        response.setRecentSuspiciousActivities(
                suspiciousActivities.stream()
                        .limit(10)
                        .toList());

        response.setRecentSecurityAlerts(
                securityAlerts.stream()
                        .limit(10)
                        .toList());

        response.setRecentAuditLogs(
                auditLogs.stream()
                        .limit(10)
                        .toList());

        return response;
    }
}