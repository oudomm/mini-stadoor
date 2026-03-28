package dev.oudom.consumer_service.dto;

public record AuthValidationResponse(
    boolean authenticated,
    String authenticationType,
    String principal,
    String gatewayId,
    String consumerId
) {
}
