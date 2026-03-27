package dev.oudom.consumer_service.repository;

import dev.oudom.consumer_service.entity.ConsumerUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ConsumerUserRepository extends JpaRepository<ConsumerUserEntity, String> {

    Optional<ConsumerUserEntity> findByUsernameAndStatus(String username, String status);

    Optional<ConsumerUserEntity> findByApiKeyAndStatus(String apiKey, String status);

    boolean existsByUsername(String username);

    List<ConsumerUserEntity> findAllByOrderByCreatedAtDesc();
}
