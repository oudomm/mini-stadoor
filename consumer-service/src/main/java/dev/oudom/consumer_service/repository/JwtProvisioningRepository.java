package dev.oudom.consumer_service.repository;

import dev.oudom.consumer_service.entity.JwtProvisioningEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JwtProvisioningRepository extends JpaRepository<JwtProvisioningEntity, String> {

    Optional<JwtProvisioningEntity> findByConsumerId(String consumerId);
}
