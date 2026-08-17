package com.kaviya.securevault.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaviya.securevault.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByUserName(String userName);

    Optional<User> findByEmail(String email);
}
