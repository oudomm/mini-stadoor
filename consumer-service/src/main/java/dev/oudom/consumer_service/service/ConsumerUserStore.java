package dev.oudom.consumer_service.service;

import dev.oudom.consumer_service.dto.ConsumerUserSummaryResponse;
import dev.oudom.consumer_service.dto.UserRegistrationRequest;
import dev.oudom.consumer_service.dto.UserRegistrationResponse;
import dev.oudom.consumer_service.entity.ConsumerUserEntity;
import dev.oudom.consumer_service.repository.ConsumerUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.UUID;
import java.util.List;

@Service
public class ConsumerUserStore {

    private static final String ACTIVE = "ACTIVE";
    private static final String PUBLIC_DEMO_OWNER = "public-demo-owner";

    private final ConsumerUserRepository consumerUserRepository;
    private final PasswordHashingService passwordHashingService;
    private final String seedGatewayId;
    private final String seedOwnerUserUuid;
    private final String seedConsumerName;
    private final String seedUsername;
    private final String seedPassword;
    private final String seedApiKey;

    public ConsumerUserStore(
        ConsumerUserRepository consumerUserRepository,
        PasswordHashingService passwordHashingService,
        @Value("${consumer.seed.gateway-id}") String seedGatewayId,
        @Value("${consumer.seed.owner-user-uuid}") String seedOwnerUserUuid,
        @Value("${consumer.seed.consumer-name}") String seedConsumerName,
        @Value("${consumer.security.basic.username}") String seedUsername,
        @Value("${consumer.security.basic.password}") String seedPassword,
        @Value("${consumer.security.api-key.value}") String seedApiKey
    ) {
        this.consumerUserRepository = consumerUserRepository;
        this.passwordHashingService = passwordHashingService;
        this.seedGatewayId = normalizeRequired(seedGatewayId, "Seed gatewayId must not be blank");
        this.seedOwnerUserUuid = normalizeRequired(seedOwnerUserUuid, "Seed owner user UUID must not be blank");
        this.seedConsumerName = normalizeRequired(seedConsumerName, "Seed consumer name must not be blank");
        this.seedUsername = normalizeUsername(seedUsername);
        this.seedPassword = seedPassword;
        this.seedApiKey = seedApiKey.trim();
    }

    @org.springframework.context.event.EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initializeSeedUser() {
        if (consumerUserRepository.existsByGatewayIdAndUsername(seedGatewayId, seedUsername)) {
            return;
        }

        consumerUserRepository.save(new ConsumerUserEntity(
            seedGatewayId,
            seedOwnerUserUuid,
            seedConsumerName,
            seedUsername,
            passwordHashingService.hash(seedPassword),
            seedApiKey,
            ACTIVE
        ));
    }

    public Mono<ConsumerUserEntity> authenticate(String gatewayId, String username, String password) {
        return Mono.fromCallable(() -> {
                ConsumerUserEntity user = consumerUserRepository.findByGatewayIdAndUsernameAndStatus(
                        normalizeGatewayId(gatewayId),
                        normalizeUsername(username),
                        ACTIVE
                    )
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication credentials"));

                if (!passwordHashingService.matches(password, user.getPasswordHash())) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication credentials");
                }

                return user;
            })
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<ConsumerUserEntity> findByApiKey(String gatewayId, String apiKey) {
        return Mono.fromCallable(() -> consumerUserRepository.findByGatewayIdAndApiKeyAndStatus(normalizeGatewayId(gatewayId), normalizeApiKey(apiKey), ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key")))
            .onErrorMap(IllegalArgumentException.class, exception -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key"))
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<UserRegistrationResponse> register(String ownerUserUuid, UserRegistrationRequest request) {
        return Mono.fromCallable(() -> registerBlocking(ownerUserUuid, request))
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<List<ConsumerUserSummaryResponse>> findAllUsers(String gatewayId) {
        return Mono.fromCallable(() -> consumerUserRepository.findAllByGatewayIdOrderByCreatedAtDesc(
                    normalizeGatewayId(gatewayId)
                ).stream()
                .map(this::toSummary)
                .toList())
            .subscribeOn(Schedulers.boundedElastic());
    }

    @Transactional
    protected UserRegistrationResponse registerBlocking(String ownerUserUuid, UserRegistrationRequest request) {
        String normalizedOwnerUserUuid = normalizeOwnerUserUuid(ownerUserUuid);
        String normalizedGatewayId = normalizeGatewayId(request.gatewayId());
        String normalizedConsumerName = normalizeConsumerName(request.consumerName());
        String normalizedUsername = normalizeUsername(request.username());
        if (consumerUserRepository.existsByGatewayIdAndUsername(normalizedGatewayId, normalizedUsername)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Consumer username already exists in this gateway");
        }

        String generatedApiKey = generateApiKey();
        ConsumerUserEntity savedUser = consumerUserRepository.save(new ConsumerUserEntity(
            normalizedGatewayId,
            normalizedOwnerUserUuid,
            normalizedConsumerName,
            normalizedUsername,
            passwordHashingService.hash(request.password()),
            generatedApiKey,
            ACTIVE
        ));

        return new UserRegistrationResponse(
            savedUser.getId(),
            savedUser.getGatewayId(),
            savedUser.getConsumerName(),
            savedUser.getUsername(),
            savedUser.getApiKey()
        );
    }

    private String generateApiKey() {
        return "stadoor_" + UUID.randomUUID().toString().replace("-", "");
    }

    private ConsumerUserSummaryResponse toSummary(ConsumerUserEntity user) {
        return new ConsumerUserSummaryResponse(
            user.getId(),
            user.getGatewayId(),
            user.getConsumerName(),
            user.getUsername(),
            maskApiKey(user.getApiKey()),
            user.getStatus(),
            user.getCreatedAt()
        );
    }

    private String maskApiKey(String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            return "Unavailable";
        }
        if (apiKey.length() <= 10) {
            return apiKey;
        }

        return apiKey.substring(0, 10) + "..." + apiKey.substring(apiKey.length() - 4);
    }

    private String normalizeUsername(String username) {
        return username == null ? "" : username.trim();
    }

    private String normalizeConsumerName(String consumerName) {
        return normalizeRequired(consumerName, "consumerName must not be blank");
    }

    private String normalizeGatewayId(String gatewayId) {
        return normalizeRequired(gatewayId, "gatewayId must not be blank");
    }

    private String normalizeOwnerUserUuid(String ownerUserUuid) {
        return ownerUserUuid == null || ownerUserUuid.isBlank() ? PUBLIC_DEMO_OWNER : ownerUserUuid.trim();
    }

    private String normalizeApiKey(String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing API key");
        }
        return apiKey.trim();
    }

    private String normalizeRequired(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }
}
