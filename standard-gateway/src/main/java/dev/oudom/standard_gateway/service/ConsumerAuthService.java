package dev.oudom.standard_gateway.service;

import dev.oudom.standard_gateway.dto.AuthValidationResponse;
import dev.oudom.standard_gateway.exception.RouteSecurityException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ConsumerAuthService {

    private static final Pattern MESSAGE_PATTERN = Pattern.compile("\"message\"\\s*:\\s*\"([^\"]+)\"");

    private final WebClient webClient;

    public ConsumerAuthService(
        @Qualifier("loadBalancedWebClientBuilder") WebClient.Builder webClientBuilder,
        @Value("${consumer-service.base-url}") String consumerServiceBaseUrl
    ) {
        this.webClient = webClientBuilder.baseUrl(consumerServiceBaseUrl).build();
    }

    public Mono<AuthValidationResponse> validateBasic(String authorizationHeader) {
        return webClient.post()
            .uri("/internal/auth/basic/validate")
            .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
            .retrieve()
            .onStatus(status -> status.value() == 401, response -> unauthorizedFromConsumer(
                response,
                "basic_auth_failed",
                "BASIC",
                "Basic realm=\"stadoor\"",
                "Basic authentication failed"
            ))
            .onStatus(status -> status.is5xxServerError(), response -> Mono.error(
                new RouteSecurityException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "consumer-service is unavailable while validating Basic authentication",
                    "consumer_service_unavailable",
                    "BASIC",
                    null
                )))
            .bodyToMono(AuthValidationResponse.class)
            .onErrorMap(ResponseStatusException.class, exception -> exception)
            .onErrorMap(exception -> new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "consumer-service is unavailable",
                exception));
    }

    public Mono<AuthValidationResponse> validateApiKey(String apiKey) {
        return webClient.post()
            .uri("/internal/auth/api-key/validate")
            .header("X-API-Key", apiKey)
            .retrieve()
            .onStatus(status -> status.value() == 401, response -> unauthorizedFromConsumer(
                response,
                "api_key_failed",
                "API_KEY",
                null,
                "API key validation failed"
            ))
            .onStatus(status -> status.is5xxServerError(), response -> Mono.error(
                new RouteSecurityException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "consumer-service is unavailable while validating API key",
                    "consumer_service_unavailable",
                    "API_KEY",
                    null
                )))
            .bodyToMono(AuthValidationResponse.class)
            .onErrorMap(ResponseStatusException.class, exception -> exception)
            .onErrorMap(exception -> new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "consumer-service is unavailable",
                exception));
    }

    public Mono<AuthValidationResponse> validateJwt(String authorizationHeader) {
        return webClient.post()
            .uri("/internal/auth/jwt/validate")
            .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
            .retrieve()
            .onStatus(status -> status.value() == 401, response -> unauthorizedFromConsumer(
                response,
                "jwt_token_failed",
                "JWT",
                "Bearer",
                "JWT validation failed"
            ))
            .onStatus(status -> status.is5xxServerError(), response -> Mono.error(
                new RouteSecurityException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "consumer-service is unavailable while validating JWT access token",
                    "consumer_service_unavailable",
                    "JWT",
                    null
                )))
            .bodyToMono(AuthValidationResponse.class)
            .onErrorMap(ResponseStatusException.class, exception -> exception)
            .onErrorMap(exception -> new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "consumer-service is unavailable",
                exception));
    }

    private Mono<? extends Throwable> unauthorizedFromConsumer(
        ClientResponse response,
        String code,
        String authType,
        String wwwAuthenticate,
        String fallbackPrefix
    ) {
        return response.bodyToMono(String.class)
            .defaultIfEmpty("")
            .map(body -> new RouteSecurityException(
                HttpStatus.UNAUTHORIZED,
                buildMessage(fallbackPrefix, extractMessage(body)),
                code,
                authType,
                wwwAuthenticate
            ));
    }

    private String extractMessage(String body) {
        if (body == null || body.isBlank()) {
            return null;
        }

        Matcher matcher = MESSAGE_PATTERN.matcher(body);
        if (matcher.find()) {
            return matcher.group(1);
        }

        String compact = body.replaceAll("\\s+", " ").trim();
        return compact.isBlank() ? null : compact;
    }

    private String buildMessage(String prefix, String detail) {
        if (detail == null || detail.isBlank()) {
            return prefix;
        }
        return prefix + ": " + detail;
    }
}
