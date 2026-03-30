package dev.oudom.consumer_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "api_key_credentials")
@Getter
@NoArgsConstructor
public class ApiKeyCredentialEntity {

    @Id
    @Column(name = "consumer_id", nullable = false, updatable = false, length = 36)
    private String consumerId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "consumer_id", nullable = false)
    private ConsumerEntity consumer;

    @Column(name = "api_key", nullable = false, unique = true, length = 128)
    private String apiKey;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ApiKeyCredentialEntity(ConsumerEntity consumer, String apiKey) {
        this.consumer = consumer;
        this.apiKey = apiKey;
    }

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
