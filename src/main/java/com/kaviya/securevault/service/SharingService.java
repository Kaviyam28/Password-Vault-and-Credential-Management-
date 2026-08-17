package com.kaviya.securevault.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kaviya.securevault.dto.ShareCredentialRequest;
import com.kaviya.securevault.entity.PasswordEntry;
import com.kaviya.securevault.entity.SharedCredential;
import com.kaviya.securevault.repository.PasswordRepository;
import com.kaviya.securevault.repository.SharedCredentialRepository;
import com.kaviya.securevault.repository.UserRepository;

@Service
public class SharingService {

    @Autowired
    private SharedCredentialRepository sharedCredentialRepository;

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    // =========================================================
    // SHARE CREDENTIAL
    // =========================================================
    public SharedCredential shareCredential(
            ShareCredentialRequest request) {

        // 1. Check sender email
        if (request.getSenderEmail() == null
                || request.getSenderEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Sender email is required");
        }

        String senderEmail
                = request.getSenderEmail().trim();

        if (!userRepository.existsByEmail(senderEmail)) {

            throw new RuntimeException(
                    "Sender email is not registered");
        }

        // 2. Check receiver email
        if (request.getReceiverEmail() == null
                || request.getReceiverEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Receiver email is required");
        }

        String receiverEmail
                = request.getReceiverEmail().trim();

        if (!userRepository.existsByEmail(receiverEmail)) {

            throw new RuntimeException(
                    "Receiver email is not registered");
        }

        // 3. Prevent sharing with yourself
        if (senderEmail.equalsIgnoreCase(receiverEmail)) {

            throw new RuntimeException(
                    "You cannot share a credential with yourself");
        }

        // 4. Check credential ID
        if (request.getCredentialId() == null) {

            throw new RuntimeException(
                    "Credential ID is required");
        }

        // 5. Find credential
        PasswordEntry credential
                = passwordRepository
                        .findById(request.getCredentialId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Credential not found"));

        // 6. Make sure credential belongs to sender
        if (credential.getUserEmail() == null
                || !credential.getUserEmail()
                        .equalsIgnoreCase(senderEmail)) {

            throw new RuntimeException(
                    "You can only share your own credentials");
        }

        // 7. Prevent duplicate sharing
        if (sharedCredentialRepository
                .existsByCredentialIdAndRecipientEmail(
                        request.getCredentialId(),
                        receiverEmail)) {

            throw new RuntimeException(
                    "Credential is already shared with this user");
        }

        // =====================================================
        // 8. EXPIRY DATE
        // =====================================================
        LocalDateTime expiryDate = null;

        String expiryValue
                = request.getExpiryDate();

        if (expiryValue != null
                && !expiryValue.trim().isEmpty()) {

            expiryValue = expiryValue.trim();

            System.out.println(
                    "====================================");

            System.out.println(
                    "Received expiry date: ["
                    + expiryValue
                    + "]");

            try {

                /*
                 * Format 1:
                 * yyyy-MM-dd
                 *
                 * Example:
                 * 2026-08-17
                 */
                if (expiryValue.matches(
                        "\\d{4}-\\d{2}-\\d{2}")) {

                    LocalDate date
                            = LocalDate.parse(
                                    expiryValue);

                    expiryDate
                            = date.atTime(
                                    23,
                                    59,
                                    59);

                } /*
                 * Format 2:
                 * dd-MM-yyyy
                 *
                 * Example:
                 * 17-08-2026
                 */ else if (expiryValue.matches(
                        "\\d{2}-\\d{2}-\\d{4}")) {

                    DateTimeFormatter formatter
                            = DateTimeFormatter.ofPattern(
                                    "dd-MM-yyyy");

                    LocalDate date
                            = LocalDate.parse(
                                    expiryValue,
                                    formatter);

                    expiryDate
                            = date.atTime(
                                    23,
                                    59,
                                    59);
                } /*
                 * Format 3:
                 * yyyy-MM-ddTHH:mm:ss
                 *
                 * Example:
                 * 2026-08-17T23:59:59
                 */ else if (expiryValue.matches(
                        "\\d{4}-\\d{2}-\\d{2}T.*")) {

                    expiryDate
                            = LocalDateTime.parse(
                                    expiryValue);
                } else {

                    throw new RuntimeException(
                            "Unsupported date format");
                }

                System.out.println(
                        "Converted expiry date: ["
                        + expiryDate
                        + "]");

                System.out.println(
                        "====================================");

            } catch (Exception e) {

                System.out.println(
                        "Expiry date conversion failed");

                e.printStackTrace();

                throw new RuntimeException(
                        "Invalid expiry date: "
                        + expiryValue);
            }
        }

        // 9. Check expiry date
        if (expiryDate != null
                && expiryDate.isBefore(
                        LocalDateTime.now())) {

            throw new RuntimeException(
                    "Expiry date must be in the future");
        }

        // =====================================================
        // 10. PERMISSION
        // =====================================================
        String permission
                = request.getPermission();

        if (permission == null
                || permission.trim().isEmpty()) {

            permission = "VIEW";

        } else {

            permission
                    = permission
                            .trim()
                            .toUpperCase();
        }

        if (!permission.equals("VIEW")
                && !permission.equals("EDIT")
                && !permission.equals("FULL")) {

            throw new RuntimeException(
                    "Invalid permission. Use VIEW, EDIT, or FULL");
        }

        // =====================================================
        // 11. CREATE SHARING RECORD
        // =====================================================
        SharedCredential shared
                = new SharedCredential();

        shared.setCredentialId(
                request.getCredentialId());

        shared.setOwnerEmail(
                senderEmail);

        shared.setRecipientEmail(
                receiverEmail);

        shared.setPermission(
                permission);

        shared.setExpiresAt(
                expiryDate);

        shared.setCreatedAt(
                LocalDateTime.now());

        shared.setActive(true);

        // =====================================================
        // 12. SAVE
        // =====================================================
        return sharedCredentialRepository.save(
                shared);
    }

    // =========================================================
    // GET RECEIVED CREDENTIALS
    // =========================================================
    public List<SharedCredential> getReceivedCredentials(
            String recipientEmail) {

        if (recipientEmail == null
                || recipientEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Recipient email is required");
        }

        recipientEmail
                = recipientEmail.trim();

        if (!userRepository.existsByEmail(
                recipientEmail)) {

            throw new RuntimeException(
                    "User is not registered");
        }

        List<SharedCredential> shared
                = sharedCredentialRepository
                        .findByRecipientEmail(
                                recipientEmail);

        // Automatically deactivate expired credentials
        for (SharedCredential item : shared) {

            if (item.getExpiresAt() != null
                    && item.getExpiresAt()
                            .isBefore(
                                    LocalDateTime.now())) {

                if (item.isActive()) {

                    item.setActive(false);

                    sharedCredentialRepository.save(
                            item);
                }
            }
        }

        return shared;
    }

    // =========================================================
    // GET SENT CREDENTIALS
    // =========================================================
    public List<SharedCredential> getSentCredentials(
            String ownerEmail) {

        if (ownerEmail == null
                || ownerEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Owner email is required");
        }

        ownerEmail
                = ownerEmail.trim();

        if (!userRepository.existsByEmail(
                ownerEmail)) {

            throw new RuntimeException(
                    "User is not registered");
        }

        return sharedCredentialRepository
                .findByOwnerEmail(
                        ownerEmail);
    }

    // =========================================================
    // REVOKE SHARING
    // =========================================================
    public void revokeSharing(Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Sharing ID is required");
        }

        SharedCredential shared
                = sharedCredentialRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Shared credential not found"));

        shared.setActive(false);

        sharedCredentialRepository.save(
                shared);
    }

    // =========================================================
    // GET SHARED CREDENTIAL
    // =========================================================
    public PasswordEntry getSharedCredential(
            Long sharingId) {

        if (sharingId == null) {

            throw new RuntimeException(
                    "Sharing ID is required");
        }

        SharedCredential shared
                = sharedCredentialRepository
                        .findById(sharingId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Shared credential not found"));

        // Check whether sharing is active
        if (!shared.isActive()) {

            throw new RuntimeException(
                    "This credential sharing is inactive");
        }

        // Check expiry
        if (shared.getExpiresAt() != null
                && shared.getExpiresAt()
                        .isBefore(
                                LocalDateTime.now())) {

            shared.setActive(false);

            sharedCredentialRepository.save(
                    shared);

            throw new RuntimeException(
                    "This credential sharing has expired");
        }

        // Find actual credential
        return passwordRepository
                .findById(
                        shared.getCredentialId())
                .map(credential -> {

                    /*
                     * Passwords stored in the database are
                     * encrypted.
                     *
                     * We need to return the decrypted value
                     * to the frontend.
                     */
                    credential.setPassword(
                            com.kaviya.securevault.util.EncryptionUtil
                                    .decrypt(
                                            credential.getPassword()));

                    return credential;

                })
                .orElseThrow(
                        () -> new RuntimeException(
                                "Credential not found"));
    }

    // =========================================================
    // UPDATE SHARED CREDENTIAL
    // =========================================================
    public PasswordEntry updateSharedCredential(
            Long sharingId,
            PasswordEntry updatedEntry,
            String recipientEmail) {

        // 1. Check sharing ID
        if (sharingId == null) {

            throw new RuntimeException(
                    "Sharing ID is required");
        }

        // 2. Check recipient email
        if (recipientEmail == null
                || recipientEmail.trim().isEmpty()) {

            throw new RuntimeException(
                    "Recipient email is required");
        }

        recipientEmail
                = recipientEmail.trim();

        // 3. Find sharing record
        SharedCredential shared
                = sharedCredentialRepository
                        .findById(sharingId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Shared credential not found"));

        // 4. Make sure logged-in user is recipient
        if (shared.getRecipientEmail() == null
                || !shared.getRecipientEmail()
                        .equalsIgnoreCase(
                                recipientEmail)) {

            throw new RuntimeException(
                    "You are not authorized to edit this credential");
        }

        // 5. Check active status
        if (!shared.isActive()) {

            throw new RuntimeException(
                    "This credential sharing is inactive");
        }

        // 6. Check expiry
        if (shared.getExpiresAt() != null
                && shared.getExpiresAt()
                        .isBefore(
                                LocalDateTime.now())) {

            shared.setActive(false);

            sharedCredentialRepository.save(
                    shared);

            throw new RuntimeException(
                    "This credential sharing has expired");
        }

        // 7. Check permission
        String permission
                = shared.getPermission();

        if (!"EDIT".equalsIgnoreCase(permission)
                && !"FULL".equalsIgnoreCase(permission)) {

            throw new RuntimeException(
                    "You only have view permission");
        }

        // 8. Check updated credential
        if (updatedEntry == null) {

            throw new RuntimeException(
                    "Credential details are required");
        }

        // 9. Find original credential
        PasswordEntry existing
                = passwordRepository
                        .findById(
                                shared.getCredentialId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Credential not found"));

        // 10. Keep ownership unchanged
        updatedEntry.setUserEmail(
                existing.getUserEmail());

        // 11. Update using PasswordService
        /*
         * PasswordService.updatePassword()
         * encrypts the password before saving.
         */
        return passwordService.updatePassword(
                existing.getId(),
                updatedEntry);
    }
}
