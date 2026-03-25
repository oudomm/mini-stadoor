package dev.oudom.gateway_management_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public record ServiceRegistrationRequest(
    @NotBlank(message = "gatewayId must not be blank")
    String gatewayId,
    @NotBlank(message = "serviceId must not be blank")
    String serviceId,
    @NotBlank(message = "serviceName must not be blank")
    String serviceName,
    @NotBlank(message = "address must not be blank")
    String address,
    @NotNull(message = "port must not be null")
    @Min(value = 1, message = "port must be greater than 0")
    @Max(value = 65535, message = "port must be less than or equal to 65535")
    Integer port,
    List<String> tags
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
