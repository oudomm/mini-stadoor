package dev.oudom.consumer_service.dto;

public record UserRegistrationResponse(
    String id,
    String gatewayId,
    String consumerName,
    String username,
    String apiKey
) {
}
