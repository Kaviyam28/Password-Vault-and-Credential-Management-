package com.kaviya.securevault.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class EncryptionUtil {

    private static final String SECRET_KEY = "1234567890123456";

    public static String encrypt(String data) {

        try {

            SecretKeySpec key = new SecretKeySpec(
                    SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                    "AES");

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(Cipher.ENCRYPT_MODE, key);

            byte[] encrypted = cipher.doFinal(
                    data.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(encrypted);

        } catch (Exception e) {

            throw new RuntimeException("Encryption Failed", e);

        }

    }

    public static String decrypt(String encryptedData) {

        try {

            SecretKeySpec key = new SecretKeySpec(
                    SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                    "AES");

            Cipher cipher = Cipher.getInstance("AES");

            cipher.init(Cipher.DECRYPT_MODE, key);

            byte[] decrypted = cipher.doFinal(
                    Base64.getDecoder().decode(encryptedData));

            return new String(decrypted, StandardCharsets.UTF_8);

        } catch (Exception e) {

            throw new RuntimeException("Decryption Failed", e);

        }

    }

}