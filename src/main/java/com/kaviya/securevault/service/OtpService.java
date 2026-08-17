package com.kaviya.securevault.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private final Map<String, String> otpStorage = new HashMap<>();

    public String generateOtp(String email) {
        Random random = new Random();

        String otp = String.format("%06d", random.nextInt(999999));

        otpStorage.put(email, otp);

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        return otp.equals(otpStorage.get(email));
    }

    public void removeOtp(String email) {
        otpStorage.remove(email);
    }
}