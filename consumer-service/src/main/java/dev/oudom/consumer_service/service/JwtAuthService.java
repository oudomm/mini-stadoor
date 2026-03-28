package dev.oudom.consumer_service.service;

import dev.oudom.consumer_service.dto.AuthValidationResponse;
import dev.oudom.consumer_service.dto.LoginResponse;
import dev.oudom.consumer_service.entity.ConsumerUserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtAuthService {

    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final String REFRESH_TOKEN_TYPE = "refresh";

    private final ConsumerUserStore consumerUserStore;
    private final SecretKey signingKey;
    private final String issuer;
    private final long accessTokenExpirationSeconds;
    private final long refreshTokenExpirationSeconds;

    public JwtAuthService(
        ConsumerUserStore consumerUserStore,
        @Value("${consumer.security.jwt.secret}") String secret,
        @Value("${consumer.security.jwt.issuer}") String issuer,
        @Value("${consumer.security.jwt.access-token-expiration-seconds}") long accessTokenExpirationSeconds,
        @Value("${consumer.security.jwt.refresh-token-expiration-seconds}") long refreshTokenExpirationSeconds
    ) {
        this.consumerUserStore = consumerUserStore;
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.issuer = issuer;
        this.accessTokenExpirationSeconds = accessTokenExpirationSeconds;
        this.refreshTokenExpirationSeconds = refreshTokenExpirationSeconds;
    }

    public Mono<LoginResponse> login(String gatewayId, String username, String password) {
        return consumerUserStore.authenticate(gatewayId, username, password)
            .map(consumer -> new LoginResponse(
                generateToken(consumer, ACCESS_TOKEN_TYPE, accessTokenExpirationSeconds),
                generateToken(consumer, REFRESH_TOKEN_TYPE, refreshTokenExpirationSeconds),
                "Bearer",
                accessTokenExpirationSeconds,
                consumer.getUsername(),
                consumer.getGatewayId()
            ));
    }

    public Mono<AuthValidationResponse> validateAccessToken(String gatewayId, String tokenOrAuthorizationHeader) {
        String token = extractBearerToken(tokenOrAuthorizationHeader);
        Claims claims = parseToken(token);
        String tokenType = claims.get("token_type", String.class);
        if (!ACCESS_TOKEN_TYPE.equals(tokenType)) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Access token is required"));
        }

        String tokenGatewayId = claims.get("gateway_id", String.class);
        if (tokenGatewayId == null || !tokenGatewayId.equals(gatewayId)) {
            return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "JWT token does not belong to this gateway"));
        }

        return Mono.just(new AuthValidationResponse(
            true,
            "JWT",
            claims.getSubject(),
            tokenGatewayId,
            claims.get("consumer_id", String.class)
        ));
    }

    private String generateToken(ConsumerUserEntity consumer, String tokenType, long expirationSeconds) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plusSeconds(expirationSeconds);

        return Jwts.builder()
            .subject(consumer.getUsername())
            .issuer(issuer)
            .issuedAt(Date.from(issuedAt))
            .expiration(Date.from(expiresAt))
            .id(UUID.randomUUID().toString())
            .claim("token_type", tokenType)
            .claim("gateway_id", consumer.getGatewayId())
            .claim("consumer_id", consumer.getId())
            .claim("scope", tokenType.equals(ACCESS_TOKEN_TYPE) ? "gateway:access" : "gateway:refresh")
            .signWith(signingKey)
            .compact();
    }

    private Claims parseToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (JwtException | IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT token", exception);
        }
    }

    private String extractBearerToken(String tokenOrAuthorizationHeader) {
        if (tokenOrAuthorizationHeader == null || tokenOrAuthorizationHeader.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing bearer token");
        }

        if (tokenOrAuthorizationHeader.startsWith("Bearer ")) {
            return tokenOrAuthorizationHeader.substring("Bearer ".length()).trim();
        }

        if (tokenOrAuthorizationHeader.startsWith(HttpHeaders.AUTHORIZATION)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bearer token is required");
        }

        return tokenOrAuthorizationHeader.trim();
    }
}
