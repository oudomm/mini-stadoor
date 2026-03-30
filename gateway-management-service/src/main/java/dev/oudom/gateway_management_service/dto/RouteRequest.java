package dev.oudom.gateway_management_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RouteRequest(
    @NotBlank(message = "gatewayId must not be blank")
    @Pattern(regexp = "^[a-zA-Z0-9][a-zA-Z0-9._-]*$", message = "gatewayId may only contain letters, numbers, dots, underscores, and hyphens")
    String gatewayId,
    @NotBlank(message = "serviceId must not be blank")
    @Pattern(regexp = "^[a-zA-Z0-9][a-zA-Z0-9._-]*$", message = "serviceId may only contain letters, numbers, dots, underscores, and hyphens")
    String serviceId,
    @NotBlank(message = "id must not be blank")
    @Pattern(regexp = "^[a-zA-Z0-9][a-zA-Z0-9._-]*$", message = "id may only contain letters, numbers, dots, underscores, and hyphens")
    String id,
    @NotBlank(message = "path must not be blank")
    @Pattern(regexp = "^/.*", message = "path must start with '/'")
    String path,
    @NotBlank(message = "uri must not be blank")
    @Pattern(regexp = "^(lb://|https?://).+", message = "uri must start with lb://, http://, or https://")
    String uri,
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    AuthType authType
) {
}
