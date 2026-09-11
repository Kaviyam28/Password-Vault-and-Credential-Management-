package com.kaviya.securevault.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaviya.securevault.dto.PasswordHealthResponse;
import com.kaviya.securevault.entity.LoginActivity;
import com.kaviya.securevault.entity.PasswordEntry;
import com.kaviya.securevault.repository.LoginActivityRepository;
import com.kaviya.securevault.repository.PasswordRepository;
import com.kaviya.securevault.util.EncryptionUtil;

@Service
public class ReportService {

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private LoginActivityRepository loginActivityRepository;

    // ==========================================
    // PASSWORD HEALTH REPORT
    // ==========================================
    public PasswordHealthResponse getPasswordHealth(String email) {

        // Get existing credentials from database
        List<PasswordEntry> credentials
                = passwordRepository.findByUserEmail(email);

        long strong = 0;
        long medium = 0;
        long weak = 0;

        // Analyze every password
        for (PasswordEntry entry : credentials) {

            String encryptedPassword = entry.getPassword();

            // Decrypt password for strength analysis
            String password
                    = EncryptionUtil.decrypt(encryptedPassword);

            int score = calculatePasswordStrength(password);

            if (score >= 80) {
                strong++;
            } else if (score >= 50) {
                medium++;
            } else {
                weak++;
            }
        }

        long totalCredentials = credentials.size();

        // ==========================================
        // CALCULATE HEALTH SCORE
        // ==========================================
        double healthScore = 0;

        if (totalCredentials > 0) {

            healthScore
                    = ((strong * 100.0)
                    + (medium * 60.0)
                    + (weak * 20.0))
                    / totalCredentials;
        }

        // Round to 2 decimal places
        healthScore
                = Math.round(healthScore * 100.0) / 100.0;

        // ==========================================
        // CREATE RESPONSE
        // ==========================================
        PasswordHealthResponse response
                = new PasswordHealthResponse();

        response.setTotalCredentials(totalCredentials);
        response.setStrong(strong);
        response.setMedium(medium);
        response.setWeak(weak);
        response.setHealthScore(healthScore);

        return response;
    }

    // ==========================================
    // PASSWORD STRENGTH CHECKER
    // ==========================================
    private int calculatePasswordStrength(String password) {

        if (password == null || password.isEmpty()) {
            return 0;
        }

        int score = 0;

        // Minimum 8 characters
        if (password.length() >= 8) {
            score += 20;
        }

        // Uppercase letter
        if (password.matches(".*[A-Z].*")) {
            score += 20;
        }

        // Lowercase letter
        if (password.matches(".*[a-z].*")) {
            score += 20;
        }

        // Number
        if (password.matches(".*\\d.*")) {
            score += 20;
        }

        // Special character
        if (password.matches(".*[@#$%&*!?].*")) {
            score += 20;
        }

        return score;
    }

    // ==========================================
    // LOGIN ACTIVITY REPORT
    // ==========================================
    public long getTotalLoginAttempts(String email) {

        List<LoginActivity> activities
                = loginActivityRepository
                        .findByEmailOrderByTimestampDesc(email);

        return activities.size();
    }

    public long getSuccessfulLogins(String email) {

        List<LoginActivity> activities
                = loginActivityRepository
                        .findByEmailOrderByTimestampDesc(email);

        return activities.stream()
                .filter(activity
                        -> "SUCCESS".equalsIgnoreCase(
                        activity.getStatus()))
                .count();
    }

    public long getFailedLogins(String email) {

        List<LoginActivity> activities
                = loginActivityRepository
                        .findByEmailOrderByTimestampDesc(email);

        return activities.stream()
                .filter(activity
                        -> "FAILED".equalsIgnoreCase(
                        activity.getStatus()))
                .count();
    }

    public List<LoginActivity> getRecentLoginActivities(
            String email) {

        List<LoginActivity> activities
                = loginActivityRepository
                        .findByEmailOrderByTimestampDesc(email);

        return activities.stream()
                .limit(10)
                .toList();
    }
}
