package dev.oudom.gateway_management_service.repository;

import dev.oudom.gateway_management_service.entity.TargetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TargetRepository extends JpaRepository<TargetEntity, String> {

    List<TargetEntity> findAllByUpstreamIdOrderByCreatedAtAsc(String upstreamId);

    void deleteAllByUpstreamId(String upstreamId);
}
