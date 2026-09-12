package com.kaviya.securevault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaviya.securevault.entity.Notification;
import com.kaviya.securevault.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
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
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // ==========================================
    // GET USER NOTIFICATIONS
    // ==========================================
    @GetMapping("/{userId}")
    public List<Notification> getNotifications(
            @PathVariable String userId) {

        return notificationService.getUserNotifications(userId);
    }

    // ==========================================
    // MARK NOTIFICATION AS READ
    // ==========================================
    @PutMapping("/read/{id}")
    public Notification markAsRead(
            @PathVariable Long id) {

        return notificationService.markAsRead(id);
    }
}

