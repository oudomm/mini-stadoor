package dev.oudom.gateway_service.service;

import dev.oudom.gateway_service.dto.RouteRequest;
import dev.oudom.gateway_service.dto.AuthType;
import dev.oudom.gateway_service.entity.RouteEntity;
import dev.oudom.gateway_service.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class RouteStorageService {

    private final RouteRepository routeRepository;

    public RouteRequest save(RouteRequest routeRequest) {
        routeRepository.save(new RouteEntity(
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

        routeEntity.setPath(routeRequest.path());
        routeEntity.setUri(routeRequest.uri());
        routeEntity.setAuthType(routeRequest.authType());
        routeRepository.save(routeEntity);

        return new RouteRequest(routeEntity.getId(), routeEntity.getPath(), routeEntity.getUri(), routeEntity.getAuthType());
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
                route.getId(),
                route.getPath(),
                route.getUri(),
                route.getAuthType() == null ? AuthType.NONE : route.getAuthType()))
            .toList();
    }
}
