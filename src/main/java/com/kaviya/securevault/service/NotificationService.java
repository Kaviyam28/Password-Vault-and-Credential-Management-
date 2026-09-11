package com.kaviya.securevault.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaviya.securevault.entity.Notification;
import com.kaviya.securevault.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================
    public Notification createNotification(
            String userId,
            String type,
            String title,
            String message) {

        Notification notification = new Notification();

        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    // ==========================================
    // GET USER NOTIFICATIONS
    // ==========================================
    public List<Notification> getUserNotifications(String userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ==========================================
    // MARK AS READ
    // ==========================================
    public Notification markAsRead(Long id) {

        Notification notification
                = notificationRepository.findById(id)
                        .orElseThrow(()
                                -> new RuntimeException("Notification not found"));

        notification.setRead(true);

        return notificationRepository.save(notification);
    }
}
