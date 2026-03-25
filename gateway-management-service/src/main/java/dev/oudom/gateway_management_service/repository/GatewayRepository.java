package dev.oudom.gateway_management_service.repository;

import dev.oudom.gateway_management_service.entity.GatewayEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GatewayRepository extends JpaRepository<GatewayEntity, String> {
}
