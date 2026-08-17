package com.kaviya.securevault.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaviya.securevault.entity.User;
import com.kaviya.securevault.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return "Your account is already registered!";
        }

        userRepository.save(user);

        return "Your account has been created successfully!";
    }

    public String loginUser(User user) {

        Optional<User> existingUser
                = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {

            User dbUser = existingUser.get();

            if (dbUser.getPassword().equals(user.getPassword())) {

                return "Login Successful";

            }

        }

        return "Invalid Email or Password";
    }

}
