package dev.oudom.consumer_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "consumers",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_consumer_gateway_name",
            columnNames = {"gateway_id", "consumer_name"}
        )
    }
)
@Getter
@NoArgsConstructor
public class ConsumerEntity {

    @Id
    @Column(nullable = false, updatable = false, length = 36)
    private String id;

    @Column(name = "gateway_id", nullable = false, length = 128)
    private String gatewayId;

    @Column(name = "owner_user_uuid", nullable = false, length = 128)
    private String ownerUserUuid;

    @Column(name = "consumer_name", nullable = false, length = 128)
    private String consumerName;

    @Column(nullable = false, length = 16)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ConsumerEntity(String gatewayId, String ownerUserUuid, String consumerName, String status) {
        this.gatewayId = gatewayId;
        this.ownerUserUuid = ownerUserUuid;
        this.consumerName = consumerName;
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
}
