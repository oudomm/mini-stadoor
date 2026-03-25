package dev.oudom.consumer_service.dto;

import jakarta.validation.constraints.NotBlank;

public record TokenValidationRequest(
    @NotBlank(message = "token must not be blank")
    String token
) {
}
