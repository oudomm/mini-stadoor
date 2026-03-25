package dev.oudom.gateway_management_service.dto;

import java.util.List;

public record ServiceCatalogResponse(
    String gatewayId,
    String serviceId,
    String serviceName,
    String address,
    Integer port,
    List<String> tags,
    List<RouteRequest> routes
) {
}
