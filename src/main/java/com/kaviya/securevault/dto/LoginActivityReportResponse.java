package com.kaviya.securevault.dto;

import java.util.List;

import com.kaviya.securevault.entity.LoginActivity;

public class LoginActivityReportResponse {

    private long totalAttempts;
    private long successfulLogins;
    private long failedLogins;
    private List<LoginActivity> recentActivities;

    public long getTotalAttempts() {
        return totalAttempts;
    }

    public void setTotalAttempts(long totalAttempts) {
        this.totalAttempts = totalAttempts;
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

    public List<LoginActivity> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<LoginActivity> recentActivities) {
        this.recentActivities = recentActivities;
    }
}

