package dev.oudom.gateway_management_service.dto;

import java.util.List;

public record ServiceCatalogResponse(
    String gatewayId,
    String serviceId,
    String serviceName,
    String address,
    Integer port,
    List<String> tags,
    String upstreamId,
    List<TargetCatalogResponse> targets,
    AuthType authType,
    List<RouteRequest> routes
) {
}
