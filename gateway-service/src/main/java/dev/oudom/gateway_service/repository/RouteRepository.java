package dev.oudom.gateway_service.repository;

import dev.oudom.gateway_service.entity.RouteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<RouteEntity, String> {
}
