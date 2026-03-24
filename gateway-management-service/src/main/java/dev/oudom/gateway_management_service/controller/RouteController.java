package dev.oudom.gateway_management_service.controller;

import dev.oudom.gateway_management_service.dto.RouteRequest;
import dev.oudom.gateway_management_service.service.StandardGatewaySyncService;
import dev.oudom.gateway_management_service.service.RouteStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteStorageService routeStorageService;
    private final StandardGatewaySyncService standardGatewaySyncService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRoute(@Valid @RequestBody RouteRequest routeRequest) {
        RouteRequest savedRoute = routeStorageService.save(routeRequest);
        boolean synced = standardGatewaySyncService.refreshRoutes();
        return Map.of(
            "message", "Route created",
            "route", savedRoute,
            "gatewayRefreshed", synced
        );
    }

    @GetMapping
    public Map<String, List<RouteRequest>> listRoutes() {
        return Map.of("routes", routeStorageService.findAll());
    }
}
