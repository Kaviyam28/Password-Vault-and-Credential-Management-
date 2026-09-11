package com.kaviya.securevault.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaviya.securevault.dto.ShareCredentialRequest;
import com.kaviya.securevault.entity.Notification;
import com.kaviya.securevault.entity.PasswordEntry;
import com.kaviya.securevault.entity.SharedCredential;
import com.kaviya.securevault.entity.User;
import com.kaviya.securevault.repository.PasswordRepository;
import com.kaviya.securevault.repository.SharedCredentialRepository;
import com.kaviya.securevault.repository.UserRepository;
import com.kaviya.securevault.util.EncryptionUtil;

@Service
public class SharingService {

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private SharedCredentialRepository sharedCredentialRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    // ==========================================
    // SHARE CREDENTIAL
    // ==========================================
    public SharedCredential shareCredential(
            ShareCredentialRequest request) {

        if (request == null) {
            throw new RuntimeException(
                    "Request cannot be null");
        }

        String senderEmail = request.getSenderEmail();
        String receiverEmail = request.getReceiverEmail();

        if (senderEmail == null
                || senderEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Sender email is required");
        }

        if (receiverEmail == null
                || receiverEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Receiver email is required");
        }

        senderEmail = senderEmail.trim();
        receiverEmail = receiverEmail.trim();

        // Prevent sharing with yourself
        if (senderEmail.equalsIgnoreCase(receiverEmail)) {

            throw new RuntimeException(
                    "You cannot share a credential with yourself");
        }

        // Check sender exists
        if (!userRepository.existsByEmail(senderEmail)) {

            throw new RuntimeException(
                    "Sender user does not exist");
        }

        // Check receiver exists
        if (!userRepository.existsByEmail(receiverEmail)) {

            throw new RuntimeException(
                    "Receiver user does not exist");
        }

        // Check credential ID
        if (request.getCredentialId() == null) {

            throw new RuntimeException(
                    "Credential ID is required");
        }

        // Find credential
        PasswordEntry credential
                = passwordRepository
                        .findById(request.getCredentialId())
                        .orElseThrow(()
                                -> new RuntimeException(
                                "Credential not found"));

        // Check ownership
        if (credential.getUserEmail() == null
                || !credential.getUserEmail()
                        .equalsIgnoreCase(senderEmail)) {

            throw new RuntimeException(
                    "You can only share your own credentials");
        }

        // ==========================================
        // CHECK DUPLICATE SHARING
        // ==========================================
        List<SharedCredential> existingShares
                = sharedCredentialRepository
                        .findByRecipientEmail(receiverEmail);

        for (SharedCredential existing : existingShares) {

            if (existing.getCredentialId()
                    .equals(credential.getId())
                    && existing.isActive()) {

                // If no expiry, it is permanently active
                if (existing.getExpiresAt() == null) {

                    throw new RuntimeException(
                            "Credential is already shared with this user");
                }

                // If expiry is still in future
                if (existing.getExpiresAt()
                        .isAfter(LocalDateTime.now())) {

                    throw new RuntimeException(
                            "Credential is already shared with this user");
                }

                // Expired sharing → deactivate it
                existing.setActive(false);

                sharedCredentialRepository.save(existing);
            }
        }

        // ==========================================
        // EXPIRY DATE
        // ==========================================
        LocalDateTime expiresAt;

        if (request.getExpiryDate() == null
                || request.getExpiryDate()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Expiry date is required");
        }

        String expiry
                = request.getExpiryDate().trim();

        try {

            if (expiry.contains("T")) {

                expiresAt
                        = LocalDateTime.parse(
                                expiry,
                                DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            } else {

                LocalDate date;

                try {

                    date
                            = LocalDate.parse(
                                    expiry,
                                    DateTimeFormatter
                                            .ofPattern(
                                                    "yyyy-MM-dd"));

                } catch (Exception e) {

                    date
                            = LocalDate.parse(
                                    expiry,
                                    DateTimeFormatter
                                            .ofPattern(
                                                    "dd-MM-yyyy"));
                }

                expiresAt
                        = date.atTime(23, 59, 59);
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid expiry date format. Use yyyy-MM-dd");
        }

        // Check future date
        if (!expiresAt.isAfter(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Expiry date must be in the future");
        }

        // ==========================================
        // PERMISSION
        // ==========================================
        String permission
                = request.getPermission();

        if (permission == null
                || permission.trim().isEmpty()) {

            permission = "VIEW";
        }

        permission
                = permission.trim().toUpperCase();

        if (!permission.equals("VIEW")
                && !permission.equals("EDIT")
                && !permission.equals("FULL")) {

            throw new RuntimeException(
                    "Invalid permission. Use VIEW, EDIT or FULL");
        }

        // ==========================================
        // CREATE SHARE
        // ==========================================
        SharedCredential shared
                = new SharedCredential();

        shared.setCredentialId(
                credential.getId());

        shared.setOwnerEmail(
                senderEmail);

        shared.setRecipientEmail(
                receiverEmail);

        shared.setPermission(
                permission);

        shared.setExpiresAt(
                expiresAt);

        shared.setCreatedAt(
                LocalDateTime.now());

        shared.setActive(true);

        // Save sharing record first
        SharedCredential savedShared
                = sharedCredentialRepository.save(shared);

        // ==========================================
        // CREATE NOTIFICATION FOR RECEIVER
        // ==========================================
        User receiver
                = userRepository
                        .findByEmail(receiverEmail)
                        .orElseThrow(()
                                -> new RuntimeException(
                                "Receiver user not found while creating notification"));

        User sender
                = userRepository
                        .findByEmail(senderEmail)
                        .orElse(null);

        String senderName = senderEmail;

        if (sender != null
                && sender.getUserName() != null
                && !sender.getUserName()
                        .trim()
                        .isEmpty()) {

            senderName = sender.getUserName();
        }

        System.out.println(
                "Receiver ID: " + receiver.getId());

        System.out.println(
                "Creating sharing notification for: "
                + receiverEmail);

        Notification notification
                = notificationService.createNotification(
                        receiver.getId().toString(),
                        "CREDENTIAL_SHARED",
                        "Credential Shared With You",
                        "A credential has been securely shared with you by "
                        + senderName
                        + "."
                );

        // ==========================================
        // SEND SHARING EMAIL
        // ==========================================
        emailService.sendNotificationEmail(
                receiver.getEmail(),
                "Credential Shared With You",
                "A credential has been securely shared with you by "
                + senderName
                + "."
        );

        System.out.println(
                "Sharing notification saved with ID: "
                + notification.getId());

        return savedShared;
    }

    // ==========================================
    // GET RECEIVED CREDENTIALS
    // ==========================================
    public List<SharedCredential> getReceivedCredentials(
            String email) {

        if (email == null
                || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required");
        }

        email = email.trim();

        if (!userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "User does not exist");
        }

        List<SharedCredential> shares
                = sharedCredentialRepository
                        .findByRecipientEmail(email);

        LocalDateTime now
                = LocalDateTime.now();

        for (SharedCredential share : shares) {

            if (share.getExpiresAt() != null
                    && share.getExpiresAt().isBefore(now)
                    && share.isActive()) {

                share.setActive(false);

                sharedCredentialRepository.save(share);
            }
        }

        return shares;
    }

    // ==========================================
    // GET SENT CREDENTIALS
    // ==========================================
    public List<SharedCredential> getSentCredentials(
            String email) {

        if (email == null
                || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required");
        }

        email = email.trim();

        if (!userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "User does not exist");
        }

        List<SharedCredential> shares
                = sharedCredentialRepository
                        .findByOwnerEmail(email);

        LocalDateTime now
                = LocalDateTime.now();

        for (SharedCredential share : shares) {

            if (share.getExpiresAt() != null
                    && share.getExpiresAt().isBefore(now)
                    && share.isActive()) {

                share.setActive(false);

                sharedCredentialRepository.save(share);
            }
        }

        return shares;
    }

    // ==========================================
    // REVOKE SHARING
    // ==========================================
    public void revokeSharing(Long sharingId) {

        if (sharingId == null) {

            throw new RuntimeException(
                    "Sharing ID is required");
        }

        SharedCredential shared
                = sharedCredentialRepository
                        .findById(sharingId)
                        .orElseThrow(()
                                -> new RuntimeException(
                                "Sharing record not found"));

        shared.setActive(false);

        sharedCredentialRepository.save(shared);
    }

    // ==========================================
    // GET SHARED CREDENTIAL
    // ==========================================
    public Map<String, Object> getSharedCredential(
            Long sharingId) {

        if (sharingId == null) {

            throw new RuntimeException(
                    "Sharing ID is required");
        }

        SharedCredential shared
                = sharedCredentialRepository
                        .findById(sharingId)
                        .orElseThrow(()
                                -> new RuntimeException(
                                "Sharing record not found"));

        // Check active
        if (!shared.isActive()) {

            throw new RuntimeException(
                    "This shared credential is no longer active");
        }

        // Check expiry
        if (shared.getExpiresAt() != null
                && shared.getExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            shared.setActive(false);

            sharedCredentialRepository.save(shared);

            throw new RuntimeException(
                    "This shared credential has expired");
        }

        // Get original credential
        PasswordEntry credential
                = passwordRepository
                        .findById(
                                shared.getCredentialId())
                        .orElseThrow(()
                                -> new RuntimeException(
                                "Original credential not found"));

        // Decrypt password
        String decryptedPassword
                = credential.getPassword();

        if (decryptedPassword != null
                && !decryptedPassword.isEmpty()) {

            try {

                decryptedPassword
                        = EncryptionUtil.decrypt(
                                decryptedPassword);

            } catch (Exception e) {

                throw new RuntimeException(
                        "Unable to decrypt password");
            }
        }

        // ==========================================
        // RETURN CREDENTIAL + SHARING DETAILS
        // ==========================================
        Map<String, Object> response
                = new HashMap<>();

        response.put(
                "id",
                credential.getId());

        response.put(
                "website",
                credential.getWebsite());

        response.put(
                "username",
                credential.getUsername());

        response.put(
                "password",
                decryptedPassword);

        response.put(
                "notes",
                credential.getNotes());

        // Sharing information
        response.put(
                "sharingId",
                shared.getId());

        response.put(
                "permission",
                shared.getPermission());

        response.put(
                "senderEmail",
                shared.getOwnerEmail());

        response.put(
                "receiverEmail",
                shared.getRecipientEmail());

        response.put(
                "expiresAt",
                shared.getExpiresAt());

        response.put(
                "active",
                shared.isActive());

        return response;
    }

    // ==========================================
    // UPDATE SHARED CREDENTIAL
    // ==========================================
    public PasswordEntry updateSharedCredential(
            Long sharingId,
            PasswordEntry updatedEntry,
            String recipientEmail) {

        // Check sharing ID
        if (sharingId == null) {

            throw new RuntimeException(
                    "Sharing ID is required");
        }

        // Check recipient email
        if (recipientEmail == null
                || recipientEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Recipient email is required");
        }

        recipientEmail
                = recipientEmail.trim();

        // Find sharing record
        SharedCredential shared
                = sharedCredentialRepository
                        .findById(sharingId)
                        .orElseThrow(()
                                -> new RuntimeException(
                                "Sharing record not found"));

        // ==========================================
        // CHECK RECIPIENT
        // ==========================================
        if (shared.getRecipientEmail() == null
                || !shared.getRecipientEmail()
                        .equalsIgnoreCase(
                                recipientEmail)) {

            throw new RuntimeException(
                    "You are not authorized to edit this credential");
        }

        // ==========================================
        // CHECK ACTIVE
        // ==========================================
        if (!shared.isActive()) {

            throw new RuntimeException(
                    "This shared credential is no longer active");
        }

        // ==========================================
        // CHECK EXPIRY
        // ==========================================
        if (shared.getExpiresAt() != null
                && shared.getExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            shared.setActive(false);

            sharedCredentialRepository.save(shared);

            throw new RuntimeException(
                    "This shared credential has expired");
        }

        // ==========================================
        // CHECK PERMISSION
        // ==========================================
        String permission
                = shared.getPermission();

        if (!"EDIT".equalsIgnoreCase(permission)
                && !"FULL".equalsIgnoreCase(permission)) {

            throw new RuntimeException(
                    "You only have view permission");
        }

        // ==========================================
        // VALIDATE UPDATED DATA
        // ==========================================
        if (updatedEntry == null) {

            throw new RuntimeException(
                    "Credential data is required");
        }

        if (updatedEntry.getWebsite() == null
                || updatedEntry.getWebsite()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Website cannot be empty");
        }

        if (updatedEntry.getUsername() == null
                || updatedEntry.getUsername()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Username cannot be empty");
        }

        // ==========================================
        // GET ORIGINAL CREDENTIAL
        // ==========================================
        PasswordEntry existing
                = passwordRepository
                        .findById(
                                shared.getCredentialId())
                        .orElseThrow(()
                                -> new RuntimeException(
                                "Original credential not found"));

        // Keep original owner
        updatedEntry.setUserEmail(
                existing.getUserEmail());

        // ==========================================
        // UPDATE
        // ==========================================
        return passwordService.updatePassword(
                existing.getId(),
                updatedEntry);
    }
}
