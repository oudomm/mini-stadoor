package dev.oudom.route_management_service.repository;

import dev.oudom.route_management_service.entity.ExternalServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExternalServiceRepository extends JpaRepository<ExternalServiceEntity, String> {
}
