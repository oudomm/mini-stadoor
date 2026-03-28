package dev.oudom.consumer_service.dto;

import jakarta.validation.constraints.NotBlank;

public record TokenValidationRequest(
    @NotBlank(message = "gatewayId must not be blank")
    String gatewayId,
    @NotBlank(message = "token must not be blank")
    String token
) {
    public TokenValidationRequest {
        gatewayId = gatewayId == null ? null : gatewayId.trim();
        token = token == null ? null : token.trim();
    }
}
