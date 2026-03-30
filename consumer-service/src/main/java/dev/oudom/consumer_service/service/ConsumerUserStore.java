package dev.oudom.consumer_service.service;

import dev.oudom.consumer_service.dto.ConsumerUserSummaryResponse;
import dev.oudom.consumer_service.dto.UserRegistrationRequest;
import dev.oudom.consumer_service.dto.UserRegistrationResponse;
import dev.oudom.consumer_service.entity.ApiKeyCredentialEntity;
import dev.oudom.consumer_service.entity.BasicAuthCredentialEntity;
import dev.oudom.consumer_service.entity.ConsumerEntity;
import dev.oudom.consumer_service.entity.JwtProvisioningEntity;
import dev.oudom.consumer_service.repository.ApiKeyCredentialRepository;
import dev.oudom.consumer_service.repository.BasicAuthCredentialRepository;
import dev.oudom.consumer_service.repository.ConsumerRepository;
import dev.oudom.consumer_service.repository.JwtProvisioningRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.UUID;

@Service
public class ConsumerUserStore {

    private static final String ACTIVE = "ACTIVE";
    private static final String PUBLIC_DEMO_OWNER = "public-demo-owner";

    private final ConsumerRepository consumerRepository;
    private final BasicAuthCredentialRepository basicAuthCredentialRepository;
    private final ApiKeyCredentialRepository apiKeyCredentialRepository;
    private final JwtProvisioningRepository jwtProvisioningRepository;
    private final PasswordHashingService passwordHashingService;
    private final String jwtIssuer;
    private final long accessTokenExpirationSeconds;
    private final long refreshTokenExpirationSeconds;

    public ConsumerUserStore(
        ConsumerRepository consumerRepository,
        BasicAuthCredentialRepository basicAuthCredentialRepository,
        ApiKeyCredentialRepository apiKeyCredentialRepository,
        JwtProvisioningRepository jwtProvisioningRepository,
        PasswordHashingService passwordHashingService,
        @Value("${consumer.security.jwt.issuer}") String jwtIssuer,
        @Value("${consumer.security.jwt.access-token-expiration-seconds}") long accessTokenExpirationSeconds,
        @Value("${consumer.security.jwt.refresh-token-expiration-seconds}") long refreshTokenExpirationSeconds
    ) {
        this.consumerRepository = consumerRepository;
        this.basicAuthCredentialRepository = basicAuthCredentialRepository;
        this.apiKeyCredentialRepository = apiKeyCredentialRepository;
        this.jwtProvisioningRepository = jwtProvisioningRepository;
        this.passwordHashingService = passwordHashingService;
        this.jwtIssuer = jwtIssuer;
        this.accessTokenExpirationSeconds = accessTokenExpirationSeconds;
        this.refreshTokenExpirationSeconds = refreshTokenExpirationSeconds;
    }

    public Mono<ConsumerAccessIdentity> authenticate(String gatewayId, String username, String password) {
        return Mono.fromCallable(() -> {
                BasicAuthCredentialEntity credential = basicAuthCredentialRepository
                    .findByUsernameAndConsumer_GatewayIdAndConsumer_Status(
                        normalizeUsername(username),
                        normalizeGatewayId(gatewayId),
                        ACTIVE
                    )
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication credentials"));

                if (!passwordHashingService.matches(password, credential.getPasswordHash())) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication credentials");
                }

                return toIdentity(credential.getConsumer(), credential.getUsername());
            })
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<ConsumerAccessIdentity> findByApiKey(String gatewayId, String apiKey) {
        return Mono.fromCallable(() -> apiKeyCredentialRepository
                .findByApiKeyAndConsumer_GatewayIdAndConsumer_Status(
                    normalizeApiKey(apiKey),
                    normalizeGatewayId(gatewayId),
                    ACTIVE
                )
                .map(credential -> toIdentity(
                    credential.getConsumer(),
                    resolveUsername(credential.getConsumerId(), credential.getConsumer().getConsumerName())
                ))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key")))
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<ConsumerAccessIdentity> findActiveConsumer(String gatewayId, String consumerId) {
        return Mono.fromCallable(() -> consumerRepository.findByIdAndGatewayIdAndStatus(
                    normalizeRequired(consumerId, "consumerId must not be blank"),
                    normalizeGatewayId(gatewayId),
                    ACTIVE
                )
                .map(consumer -> toIdentity(consumer, resolveUsername(consumer.getId(), consumer.getConsumerName())))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Consumer is not active for this gateway")))
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<JwtProvisioningEntity> findJwtProvisioning(String consumerId) {
        return Mono.fromCallable(() -> jwtProvisioningRepository.findByConsumerId(
                    normalizeRequired(consumerId, "consumerId must not be blank")
                )
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "JWT is not provisioned for this consumer")))
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<UserRegistrationResponse> register(String ownerUserUuid, UserRegistrationRequest request) {
        return Mono.fromCallable(() -> registerBlocking(ownerUserUuid, request))
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<List<ConsumerUserSummaryResponse>> findAllUsers(String gatewayId) {
        return Mono.fromCallable(() -> consumerRepository.findAllByGatewayIdOrderByCreatedAtDesc(
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
        if (normalizedUsername.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username must not be blank");
        }
        if (consumerRepository.existsByGatewayIdAndConsumerName(normalizedGatewayId, normalizedConsumerName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Consumer name already exists in this gateway");
        }
        if (basicAuthCredentialRepository.existsByUsernameAndConsumer_GatewayId(normalizedUsername, normalizedGatewayId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Consumer username already exists in this gateway");
        }

        String generatedApiKey = generateApiKey();
        ConsumerEntity savedConsumer = consumerRepository.save(new ConsumerEntity(
            normalizedGatewayId,
            normalizedOwnerUserUuid,
            normalizedConsumerName,
            ACTIVE
        ));
        basicAuthCredentialRepository.save(new BasicAuthCredentialEntity(
            savedConsumer,
            normalizedUsername,
            passwordHashingService.hash(request.password())
        ));
        apiKeyCredentialRepository.save(new ApiKeyCredentialEntity(savedConsumer, generatedApiKey));
        jwtProvisioningRepository.save(new JwtProvisioningEntity(
            savedConsumer,
            jwtIssuer,
            accessTokenExpirationSeconds,
            refreshTokenExpirationSeconds
        ));

        return new UserRegistrationResponse(
            savedConsumer.getId(),
            savedConsumer.getGatewayId(),
            savedConsumer.getConsumerName(),
            normalizedUsername,
            generatedApiKey
        );
    }

    private String generateApiKey() {
        return "stadoor_" + UUID.randomUUID().toString().replace("-", "");
    }

    private ConsumerUserSummaryResponse toSummary(ConsumerEntity consumer) {
        String username = resolveUsername(consumer.getId(), "Unavailable");
        String apiKey = apiKeyCredentialRepository.findByConsumerId(consumer.getId())
            .map(ApiKeyCredentialEntity::getApiKey)
            .orElse(null);

        return new ConsumerUserSummaryResponse(
            consumer.getId(),
            consumer.getGatewayId(),
            consumer.getConsumerName(),
            username,
            maskApiKey(apiKey),
            consumer.getStatus(),
            consumer.getCreatedAt()
        );
    }

    private ConsumerAccessIdentity toIdentity(ConsumerEntity consumer, String username) {
        return new ConsumerAccessIdentity(
            consumer.getId(),
            consumer.getGatewayId(),
            consumer.getConsumerName(),
            username
        );
    }

    private String resolveUsername(String consumerId, String fallback) {
        return basicAuthCredentialRepository.findByConsumerId(consumerId)
            .map(BasicAuthCredentialEntity::getUsername)
            .orElse(fallback);
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
