package com.kaviya.securevault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaviya.securevault.entity.User;
import com.kaviya.securevault.service.EmailService;
import com.kaviya.securevault.service.LoginActivityService;
import com.kaviya.securevault.service.NotificationService;
import com.kaviya.securevault.service.SecurityService;
import com.kaviya.securevault.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
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
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private LoginActivityService loginActivityService;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    // ==========================================
    // REGISTER
    // ==========================================
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {

        return userService.registerUser(user);
    }

    // ==========================================
    // GET USER BY EMAIL
    // ==========================================
    @GetMapping("/user/{email}")
    public User getUserByEmail(@PathVariable String email) {

        return userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ==========================================
    // LOGIN
    // ==========================================
    @PostMapping("/login")
    public String loginUser(
            @RequestBody User user,
            HttpServletRequest request) {

        String result = userService.loginUser(user);

        String ipAddress = request.getRemoteAddr();

        // ==========================================
        // SUCCESSFUL LOGIN
        // ==========================================
        if (result.equals("Login Successful")) {

            // Save login activity
            loginActivityService.saveLoginActivity(
                    user.getEmail(),
                    "SUCCESS",
                    ipAddress,
                    null
            );

            // ==========================================
            // GET ACTUAL USER FROM DATABASE
            // ==========================================
            User loggedInUser = userService
                    .getUserByEmail(user.getEmail())
                    .orElse(null);

            // ==========================================
            // CREATE LOGIN NOTIFICATION
            // ==========================================
            if (loggedInUser != null) {

                notificationService.createNotification(
                        loggedInUser.getId().toString(),
                        "LOGIN",
                        "New Login Detected",
                        "New login detected on your SecureVault account."
                );

                // ==========================================
                // SEND LOGIN EMAIL
                // ==========================================
                emailService.sendNotificationEmail(
                        loggedInUser.getEmail(),
                        "New Login Detected",
                        "New login detected on your SecureVault account."
                );
            }

        } // ==========================================
        // FAILED LOGIN
        // ==========================================
        else {

            // Save failed login activity
            loginActivityService.saveLoginActivity(
                    user.getEmail(),
                    "FAILED",
                    ipAddress,
                    "Invalid Email or Password"
            );

            // Analyze failed login attempts
            securityService.analyzeFailedLogin(
                    user.getEmail()
            );
        }

        return result;
    }

}

