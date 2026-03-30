package dev.oudom.gateway_management_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "targets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TargetEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private String targetId;

    @Column(nullable = false)
    private String upstreamId;

    @Column(nullable = false)
    private String host;

    @Column(nullable = false)
    private Integer port;

    @Column(nullable = false)
    private Integer weight;

    @Column(nullable = false)
    private String ownerUserUuid;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public TargetEntity(
        String upstreamId,
        String host,
        Integer port,
        Integer weight,
        String ownerUserUuid
    ) {
        this.upstreamId = upstreamId;
        this.host = host;
        this.port = port;
        this.weight = weight;
        this.ownerUserUuid = ownerUserUuid;
    }

    @PrePersist
    void prePersist() {
        if (targetId == null || targetId.isBlank()) {
            targetId = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
