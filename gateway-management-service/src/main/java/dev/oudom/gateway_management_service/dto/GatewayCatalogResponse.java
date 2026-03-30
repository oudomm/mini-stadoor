package dev.oudom.gateway_management_service.dto;

import java.util.List;

public record GatewayCatalogResponse(
    String gatewayId,
    String gatewayName,
    String description,
    String workspaceId,
    String workspaceName,
    GatewayWorkspaceType workspaceType,
    AuthType authType,
    List<ServiceCatalogResponse> services
) {
}
