package dev.oudom.consumer_service.repository;

import dev.oudom.consumer_service.entity.BasicAuthCredentialEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BasicAuthCredentialRepository extends JpaRepository<BasicAuthCredentialEntity, String> {

    Optional<BasicAuthCredentialEntity> findByUsernameAndConsumer_GatewayIdAndConsumer_Status(
        String username,
        String gatewayId,
        String status
    );

    boolean existsByUsernameAndConsumer_GatewayId(String username, String gatewayId);

    Optional<BasicAuthCredentialEntity> findByConsumerId(String consumerId);
}
