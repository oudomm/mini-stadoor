package dev.oudom.gateway_management_service.repository;

import dev.oudom.gateway_management_service.entity.UpstreamEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UpstreamRepository extends JpaRepository<UpstreamEntity, String> {

    Optional<UpstreamEntity> findByGatewayIdAndServiceIdAndOwnerUserUuid(String gatewayId, String serviceId, String ownerUserUuid);

    List<UpstreamEntity> findAllByGatewayIdAndOwnerUserUuid(String gatewayId, String ownerUserUuid);
}
