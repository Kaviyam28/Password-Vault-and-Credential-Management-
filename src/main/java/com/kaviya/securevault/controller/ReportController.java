package com.kaviya.securevault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaviya.securevault.dto.PasswordHealthResponse;
import com.kaviya.securevault.entity.LoginActivity;
import com.kaviya.securevault.service.ReportService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
    "http://localhost:5179",
    "http://localhost:3000",
    "https://password-vault-and-credential-manag.vercel.app",
    "https://password-vault-and-credential-management-rl16fzfxn-kaviya18.vercel.app"
})
public class ReportController {

    @Autowired
    private ReportService reportService;

    // ==========================================
    // PASSWORD HEALTH REPORT
    // ==========================================
    @GetMapping("/password-health/{email}")
    public PasswordHealthResponse getPasswordHealth(
            @PathVariable String email) {

        return reportService.getPasswordHealth(email);
    }

    // ==========================================
    // TOTAL LOGIN ATTEMPTS
    // ==========================================
    @GetMapping("/login-activity/total/{email}")
    public long getTotalLoginAttempts(
            @PathVariable String email) {

        return reportService.getTotalLoginAttempts(email);
    }

    // ==========================================
    // SUCCESSFUL LOGINS
    // ==========================================
    @GetMapping("/login-activity/successful/{email}")
    public long getSuccessfulLogins(
            @PathVariable String email) {

        return reportService.getSuccessfulLogins(email);
    }

    // ==========================================
    // FAILED LOGINS
    // ==========================================
    @GetMapping("/login-activity/failed/{email}")
    public long getFailedLogins(
            @PathVariable String email) {

        return reportService.getFailedLogins(email);
    }

    // ==========================================
    // RECENT LOGIN ACTIVITIES
    // ==========================================
    @GetMapping("/login-activity/recent/{email}")
    public List<LoginActivity> getRecentLoginActivities(
            @PathVariable String email) {

        return reportService.getRecentLoginActivities(email);
    }
}
