package com.kaviya.securevault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaviya.securevault.entity.LoginActivity;
import com.kaviya.securevault.repository.LoginActivityRepository;

@RestController
@RequestMapping("/api/login-activity")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
    "http://localhost:5179",
    "http://localhost:3000",
    "https://password-vault-and-credential-manag.vercel.app"
})
public class LoginActivityController {

    @Autowired
    private LoginActivityRepository loginActivityRepository;

    @GetMapping("/{email}")
    public List<LoginActivity> getLoginActivities(
            @PathVariable String email) {

        return loginActivityRepository
                .findByEmailOrderByTimestampDesc(email);
    }
}

