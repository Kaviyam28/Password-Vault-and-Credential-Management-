package com.kaviya.securevault.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SecureVault Password Reset OTP");
        message.setText(
                "Hello,\n\n"
                + "Your OTP for password reset is: " + otp + "\n\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "Regards,\n"
                + "SecureVault Team");

        mailSender.send(message);
    }

    // ==========================================
    // SEND NOTIFICATION EMAIL
    // ==========================================
    public void sendNotificationEmail(
            String toEmail,
            String title,
            String messageText) {

        SimpleMailMessage message
                = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SecureVault - " + title);

        message.setText(
                "Hello,\n\n"
                + messageText
                + "\n\n"
                + "Please log in to your SecureVault account "
                + "for more details.\n\n"
                + "Regards,\n"
                + "SecureVault Team");

        mailSender.send(message);
    }
}
