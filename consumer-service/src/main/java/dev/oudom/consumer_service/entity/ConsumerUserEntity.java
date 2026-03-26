package dev.oudom.consumer_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "consumer_users")
public class ConsumerUserEntity {

    @Id
    @Column(nullable = false, updatable = false, length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 64)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 512)
    private String passwordHash;

    @Column(name = "api_key", nullable = false, unique = true, length = 128)
    private String apiKey;

    @Column(nullable = false, length = 16)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected ConsumerUserEntity() {
    }

    public ConsumerUserEntity(
        String username,
        String passwordHash,
        String apiKey,
        String status
    ) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.apiKey = apiKey;
        this.status = status;
    }

    @PrePersist
    void prePersist() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
