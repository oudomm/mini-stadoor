package dev.oudom.consumer_service.dto;

public record UserRegistrationResponse(
    String username,
    String apiKey
) {
}
