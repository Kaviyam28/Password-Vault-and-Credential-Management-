package com.kaviya.securevault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaviya.securevault.entity.PasswordEntry;
import com.kaviya.securevault.service.PasswordService;

@RestController
@RequestMapping("/api/passwords")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
    "http://localhost:5179"
})
public class PasswordController {

    @Autowired
    private PasswordService passwordService;

    // Save Password
    @PostMapping
    public PasswordEntry savePassword(@RequestBody PasswordEntry passwordEntry) {
        return passwordService.savePassword(passwordEntry);
    }

    // Get All Passwords for a User
    @GetMapping("/{userEmail}")
    public List<PasswordEntry> getPasswords(@PathVariable String userEmail) {
        return passwordService.getPasswordsByUser(userEmail);
    }

    // Update Password
    @PutMapping("/{id}")
    public PasswordEntry updatePassword(@PathVariable Long id,
            @RequestBody PasswordEntry passwordEntry) {

        return passwordService.updatePassword(id, passwordEntry);
    }

    // Delete Password
    @DeleteMapping("/{id}")
    public String deletePassword(@PathVariable Long id) {

        passwordService.deletePassword(id);

        return "Password deleted successfully!";
    }
}
