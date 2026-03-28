package dev.oudom.consumer_service.dto;

public record LoginResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn,
    String principal,
    String gatewayId
) {
}
