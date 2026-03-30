package dev.oudom.consumer_service.repository;

import dev.oudom.consumer_service.entity.ConsumerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsumerRepository extends JpaRepository<ConsumerEntity, String> {

    List<ConsumerEntity> findAllByGatewayIdOrderByCreatedAtDesc(String gatewayId);

    boolean existsByGatewayIdAndConsumerName(String gatewayId, String consumerName);

    Optional<ConsumerEntity> findByIdAndGatewayIdAndStatus(String id, String gatewayId, String status);
}
