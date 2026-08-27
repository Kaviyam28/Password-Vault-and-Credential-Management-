package com.kaviya.securevault.dto;

import java.util.List;

import com.kaviya.securevault.entity.AuditLog;
import com.kaviya.securevault.entity.LoginActivity;
import com.kaviya.securevault.entity.SecurityAlert;
import com.kaviya.securevault.entity.SuspiciousActivity;

public class SecurityAnalyticsResponse {

    // ==========================================
    // SECURITY STATISTICS
    // ==========================================

    private long totalLogins;

    private long successfulLogins;

    private long failedLogins;

    private long suspiciousActivities;

    private long securityAlerts;

    // ==========================================
    // RECENT DATA
    // ==========================================

    private List<LoginActivity> recentLoginActivities;

    private List<SuspiciousActivity> recentSuspiciousActivities;

    private List<SecurityAlert> recentSecurityAlerts;

    private List<AuditLog> recentAuditLogs;

    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public long getTotalLogins() {
        return totalLogins;
    }

    public void setTotalLogins(long totalLogins) {
        this.totalLogins = totalLogins;
    }

    public long getSuccessfulLogins() {
        return successfulLogins;
    }

    public void setSuccessfulLogins(long successfulLogins) {
        this.successfulLogins = successfulLogins;
    }

    public long getFailedLogins() {
        return failedLogins;
    }

    public void setFailedLogins(long failedLogins) {
        this.failedLogins = failedLogins;
    }

    public long getSuspiciousActivities() {
        return suspiciousActivities;
    }

    public void setSuspiciousActivities(long suspiciousActivities) {
        this.suspiciousActivities = suspiciousActivities;
    }

    public long getSecurityAlerts() {
        return securityAlerts;
    }

    public void setSecurityAlerts(long securityAlerts) {
        this.securityAlerts = securityAlerts;
    }

    public List<LoginActivity> getRecentLoginActivities() {
        return recentLoginActivities;
    }

    public void setRecentLoginActivities(
            List<LoginActivity> recentLoginActivities) {
        this.recentLoginActivities = recentLoginActivities;
    }

    public List<SuspiciousActivity> getRecentSuspiciousActivities() {
        return recentSuspiciousActivities;
    }

    public void setRecentSuspiciousActivities(
            List<SuspiciousActivity> recentSuspiciousActivities) {
        this.recentSuspiciousActivities =
                recentSuspiciousActivities;
    }

    public List<SecurityAlert> getRecentSecurityAlerts() {
        return recentSecurityAlerts;
    }

    public void setRecentSecurityAlerts(
            List<SecurityAlert> recentSecurityAlerts) {
        this.recentSecurityAlerts =
                recentSecurityAlerts;
    }

    public List<AuditLog> getRecentAuditLogs() {
        return recentAuditLogs;
    }

    public void setRecentAuditLogs(
            List<AuditLog> recentAuditLogs) {
        this.recentAuditLogs = recentAuditLogs;
    }
}