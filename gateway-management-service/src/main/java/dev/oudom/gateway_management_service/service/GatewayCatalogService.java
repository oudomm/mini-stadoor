package dev.oudom.gateway_management_service.service;

import dev.oudom.gateway_management_service.dto.GatewayCatalogResponse;
import dev.oudom.gateway_management_service.dto.GatewayRequest;
import dev.oudom.gateway_management_service.dto.RouteRequest;
import dev.oudom.gateway_management_service.dto.ServiceCatalogResponse;
import dev.oudom.gateway_management_service.dto.ServiceRegistrationRequest;
import dev.oudom.gateway_management_service.entity.GatewayEntity;
import dev.oudom.gateway_management_service.repository.GatewayRepository;
import dev.oudom.gateway_management_service.security.DeveloperIdentity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class GatewayCatalogService {

    private final GatewayRepository gatewayRepository;
    private final ExternalServiceRegistrationService externalServiceRegistrationService;
    private final RouteStorageService routeStorageService;

    public GatewayRequest save(GatewayRequest request, DeveloperIdentity owner) {
        gatewayRepository.save(new GatewayEntity(
            request.gatewayId(),
            request.gatewayName(),
            request.description(),
            request.authType(),
            owner.userUuid(),
            owner.username(),
            owner.email()
        ));
        return request;
    }

    public List<GatewayCatalogResponse> findAll(DeveloperIdentity owner) {
        return gatewayRepository.findAllByOwnerUserUuidOrderByGatewayNameAsc(owner.userUuid()).stream()
            .map(gateway -> new GatewayCatalogResponse(
                gateway.getGatewayId(),
                gateway.getGatewayName(),
                gateway.getDescription(),
                gateway.getAuthType(),
                findServicesForGateway(gateway.getGatewayId(), owner)
            ))
            .toList();
    }

    public void ensureGatewayExists(String gatewayId, DeveloperIdentity owner) {
        if (!gatewayRepository.existsByGatewayIdAndOwnerUserUuid(gatewayId, owner.userUuid())) {
            throw new ResponseStatusException(NOT_FOUND, "Gateway not found: " + gatewayId);
        }
    }

    private List<ServiceCatalogResponse> findServicesForGateway(String gatewayId, DeveloperIdentity owner) {
        return externalServiceRegistrationService.findAllByGatewayId(gatewayId, owner).stream()
            .map(service -> new ServiceCatalogResponse(
                service.gatewayId(),
                service.serviceId(),
                service.serviceName(),
                service.address(),
                service.port(),
                service.normalizedTags(),
                service.authType(),
                findRoutesForService(gatewayId, service.serviceId(), owner)
            ))
            .toList();
    }

    private List<RouteRequest> findRoutesForService(String gatewayId, String serviceId, DeveloperIdentity owner) {
        return routeStorageService.findAllByGatewayIdAndServiceId(gatewayId, serviceId, owner);
    }
}
