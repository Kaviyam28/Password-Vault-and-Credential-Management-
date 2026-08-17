package com.kaviya.securevault.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kaviya.securevault.entity.SharedCredential;

@Repository
public interface SharedCredentialRepository
        extends JpaRepository<SharedCredential, Long> {

    List<SharedCredential> findByRecipientEmail(String recipientEmail);

    List<SharedCredential> findByOwnerEmail(String ownerEmail);

    boolean existsByCredentialIdAndRecipientEmail(
            Long credentialId,
            String recipientEmail
    );
}
