package com.kaviya.securevault.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaviya.securevault.entity.PasswordEntry;
import com.kaviya.securevault.repository.PasswordRepository;
import com.kaviya.securevault.util.EncryptionUtil;

@Service
public class PasswordService {

    @Autowired
    private PasswordRepository passwordRepository;

    // Save a new password
    public PasswordEntry savePassword(PasswordEntry passwordEntry) {

        passwordEntry.setPassword(
                EncryptionUtil.encrypt(passwordEntry.getPassword()));

        return passwordRepository.save(passwordEntry);
    }

    // Get all passwords of a user
    public List<PasswordEntry> getPasswordsByUser(String userEmail) {

        List<PasswordEntry> passwords
                = passwordRepository.findByUserEmail(userEmail);

        for (PasswordEntry password : passwords) {

            password.setPassword(
                    EncryptionUtil.decrypt(password.getPassword()));
        }

        return passwords;
    }

    // Update an existing password
    public PasswordEntry updatePassword(Long id,
            PasswordEntry updatedEntry) {

        PasswordEntry existing = passwordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Password not found"));

        existing.setWebsite(updatedEntry.getWebsite());
        existing.setUsername(updatedEntry.getUsername());

        existing.setPassword(
                EncryptionUtil.encrypt(updatedEntry.getPassword()));

        existing.setNotes(updatedEntry.getNotes());

        return passwordRepository.save(existing);
    }

    // Delete a password
    public void deletePassword(Long id) {
        passwordRepository.deleteById(id);
    }

}
