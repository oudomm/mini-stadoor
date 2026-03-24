package dev.oudom.standard_gateway.service;

import dev.oudom.standard_gateway.dto.AuthValidationResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
public class ConsumerAuthService {

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
            .onStatus(status -> status.value() == 401, response -> Mono.error(
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Basic authentication credentials")))
            .onStatus(status -> status.is5xxServerError(), response -> Mono.error(
                new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "consumer-service is unavailable")))
            .bodyToMono(AuthValidationResponse.class)
            .onErrorMap(ResponseStatusException.class, exception -> exception)
            .onErrorMap(exception -> new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "consumer-service is unavailable",
                exception));
    }
}
