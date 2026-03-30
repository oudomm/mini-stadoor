package dev.oudom.gateway_management_service.dto;

public record TargetCatalogResponse(
    String targetId,
    String host,
    Integer port,
    Integer weight
) {
}
