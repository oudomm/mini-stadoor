package dev.oudom.gateway_management_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record GatewayRequest(
    @NotBlank(message = "gatewayId must not be blank")
    @Pattern(regexp = "^[a-zA-Z0-9][a-zA-Z0-9._-]*$", message = "gatewayId may only contain letters, numbers, dots, underscores, and hyphens")
    String gatewayId,
    @NotBlank(message = "gatewayName must not be blank")
    String gatewayName,
    String description,
    AuthType authType
) {
    public GatewayRequest {
        description = description == null ? "" : description.trim();
        authType = authType == null ? AuthType.NONE : authType;
    }
}
