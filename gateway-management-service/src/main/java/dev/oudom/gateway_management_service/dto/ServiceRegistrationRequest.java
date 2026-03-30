package dev.oudom.gateway_management_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public record ServiceRegistrationRequest(
    @NotBlank(message = "gatewayId must not be blank")
    @Pattern(regexp = "^[a-zA-Z0-9][a-zA-Z0-9._-]*$", message = "gatewayId may only contain letters, numbers, dots, underscores, and hyphens")
    String gatewayId,
    @NotBlank(message = "serviceId must not be blank")
    @Pattern(regexp = "^[a-zA-Z0-9][a-zA-Z0-9._-]*$", message = "serviceId may only contain letters, numbers, dots, underscores, and hyphens")
    String serviceId,
    @NotBlank(message = "serviceName must not be blank")
    @Pattern(regexp = "^[a-zA-Z0-9][a-zA-Z0-9._-]*$", message = "serviceName may only contain letters, numbers, dots, underscores, and hyphens")
    String serviceName,
    @NotBlank(message = "address must not be blank")
    @Pattern(regexp = "^[^\\s]+$", message = "address must not contain spaces")
    String address,
    @NotNull(message = "port must not be null")
    @Min(value = 1, message = "port must be greater than 0")
    @Max(value = 65535, message = "port must be less than or equal to 65535")
    Integer port,
    List<@NotBlank(message = "tags must not contain blank values") String> tags,
    AuthType authType,
    String upstreamId
) {
    public List<String> normalizedTags() {
        return tags == null ? List.of() : List.copyOf(tags);
    }

    public String appName() {
        return serviceName().toUpperCase();
    }

    public String vipAddress() {
        return serviceName();
    }

    public String homePageUrl() {
        return "http://" + address() + ":" + port() + "/";
    }

    public String statusPageUrl() {
        return homePageUrl() + "actuator/info";
    }

    public String healthCheckUrl() {
        return homePageUrl() + "actuator/health";
    }

    public Map<String, String> metadataMap() {
        if (normalizedTags().isEmpty()) {
            return Map.of();
        }

        return Map.of("tags", String.join(",", normalizedTags()));
    }

    public String tagsAsCsv() {
        return String.join(",", normalizedTags());
    }

    public static List<String> tagsFromCsv(String tags) {
        if (tags == null || tags.isBlank()) {
            return List.of();
        }

        return Arrays.stream(tags.split(","))
            .map(String::trim)
            .filter(value -> !value.isBlank())
            .toList();
    }
}
