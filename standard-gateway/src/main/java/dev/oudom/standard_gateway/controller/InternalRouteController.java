package dev.oudom.standard_gateway.controller;

import dev.oudom.standard_gateway.dto.RouteRequest;
import dev.oudom.standard_gateway.service.DynamicRouteService;
import dev.oudom.standard_gateway.service.RouteStorageService;
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
