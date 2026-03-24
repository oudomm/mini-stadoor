package dev.oudom.consumer_service.service;

import dev.oudom.consumer_service.dto.AuthValidationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
public class ApiKeyValidationService {

    private final String expectedApiKey;

    public ApiKeyValidationService(@Value("${consumer.security.api-key.value}") String expectedApiKey) {
        this.expectedApiKey = expectedApiKey;
    }

    public Mono<AuthValidationResponse> validate(String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing API key"));
        }

        if (!expectedApiKey.equals(apiKey)) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key"));
        }

        return Mono.just(new AuthValidationResponse(true, "API_KEY", "api-key-client"));
    }
}
