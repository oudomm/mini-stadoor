package dev.oudom.consumer_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegistrationRequest(
    @NotBlank(message = "gatewayId must not be blank")
    @Size(max = 128, message = "gatewayId must be at most 128 characters")
    String gatewayId,
    @NotBlank(message = "consumerName must not be blank")
    @Size(max = 128, message = "consumerName must be at most 128 characters")
    String consumerName,
    @NotBlank(message = "username must not be blank")
    @Pattern(regexp = "^[a-zA-Z0-9][a-zA-Z0-9._-]*$", message = "username may only contain letters, numbers, dots, underscores, and hyphens")
    @Size(max = 64, message = "username must be at most 64 characters")
    String username,
    @NotBlank(message = "password must not be blank")
    @Size(min = 8, max = 128, message = "password must be between 8 and 128 characters")
    String password
) {
}
