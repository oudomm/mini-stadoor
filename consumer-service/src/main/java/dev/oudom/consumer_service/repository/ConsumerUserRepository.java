package dev.oudom.consumer_service.repository;

import dev.oudom.consumer_service.entity.ConsumerUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ConsumerUserRepository extends JpaRepository<ConsumerUserEntity, String> {

    Optional<ConsumerUserEntity> findByGatewayIdAndUsernameAndStatus(String gatewayId, String username, String status);

    Optional<ConsumerUserEntity> findByGatewayIdAndApiKeyAndStatus(String gatewayId, String apiKey, String status);

    boolean existsByGatewayIdAndUsername(String gatewayId, String username);

    List<ConsumerUserEntity> findAllByGatewayIdOrderByCreatedAtDesc(String gatewayId);

    boolean existsByGatewayIdAndConsumerName(String gatewayId, String consumerName);
}
