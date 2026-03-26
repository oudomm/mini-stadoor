package dev.oudom.gateway_management_service.repository;

import dev.oudom.gateway_management_service.entity.GatewayEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GatewayRepository extends JpaRepository<GatewayEntity, String> {

    List<GatewayEntity> findAllByOwnerUserUuidOrderByGatewayNameAsc(String ownerUserUuid);

    boolean existsByGatewayIdAndOwnerUserUuid(String gatewayId, String ownerUserUuid);

    Optional<GatewayEntity> findByGatewayIdAndOwnerUserUuid(String gatewayId, String ownerUserUuid);
}
