package dev.oudom.gateway_management_service.service;

import dev.oudom.gateway_management_service.dto.RouteRequest;
import dev.oudom.gateway_management_service.dto.AuthType;
import dev.oudom.gateway_management_service.entity.RouteEntity;
import dev.oudom.gateway_management_service.repository.ExternalServiceRepository;
import dev.oudom.gateway_management_service.repository.GatewayRepository;
import dev.oudom.gateway_management_service.repository.RouteRepository;
import dev.oudom.gateway_management_service.security.DeveloperIdentity;
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

    public RouteRequest save(RouteRequest routeRequest, DeveloperIdentity owner) {
        ensureGatewayExists(routeRequest.gatewayId(), owner);
        ensureServiceExists(routeRequest.gatewayId(), routeRequest.serviceId(), owner);
        routeRepository.save(new RouteEntity(
            routeRequest.gatewayId(),
            routeRequest.serviceId(),
            routeRequest.id(),
            routeRequest.path(),
            routeRequest.uri(),
            routeRequest.authType(),
            owner.userUuid(),
            owner.username(),
            owner.email()
        ));
        return routeRequest;
    }

    public RouteRequest update(String id, RouteRequest routeRequest, DeveloperIdentity owner) {
        RouteEntity routeEntity = routeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Route not found: " + id));

        ensureRouteOwnership(routeEntity, id, owner);
        ensureGatewayExists(routeRequest.gatewayId(), owner);
        ensureServiceExists(routeRequest.gatewayId(), routeRequest.serviceId(), owner);
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

    public void delete(String id, DeveloperIdentity owner) {
        RouteEntity routeEntity = routeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Route not found: " + id));
        ensureRouteOwnership(routeEntity, id, owner);
        routeRepository.deleteById(id);
    }

    public List<RouteRequest> findAll(DeveloperIdentity owner) {
        return routeRepository.findAllByOwnerUserUuidOrderByIdAsc(owner.userUuid()).stream()
            .map(route -> new RouteRequest(
                route.getGatewayId(),
                route.getServiceId(),
                route.getId(),
                route.getPath(),
                route.getUri(),
                route.getAuthType() == null ? AuthType.NONE : route.getAuthType()))
            .toList();
    }

    public List<RouteRequest> findAllByGatewayIdAndServiceId(String gatewayId, String serviceId, DeveloperIdentity owner) {
        return routeRepository.findAllByGatewayIdAndServiceIdAndOwnerUserUuidOrderByIdAsc(
            gatewayId,
            serviceId,
            owner.userUuid()
        ).stream()
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

    public List<RouteRequest> findAllForGatewaySync() {
        return routeRepository.findAll().stream()
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

    private void ensureServiceExists(String gatewayId, String serviceId, DeveloperIdentity owner) {
        if (!externalServiceRepository.existsByGatewayIdAndServiceIdAndOwnerUserUuid(
            gatewayId,
            serviceId,
            owner.userUuid()
        )) {
            throw new ResponseStatusException(NOT_FOUND, "Service not found in gateway: " + serviceId);
        }
    }

    private void ensureGatewayExists(String gatewayId, DeveloperIdentity owner) {
        if (!gatewayRepository.existsByGatewayIdAndOwnerUserUuid(gatewayId, owner.userUuid())) {
            throw new ResponseStatusException(NOT_FOUND, "Gateway not found: " + gatewayId);
        }
    }

    private void ensureRouteOwnership(RouteEntity routeEntity, String routeId, DeveloperIdentity owner) {
        if (routeEntity.getOwnerUserUuid() == null || !routeEntity.getOwnerUserUuid().equals(owner.userUuid())) {
            throw new ResponseStatusException(NOT_FOUND, "Route not found: " + routeId);
        }
    }
}
