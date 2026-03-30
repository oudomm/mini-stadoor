package dev.oudom.consumer_service.repository;

import dev.oudom.consumer_service.entity.ApiKeyCredentialEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApiKeyCredentialRepository extends JpaRepository<ApiKeyCredentialEntity, String> {

    Optional<ApiKeyCredentialEntity> findByApiKeyAndConsumer_GatewayIdAndConsumer_Status(
        String apiKey,
        String gatewayId,
        String status
    );

    Optional<ApiKeyCredentialEntity> findByConsumerId(String consumerId);
}
