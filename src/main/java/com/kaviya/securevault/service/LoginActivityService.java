package com.kaviya.securevault.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaviya.securevault.entity.LoginActivity;
import com.kaviya.securevault.repository.LoginActivityRepository;

@Service
public class LoginActivityService {

    @Autowired
    private LoginActivityRepository loginActivityRepository;

    public void saveLoginActivity(
            String email,
            String status,
            String ipAddress,
            String failureReason) {

        LoginActivity activity = new LoginActivity();

        activity.setEmail(email);
        activity.setStatus(status);
        activity.setTimestamp(LocalDateTime.now());
        activity.setIpAddress(ipAddress);
        activity.setFailureReason(failureReason);

        loginActivityRepository.save(activity);
    }
}
