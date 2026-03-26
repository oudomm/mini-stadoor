package dev.oudom.gateway_management_service.repository;

import dev.oudom.gateway_management_service.entity.RouteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteRepository extends JpaRepository<RouteEntity, String> {

    List<RouteEntity> findAllByGatewayIdAndServiceId(String gatewayId, String serviceId);

    List<RouteEntity> findAllByGatewayIdAndServiceIdAndOwnerUserUuidOrderByIdAsc(
        String gatewayId,
        String serviceId,
        String ownerUserUuid
    );

    List<RouteEntity> findAllByOwnerUserUuidOrderByIdAsc(String ownerUserUuid);
}
