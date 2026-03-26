package dev.oudom.gateway_management_service.controller;

import dev.oudom.gateway_management_service.dto.RouteRequest;
import dev.oudom.gateway_management_service.service.RouteStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/internal/routes")
@RequiredArgsConstructor
public class InternalRouteController {

    private final RouteStorageService routeStorageService;

    @GetMapping
    public Map<String, List<RouteRequest>> listRoutesForGatewaySync() {
        return Map.of("routes", routeStorageService.findAllForGatewaySync());
    }
}
