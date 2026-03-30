package dev.oudom.consumer_service.service;

import dev.oudom.consumer_service.dto.AuthValidationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class BasicAuthValidationService {

    private final ConsumerUserStore consumerUserStore;

    public BasicAuthValidationService(ConsumerUserStore consumerUserStore) {
        this.consumerUserStore = consumerUserStore;
    }

    public Mono<AuthValidationResponse> validate(String gatewayId, String authorizationHeader) {
        return authenticateHeader(gatewayId, authorizationHeader)
            .map(consumer -> new AuthValidationResponse(
                true,
                "BASIC",
                consumer.username(),
                consumer.gatewayId(),
                consumer.consumerId()
            ));
    }

    public Mono<String> authenticate(String gatewayId, String providedUsername, String providedPassword) {
        return consumerUserStore.authenticate(gatewayId, providedUsername, providedPassword)
            .map(ConsumerAccessIdentity::username);
    }

    private Mono<ConsumerAccessIdentity> authenticateHeader(String gatewayId, String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing Authorization header"));
        }

        if (!authorizationHeader.startsWith("Basic ")) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Basic Authorization header is required"));
        }

        String encodedCredentials = authorizationHeader.substring("Basic ".length()).trim();
        String decodedCredentials;
        try {
            decodedCredentials = new String(Base64.getDecoder().decode(encodedCredentials), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException exception) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Basic Authorization header"));
        }

        int separatorIndex = decodedCredentials.indexOf(':');
        if (separatorIndex < 0) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Basic credentials"));
        }

        String providedUsername = decodedCredentials.substring(0, separatorIndex);
        String providedPassword = decodedCredentials.substring(separatorIndex + 1);

        return consumerUserStore.authenticate(gatewayId, providedUsername, providedPassword);
    }
}
