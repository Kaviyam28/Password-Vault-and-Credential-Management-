package com.kaviya.securevault.dto;

public class SecurityAnalyticsDTO {

    private long totalLogins;
    private long successfulLogins;
    private long failedLogins;
    private long suspiciousActivities;
    private long securityAlerts;
    private long auditLogs;

    public SecurityAnalyticsDTO() {
    }

    public SecurityAnalyticsDTO(
            long totalLogins,
            long successfulLogins,
            long failedLogins,
            long suspiciousActivities,
            long securityAlerts,
            long auditLogs) {

        this.totalLogins = totalLogins;
        this.successfulLogins = successfulLogins;
        this.failedLogins = failedLogins;
        this.suspiciousActivities = suspiciousActivities;
        this.securityAlerts = securityAlerts;
        this.auditLogs = auditLogs;
    }

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

    public long getAuditLogs() {
        return auditLogs;
    }

    public void setAuditLogs(long auditLogs) {
        this.auditLogs = auditLogs;
    }
}
