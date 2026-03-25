package dev.oudom.consumer_service.controller;

import dev.oudom.consumer_service.dto.AuthValidationResponse;
import dev.oudom.consumer_service.service.ApiKeyValidationService;
import dev.oudom.consumer_service.service.BasicAuthValidationService;
import dev.oudom.consumer_service.service.JwtAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/internal/auth")
@RequiredArgsConstructor
public class InternalAuthController {

    private final BasicAuthValidationService basicAuthValidationService;
    private final ApiKeyValidationService apiKeyValidationService;
    private final JwtAuthService jwtAuthService;

    @Value("${consumer.security.api-key.header-name}")
    private String apiKeyHeaderName;

    @PostMapping("/basic/validate")
    public Mono<AuthValidationResponse> validateBasic(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        return basicAuthValidationService.validate(authorizationHeader);
    }

    @PostMapping("/api-key/validate")
    public Mono<AuthValidationResponse> validateApiKey(
        @RequestHeader HttpHeaders headers
    ) {
        String apiKey = headers.getFirst(apiKeyHeaderName);
        return apiKeyValidationService.validate(apiKey);
    }

    @PostMapping("/jwt/validate")
    public Mono<AuthValidationResponse> validateJwt(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        return jwtAuthService.validateAccessToken(authorizationHeader);
    }
}
