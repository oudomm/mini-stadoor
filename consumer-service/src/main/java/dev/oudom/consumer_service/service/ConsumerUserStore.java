package dev.oudom.consumer_service.service;

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

@Service
public class ConsumerUserStore {

    private static final String ACTIVE = "ACTIVE";

    private final ConsumerUserRepository consumerUserRepository;
    private final PasswordHashingService passwordHashingService;
    private final String seedUsername;
    private final String seedPassword;
    private final String seedApiKey;

    public ConsumerUserStore(
        ConsumerUserRepository consumerUserRepository,
        PasswordHashingService passwordHashingService,
        @Value("${consumer.security.basic.username}") String seedUsername,
        @Value("${consumer.security.basic.password}") String seedPassword,
        @Value("${consumer.security.api-key.value}") String seedApiKey
    ) {
        this.consumerUserRepository = consumerUserRepository;
        this.passwordHashingService = passwordHashingService;
        this.seedUsername = normalizeUsername(seedUsername);
        this.seedPassword = seedPassword;
        this.seedApiKey = seedApiKey.trim();
    }

    @org.springframework.context.event.EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initializeSeedUser() {
        if (consumerUserRepository.existsByUsername(seedUsername)) {
            return;
        }

        consumerUserRepository.save(new ConsumerUserEntity(
            seedUsername,
            passwordHashingService.hash(seedPassword),
            seedApiKey,
            ACTIVE
        ));
    }

    public Mono<String> authenticate(String username, String password) {
        return Mono.fromCallable(() -> {
                ConsumerUserEntity user = consumerUserRepository.findByUsernameAndStatus(normalizeUsername(username), ACTIVE)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication credentials"));

                if (!passwordHashingService.matches(password, user.getPasswordHash())) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication credentials");
                }

                return user.getUsername();
            })
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<String> findPrincipalByApiKey(String apiKey) {
        return Mono.fromCallable(() -> consumerUserRepository.findByApiKeyAndStatus(normalizeApiKey(apiKey), ACTIVE)
                .map(ConsumerUserEntity::getUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key")))
            .onErrorMap(IllegalArgumentException.class, exception -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key"))
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Mono<UserRegistrationResponse> register(UserRegistrationRequest request) {
        return Mono.fromCallable(() -> registerBlocking(request))
            .subscribeOn(Schedulers.boundedElastic());
    }

    @Transactional
    protected UserRegistrationResponse registerBlocking(UserRegistrationRequest request) {
        String normalizedUsername = normalizeUsername(request.username());
        if (consumerUserRepository.existsByUsername(normalizedUsername)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        String generatedApiKey = generateApiKey();
        ConsumerUserEntity savedUser = consumerUserRepository.save(new ConsumerUserEntity(
            normalizedUsername,
            passwordHashingService.hash(request.password()),
            generatedApiKey,
            ACTIVE
        ));

        return new UserRegistrationResponse(savedUser.getUsername(), savedUser.getApiKey());
    }

    private String generateApiKey() {
        return "stadoor_" + UUID.randomUUID().toString().replace("-", "");
    }

    private String normalizeUsername(String username) {
        return username == null ? "" : username.trim();
    }

    private String normalizeApiKey(String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing API key");
        }
        return apiKey.trim();
    }
}
