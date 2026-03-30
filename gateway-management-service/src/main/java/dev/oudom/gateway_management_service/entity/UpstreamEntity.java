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

@Entity
@Table(name = "upstreams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpstreamEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private String upstreamId;

    @Column(nullable = false)
    private String gatewayId;

    @Column(nullable = false)
    private String serviceId;

    @Column(nullable = false)
    private String upstreamName;

    @Column(nullable = false)
    private String algorithm;

    @Column(nullable = false)
    private String ownerUserUuid;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
