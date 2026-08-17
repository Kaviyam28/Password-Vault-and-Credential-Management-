package com.kaviya.securevault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaviya.securevault.entity.PasswordEntry;

public interface PasswordRepository extends JpaRepository<PasswordEntry, Long> {

    List<PasswordEntry> findByUserEmail(String userEmail);

}
