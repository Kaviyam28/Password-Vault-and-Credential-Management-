package com.kaviya.securevault.dto;

public class PasswordHealthResponse {

    private long totalCredentials;
    private long strong;
    private long medium;
    private long weak;
    private double healthScore;

    public long getTotalCredentials() {
        return totalCredentials;
    }

    public void setTotalCredentials(long totalCredentials) {
        this.totalCredentials = totalCredentials;
    }

    public long getStrong() {
        return strong;
    }

    public void setStrong(long strong) {
        this.strong = strong;
    }

    public long getMedium() {
        return medium;
    }

    public void setMedium(long medium) {
        this.medium = medium;
    }

    public long getWeak() {
        return weak;
    }

    public void setWeak(long weak) {
        this.weak = weak;
    }

    public double getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(double healthScore) {
        this.healthScore = healthScore;
    }
}
