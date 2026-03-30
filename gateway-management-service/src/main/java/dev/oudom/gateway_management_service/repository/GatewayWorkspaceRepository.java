package dev.oudom.gateway_management_service.repository;

import dev.oudom.gateway_management_service.dto.GatewayWorkspaceType;
import dev.oudom.gateway_management_service.entity.GatewayWorkspaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GatewayWorkspaceRepository extends JpaRepository<GatewayWorkspaceEntity, String> {

    Optional<GatewayWorkspaceEntity> findByOwnerUserUuidAndType(String ownerUserUuid, GatewayWorkspaceType type);
}
