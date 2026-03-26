package dev.oudom.consumer_service.service;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class PasswordHashingService {

    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";
    private static final int ITERATIONS = 120_000;
    private static final int KEY_LENGTH = 256;
    private static final int SALT_BYTES = 16;

    private final SecureRandom secureRandom = new SecureRandom();

    public String hash(String rawPassword) {
        byte[] salt = new byte[SALT_BYTES];
        secureRandom.nextBytes(salt);
        byte[] hash = pbkdf2(rawPassword.toCharArray(), salt);
        return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hash);
    }

    public boolean matches(String rawPassword, String storedHash) {
        if (rawPassword == null || storedHash == null || storedHash.isBlank()) {
            return false;
        }

        String[] parts = storedHash.split(":", 2);
        if (parts.length != 2) {
            return false;
        }

        byte[] salt = Base64.getDecoder().decode(parts[0]);
        byte[] expectedHash = Base64.getDecoder().decode(parts[1]);
        byte[] actualHash = pbkdf2(rawPassword.toCharArray(), salt);

        if (expectedHash.length != actualHash.length) {
            return false;
        }

        int diff = 0;
        for (int i = 0; i < expectedHash.length; i++) {
            diff |= expectedHash[i] ^ actualHash[i];
        }
        return diff == 0;
    }

    private byte[] pbkdf2(char[] password, byte[] salt) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password, salt, ITERATIONS, KEY_LENGTH);
            SecretKeyFactory factory = SecretKeyFactory.getInstance(ALGORITHM);
            return factory.generateSecret(spec).getEncoded();
        }
        catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Could not hash password", exception);
        }
    }
}
