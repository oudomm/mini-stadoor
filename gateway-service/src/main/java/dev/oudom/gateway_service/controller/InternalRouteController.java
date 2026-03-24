package dev.oudom.gateway_service.controller;

import dev.oudom.gateway_service.dto.RouteRequest;
import dev.oudom.gateway_service.service.DynamicRouteService;
import dev.oudom.gateway_service.service.RouteStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/internal/routes")
@RequiredArgsConstructor
public class InternalRouteController {

    private final RouteStorageService routeStorageService;
    private final DynamicRouteService dynamicRouteService;

    @PostMapping
    public Mono<ResponseEntity<Map<String, Object>>> createRoute(@Valid @RequestBody RouteRequest routeRequest) {
        return routeStorageService.save(routeRequest)
            .flatMap(savedRoute -> dynamicRouteService.refreshRoutesFromStorage()
                .map(activeRoutes -> ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Route stored and activated",
                    "route", savedRoute,
                    "active", activeRoutes.stream()
                        .anyMatch(route -> route.id().equals(savedRoute.id()))
                ))));
    }
}
