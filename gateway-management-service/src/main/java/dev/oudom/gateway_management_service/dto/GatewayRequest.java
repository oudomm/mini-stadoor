package dev.oudom.gateway_management_service.dto;

import jakarta.validation.constraints.NotBlank;

public record GatewayRequest(
    @NotBlank(message = "gatewayId must not be blank")
    String gatewayId,
    @NotBlank(message = "gatewayName must not be blank")
    String gatewayName,
    String description
) {
    public GatewayRequest {
        description = description == null ? "" : description.trim();
    }
}
