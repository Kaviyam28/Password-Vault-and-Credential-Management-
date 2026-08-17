package com.kaviya.securevault.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaviya.securevault.dto.ForgotPasswordRequest;
import com.kaviya.securevault.dto.ResetPasswordRequest;
import com.kaviya.securevault.dto.VerifyOtpRequest;
import com.kaviya.securevault.entity.User;
import com.kaviya.securevault.repository.UserRepository;
import com.kaviya.securevault.service.EmailService;
import com.kaviya.securevault.service.OtpService;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "http://localhost:5173")
public class ForgotPasswordController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    // Send OTP
    @PostMapping("/forgot")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {

        if (!userRepository.existsByEmail(request.getEmail())) {
            return "Email not found!";
        }

        String otp = otpService.generateOtp(request.getEmail());

        emailService.sendOtp(request.getEmail(), otp);

        return "OTP sent successfully.";
    }

    // Verify OTP
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody VerifyOtpRequest request) {

        boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if (!valid) {
            return "Invalid OTP";
        }

        return "OTP Verified";
    }

    // Reset Password
    @PostMapping("/reset")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return "User not found!";
        }

        user.setPassword(request.getNewPassword());

        userRepository.save(user);

        otpService.removeOtp(request.getEmail());

        return "Password changed successfully.";
    }
}