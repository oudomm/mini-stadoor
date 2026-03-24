package dev.oudom.consumer_service.service;

import dev.oudom.consumer_service.dto.AuthValidationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class BasicAuthValidationService {

    private final String username;
    private final String password;

    public BasicAuthValidationService(
        @Value("${consumer.security.basic.username}") String username,
        @Value("${consumer.security.basic.password}") String password
    ) {
        this.username = username;
        this.password = password;
    }

    public Mono<AuthValidationResponse> validate(String authorizationHeader) {
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

        if (!username.equals(providedUsername) || !password.equals(providedPassword)) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Basic authentication credentials"));
        }

        return Mono.just(new AuthValidationResponse(true, "BASIC", providedUsername));
    }
}
