package dev.oudom.standard_gateway.dto;

import jakarta.validation.constraints.NotBlank;

public record RouteRequest(
    @NotBlank(message = "id must not be blank")
    String id,
    @NotBlank(message = "path must not be blank")
    String path,
    @NotBlank(message = "uri must not be blank")
    String uri
) {
}
