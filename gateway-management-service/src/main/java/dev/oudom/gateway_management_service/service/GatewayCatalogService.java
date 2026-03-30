package dev.oudom.gateway_management_service.service;

import dev.oudom.gateway_management_service.dto.GatewayCatalogResponse;
import dev.oudom.gateway_management_service.dto.GatewayRequest;
import dev.oudom.gateway_management_service.dto.GatewayWorkspaceType;
import dev.oudom.gateway_management_service.dto.RouteRequest;
import dev.oudom.gateway_management_service.dto.ServiceCatalogResponse;
import dev.oudom.gateway_management_service.dto.TargetCatalogResponse;
import dev.oudom.gateway_management_service.dto.ServiceRegistrationRequest;
import dev.oudom.gateway_management_service.entity.GatewayEntity;
import dev.oudom.gateway_management_service.entity.GatewayWorkspaceEntity;
import dev.oudom.gateway_management_service.repository.GatewayRepository;
import dev.oudom.gateway_management_service.repository.GatewayWorkspaceRepository;
import dev.oudom.gateway_management_service.repository.TargetRepository;
import dev.oudom.gateway_management_service.repository.UpstreamRepository;
import dev.oudom.gateway_management_service.security.DeveloperIdentity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class GatewayCatalogService {

    private final GatewayRepository gatewayRepository;
    private final GatewayWorkspaceRepository gatewayWorkspaceRepository;
    private final UpstreamRepository upstreamRepository;
    private final TargetRepository targetRepository;
    private final ExternalServiceRegistrationService externalServiceRegistrationService;
    private final RouteStorageService routeStorageService;

    public GatewayRequest save(GatewayRequest request, DeveloperIdentity owner) {
        GatewayWorkspaceEntity workspace = resolveOrCreateWorkspace(owner, request);
        gatewayRepository.save(new GatewayEntity(
            request.gatewayId(),
            request.gatewayName(),
            request.description(),
            workspace.getWorkspaceId(),
            request.authType(),
            owner.userUuid(),
            owner.username(),
            owner.email()
        ));
        return request;
    }

    public List<GatewayCatalogResponse> findAll(DeveloperIdentity owner) {
        return gatewayRepository.findAllByOwnerUserUuidOrderByGatewayNameAsc(owner.userUuid()).stream()
            .map(gateway -> toCatalogResponse(gateway, owner))
            .toList();
    }

    public void ensureGatewayExists(String gatewayId, DeveloperIdentity owner) {
        if (!gatewayRepository.existsByGatewayIdAndOwnerUserUuid(gatewayId, owner.userUuid())) {
            throw new ResponseStatusException(NOT_FOUND, "Gateway not found: " + gatewayId);
        }
    }

    private List<ServiceCatalogResponse> findServicesForGateway(String gatewayId, DeveloperIdentity owner) {
        return externalServiceRegistrationService.findAllByGatewayId(gatewayId, owner).stream()
            .map(service -> {
                List<TargetCatalogResponse> targets = targetRepository.findAllByUpstreamIdOrderByCreatedAtAsc(
                        service.upstreamId()
                    ).stream()
                    .map(target -> new TargetCatalogResponse(
                        target.getTargetId(),
                        target.getHost(),
                        target.getPort(),
                        target.getWeight()
                    ))
                    .toList();

                return new ServiceCatalogResponse(
                    service.gatewayId(),
                    service.serviceId(),
                    service.serviceName(),
                    service.address(),
                    service.port(),
                    service.normalizedTags(),
                    service.upstreamId(),
                    targets,
                    service.authType(),
                    findRoutesForService(gatewayId, service.serviceId(), owner)
                );
            })
            .toList();
    }

    private List<RouteRequest> findRoutesForService(String gatewayId, String serviceId, DeveloperIdentity owner) {
        return routeStorageService.findAllByGatewayIdAndServiceId(gatewayId, serviceId, owner);
    }

    private GatewayCatalogResponse toCatalogResponse(GatewayEntity gateway, DeveloperIdentity owner) {
        Optional<GatewayWorkspaceEntity> workspace = gatewayWorkspaceRepository.findById(gateway.getWorkspaceId());
        return new GatewayCatalogResponse(
            gateway.getGatewayId(),
            gateway.getGatewayName(),
            gateway.getDescription(),
            gateway.getWorkspaceId(),
            workspace.map(GatewayWorkspaceEntity::getWorkspaceName).orElse("Unassigned Workspace"),
            workspace.map(GatewayWorkspaceEntity::getType).orElse(GatewayWorkspaceType.API),
            gateway.getAuthType(),
            findServicesForGateway(gateway.getGatewayId(), owner)
        );
    }

    private GatewayWorkspaceEntity resolveOrCreateWorkspace(DeveloperIdentity owner, GatewayRequest request) {
        GatewayWorkspaceType workspaceType = request.workspaceType();
        return gatewayWorkspaceRepository.findByOwnerUserUuidAndType(owner.userUuid(), workspaceType)
            .orElseGet(() -> gatewayWorkspaceRepository.save(new GatewayWorkspaceEntity(
                owner.userUuid() + "-" + workspaceType.name().toLowerCase() + "-workspace",
                workspaceType == GatewayWorkspaceType.BFF ? "BFF Workspace" : "API Workspace",
                workspaceType,
                owner.userUuid(),
                null
            )));
    }
}
