package com.kaviya.securevault.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaviya.securevault.dto.ShareCredentialRequest;
import com.kaviya.securevault.entity.PasswordEntry;
import com.kaviya.securevault.entity.SharedCredential;
import com.kaviya.securevault.service.SharingService;

@RestController
@RequestMapping("/api/sharing")
@CrossOrigin(
        origins = {
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            "http://localhost:5177",
            "http://localhost:5178",
            "http://localhost:5179"
        }
)
public class SharingController {

    @Autowired
    private SharingService sharingService;

    // =====================================================
    // SHARE CREDENTIAL
    // =====================================================
    @PostMapping("/share")
    public ResponseEntity<?> shareCredential(
            @RequestBody ShareCredentialRequest request) {

        try {

            SharedCredential shared
                    = sharingService.shareCredential(request);

            return ResponseEntity.ok(shared);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // GET RECEIVED CREDENTIALS
    // =====================================================
    @GetMapping("/received/{email}")
    public ResponseEntity<List<SharedCredential>>
            getReceivedCredentials(
                    @PathVariable String email) {

        return ResponseEntity.ok(
                sharingService.getReceivedCredentials(email)
        );
    }

    // =====================================================
    // GET SENT CREDENTIALS
    // =====================================================
    @GetMapping("/sent/{email}")
    public ResponseEntity<List<SharedCredential>>
            getSentCredentials(
                    @PathVariable String email) {

        return ResponseEntity.ok(
                sharingService.getSentCredentials(email)
        );
    }

    // =====================================================
    // REVOKE SHARING
    // =====================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> revokeSharing(
            @PathVariable Long id) {

        try {

            sharingService.revokeSharing(id);

            return ResponseEntity.ok(
                    "Credential sharing revoked successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // VIEW SHARED CREDENTIAL
    // =====================================================
    @GetMapping("/credential/{sharingId}")
    public ResponseEntity<?> getSharedCredential(
            @PathVariable Long sharingId) {

        try {

            PasswordEntry credential
                    = sharingService.getSharedCredential(
                            sharingId);

            return ResponseEntity.ok(credential);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // EDIT SHARED CREDENTIAL
    // =====================================================
    @PutMapping("/credential/{sharingId}")
    public ResponseEntity<?> updateSharedCredential(
            @PathVariable Long sharingId,
            @RequestBody PasswordEntry passwordEntry) {

        try {

            String recipientEmail
                    = passwordEntry.getUserEmail();

            PasswordEntry updated
                    = sharingService.updateSharedCredential(
                            sharingId,
                            passwordEntry,
                            recipientEmail);

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}
