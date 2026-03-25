package dev.oudom.gateway_management_service.service;

import dev.oudom.gateway_management_service.dto.RouteRequest;
import dev.oudom.gateway_management_service.dto.AuthType;
import dev.oudom.gateway_management_service.entity.RouteEntity;
import dev.oudom.gateway_management_service.repository.ExternalServiceRepository;
import dev.oudom.gateway_management_service.repository.GatewayRepository;
import dev.oudom.gateway_management_service.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class RouteStorageService {

    private final RouteRepository routeRepository;
    private final GatewayRepository gatewayRepository;
    private final ExternalServiceRepository externalServiceRepository;

    public RouteRequest save(RouteRequest routeRequest) {
        ensureGatewayExists(routeRequest.gatewayId());
        ensureServiceExists(routeRequest.gatewayId(), routeRequest.serviceId());
        routeRepository.save(new RouteEntity(
            routeRequest.gatewayId(),
            routeRequest.serviceId(),
            routeRequest.id(),
            routeRequest.path(),
            routeRequest.uri(),
            routeRequest.authType()
        ));
        return routeRequest;
    }

    public RouteRequest update(String id, RouteRequest routeRequest) {
        RouteEntity routeEntity = routeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Route not found: " + id));

        ensureGatewayExists(routeRequest.gatewayId());
        ensureServiceExists(routeRequest.gatewayId(), routeRequest.serviceId());
        routeEntity.setGatewayId(routeRequest.gatewayId());
        routeEntity.setServiceId(routeRequest.serviceId());
        routeEntity.setPath(routeRequest.path());
        routeEntity.setUri(routeRequest.uri());
        routeEntity.setAuthType(routeRequest.authType());
        routeRepository.save(routeEntity);

        return new RouteRequest(
            routeEntity.getGatewayId(),
            routeEntity.getServiceId(),
            routeEntity.getId(),
            routeEntity.getPath(),
            routeEntity.getUri(),
            routeEntity.getAuthType()
        );
    }

    public void delete(String id) {
        if (!routeRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Route not found: " + id);
        }

        routeRepository.deleteById(id);
    }

    public List<RouteRequest> findAll() {
        return routeRepository.findAll().stream()
            .map(route -> new RouteRequest(
                route.getGatewayId(),
                route.getServiceId(),
                route.getId(),
                route.getPath(),
                route.getUri(),
                route.getAuthType() == null ? AuthType.NONE : route.getAuthType()))
            .toList();
    }

    public List<RouteRequest> findAllByGatewayIdAndServiceId(String gatewayId, String serviceId) {
        return routeRepository.findAllByGatewayIdAndServiceId(gatewayId, serviceId).stream()
            .map(route -> new RouteRequest(
                route.getGatewayId(),
                route.getServiceId(),
                route.getId(),
                route.getPath(),
                route.getUri(),
                route.getAuthType() == null ? AuthType.NONE : route.getAuthType()
            ))
            .toList();
    }

    private void ensureServiceExists(String gatewayId, String serviceId) {
        if (!externalServiceRepository.existsByGatewayIdAndServiceId(gatewayId, serviceId)) {
            throw new ResponseStatusException(NOT_FOUND, "Service not found in gateway: " + serviceId);
        }
    }

    private void ensureGatewayExists(String gatewayId) {
        if (!gatewayRepository.existsById(gatewayId)) {
            throw new ResponseStatusException(NOT_FOUND, "Gateway not found: " + gatewayId);
        }
    }
}
