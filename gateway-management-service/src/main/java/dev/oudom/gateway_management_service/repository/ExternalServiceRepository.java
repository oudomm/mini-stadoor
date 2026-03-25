package dev.oudom.gateway_management_service.repository;

import dev.oudom.gateway_management_service.entity.ExternalServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExternalServiceRepository extends JpaRepository<ExternalServiceEntity, String> {

    List<ExternalServiceEntity> findAllByGatewayId(String gatewayId);

    boolean existsByGatewayIdAndServiceId(String gatewayId, String serviceId);
}
