package dev.oudom.gateway_service.repository;

import dev.oudom.gateway_service.entity.ExternalServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExternalServiceRepository extends JpaRepository<ExternalServiceEntity, String> {
}
