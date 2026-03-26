package dev.oudom.gateway_management_service.security;

public record DeveloperIdentity(
    String userUuid,
    String username,
    String email
) {
}
