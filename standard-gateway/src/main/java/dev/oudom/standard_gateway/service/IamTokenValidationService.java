package dev.oudom.standard_gateway.service;

import dev.oudom.standard_gateway.exception.RouteSecurityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoders;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
public class IamTokenValidationService {

    private final String issuerUri;
    private volatile ReactiveJwtDecoder reactiveJwtDecoder;

    public IamTokenValidationService(@Value("${iam-server.issuer-uri}") String issuerUri) {
        this.issuerUri = issuerUri;
    }

    public Mono<Void> validateBearerToken(String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);
        return Mono.fromCallable(this::getOrCreateDecoder)
            .flatMap(decoder -> decoder.decode(token))
            .then()
            .onErrorMap(JwtException.class, exception -> new RouteSecurityException(
                HttpStatus.UNAUTHORIZED,
                "OAuth2 token validation failed: " + readableJwtMessage(exception),
                "oauth2_token_failed",
                "OAUTH2",
                "Bearer"
            ))
            .onErrorMap(ResponseStatusException.class, exception -> exception)
            .onErrorMap(exception -> new RouteSecurityException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "iam-server is unavailable",
                "iam_server_unavailable",
                "OAUTH2",
                null
            ));
    }

    private ReactiveJwtDecoder getOrCreateDecoder() {
        ReactiveJwtDecoder current = reactiveJwtDecoder;
        if (current != null) {
            return current;
        }

        synchronized (this) {
            if (reactiveJwtDecoder == null) {
                reactiveJwtDecoder = ReactiveJwtDecoders.fromIssuerLocation(issuerUri);
            }
            return reactiveJwtDecoder;
        }
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new RouteSecurityException(
                HttpStatus.UNAUTHORIZED,
                "OAuth2 route requires a Bearer token issued by iam-server",
                "oauth2_token_required",
                "OAUTH2",
                "Bearer"
            );
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new RouteSecurityException(
                HttpStatus.UNAUTHORIZED,
                "OAuth2 route requires a Bearer token issued by iam-server",
                "oauth2_token_required",
                "OAUTH2",
                "Bearer"
            );
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        if (token.isBlank()) {
            throw new RouteSecurityException(
                HttpStatus.UNAUTHORIZED,
                "OAuth2 route requires a Bearer token issued by iam-server",
                "oauth2_token_required",
                "OAUTH2",
                "Bearer"
            );
        }

        return token;
    }

    private String readableJwtMessage(JwtException exception) {
        String message = exception.getMessage();
        return message == null || message.isBlank() ? "token is invalid or expired" : message;
    }
}
