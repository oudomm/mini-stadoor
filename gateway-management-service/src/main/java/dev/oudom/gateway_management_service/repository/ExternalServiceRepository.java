package dev.oudom.gateway_management_service.repository;

import dev.oudom.gateway_management_service.entity.ExternalServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExternalServiceRepository extends JpaRepository<ExternalServiceEntity, String> {

    List<ExternalServiceEntity> findAllByGatewayId(String gatewayId);

    List<ExternalServiceEntity> findAllByGatewayIdAndOwnerUserUuidOrderByServiceNameAsc(String gatewayId, String ownerUserUuid);

    List<ExternalServiceEntity> findAllByOwnerUserUuidOrderByServiceNameAsc(String ownerUserUuid);

    boolean existsByGatewayIdAndServiceId(String gatewayId, String serviceId);

    boolean existsByGatewayIdAndServiceIdAndOwnerUserUuid(String gatewayId, String serviceId, String ownerUserUuid);
}
