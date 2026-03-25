package dev.oudom.gateway_management_service.service;

import dev.oudom.gateway_management_service.dto.GatewayCatalogResponse;
import dev.oudom.gateway_management_service.dto.GatewayRequest;
import dev.oudom.gateway_management_service.dto.RouteRequest;
import dev.oudom.gateway_management_service.dto.ServiceCatalogResponse;
import dev.oudom.gateway_management_service.dto.ServiceRegistrationRequest;
import dev.oudom.gateway_management_service.entity.GatewayEntity;
import dev.oudom.gateway_management_service.repository.GatewayRepository;
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

    public GatewayRequest save(GatewayRequest request) {
        gatewayRepository.save(new GatewayEntity(
            request.gatewayId(),
            request.gatewayName(),
            request.description()
        ));
        return request;
    }

    public List<GatewayCatalogResponse> findAll() {
        return gatewayRepository.findAll().stream()
            .map(gateway -> new GatewayCatalogResponse(
                gateway.getGatewayId(),
                gateway.getGatewayName(),
                gateway.getDescription(),
                findServicesForGateway(gateway.getGatewayId())
            ))
            .toList();
    }

    public void ensureGatewayExists(String gatewayId) {
        if (!gatewayRepository.existsById(gatewayId)) {
            throw new ResponseStatusException(NOT_FOUND, "Gateway not found: " + gatewayId);
        }
    }

    private List<ServiceCatalogResponse> findServicesForGateway(String gatewayId) {
        return externalServiceRegistrationService.findAllByGatewayId(gatewayId).stream()
            .map(service -> new ServiceCatalogResponse(
                service.gatewayId(),
                service.serviceId(),
                service.serviceName(),
                service.address(),
                service.port(),
                service.normalizedTags(),
                findRoutesForService(gatewayId, service.serviceId())
            ))
            .toList();
    }

    private List<RouteRequest> findRoutesForService(String gatewayId, String serviceId) {
        return routeStorageService.findAllByGatewayIdAndServiceId(gatewayId, serviceId);
    }
}
