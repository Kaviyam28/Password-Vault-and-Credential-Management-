package com.kaviya.securevault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaviya.securevault.dto.SecurityAnalyticsResponse;
import com.kaviya.securevault.service.SecurityAnalyticsService;

@RestController
@RequestMapping("/api/security-analytics")
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
public class SecurityAnalyticsController {

    @Autowired
    private SecurityAnalyticsService securityAnalyticsService;

    @GetMapping("/{email}")
    public SecurityAnalyticsResponse getSecurityAnalytics(
            @PathVariable String email) {

        return securityAnalyticsService
                .getSecurityAnalytics(email);
    }
}
