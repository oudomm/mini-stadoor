package dev.oudom.consumer_service.service;

import dev.oudom.consumer_service.dto.AuthValidationResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ApiKeyValidationService {

    private final ConsumerUserStore consumerUserStore;

    public ApiKeyValidationService(ConsumerUserStore consumerUserStore) {
        this.consumerUserStore = consumerUserStore;
    }

    public Mono<AuthValidationResponse> validate(String apiKey) {
        return consumerUserStore.findPrincipalByApiKey(apiKey)
            .map(principal -> new AuthValidationResponse(true, "API_KEY", principal));
    }
}
