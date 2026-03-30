package dev.oudom.gateway_management_service.entity;

import dev.oudom.gateway_management_service.dto.GatewayWorkspaceType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "gateway_workspaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GatewayWorkspaceEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private String workspaceId;

    @Column(nullable = false)
    private String workspaceName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GatewayWorkspaceType type;

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
