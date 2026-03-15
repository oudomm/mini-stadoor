package dev.oudom.gateway_service.controller;

import dev.oudom.gateway_service.dto.RouteRequest;
import dev.oudom.gateway_service.gateway.DynamicGatewayRouterFunction;
import dev.oudom.gateway_service.service.RouteStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/internal/routes")
@RequiredArgsConstructor
public class InternalRouteController {

    private final RouteStorageService routeStorageService;
    private final DynamicGatewayRouterFunction dynamicGatewayRouterFunction;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRoute(@Valid @RequestBody RouteRequest routeRequest) {
        RouteRequest savedRoute = routeStorageService.save(routeRequest);
        List<RouteRequest> activeRoutes = dynamicGatewayRouterFunction.refreshRoutes(routeStorageService.findAll());
        return Map.of(
            "message", "Route stored and activated",
            "route", savedRoute,
            "active", activeRoutes.stream()
                .anyMatch(route -> route.id().equals(savedRoute.id()))
        );
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateRoute(@PathVariable String id, @Valid @RequestBody RouteRequest routeRequest) {
        RouteRequest updatedRoute = routeStorageService.update(id, routeRequest);
        List<RouteRequest> activeRoutes = dynamicGatewayRouterFunction.refreshRoutes(routeStorageService.findAll());
        return Map.of(
            "message", "Route updated and activated",
            "route", updatedRoute,
            "active", activeRoutes.stream()
                .anyMatch(route -> route.id().equals(updatedRoute.id()))
        );
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteRoute(@PathVariable String id) {
        routeStorageService.delete(id);
        List<RouteRequest> activeRoutes = dynamicGatewayRouterFunction.refreshRoutes(routeStorageService.findAll());
        return Map.of(
            "message", "Route deleted and gateway refreshed",
            "activeRouteIds", activeRoutes.stream()
                .map(RouteRequest::id)
                .toList()
        );
    }

    @GetMapping
    public Map<String, Object> listRoutes() {
        List<RouteRequest> storedRoutes = routeStorageService.findAll();
        return Map.of(
            "routes", storedRoutes,
            "activeRouteIds", dynamicGatewayRouterFunction.getActiveRoutes().stream()
                .map(RouteRequest::id)
                .toList()
        );
    }
}
