package dev.oudom.standard_gateway.dto;

public record AuthValidationResponse(
    boolean authenticated,
    String authenticationType,
    String principal,
    String gatewayId,
    String consumerId
) {
}
