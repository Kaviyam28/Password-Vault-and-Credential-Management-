package com.kaviya.securevault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaviya.securevault.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

}
