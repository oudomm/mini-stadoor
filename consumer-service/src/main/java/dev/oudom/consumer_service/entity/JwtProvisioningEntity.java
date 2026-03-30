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
@Table(name = "jwt_provisioning")
@Getter
@NoArgsConstructor
public class JwtProvisioningEntity {

    @Id
    @Column(name = "consumer_id", nullable = false, updatable = false, length = 36)
    private String consumerId;

    @MapsId
    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "consumer_id", nullable = false)
    private ConsumerEntity consumer;

    @Column(nullable = false, length = 128)
    private String issuer;

    @Column(name = "access_token_expiration_seconds", nullable = false)
    private long accessTokenExpirationSeconds;

    @Column(name = "refresh_token_expiration_seconds", nullable = false)
    private long refreshTokenExpirationSeconds;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public JwtProvisioningEntity(
        ConsumerEntity consumer,
        String issuer,
        long accessTokenExpirationSeconds,
        long refreshTokenExpirationSeconds
    ) {
        this.consumer = consumer;
        this.issuer = issuer;
        this.accessTokenExpirationSeconds = accessTokenExpirationSeconds;
        this.refreshTokenExpirationSeconds = refreshTokenExpirationSeconds;
    }

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
