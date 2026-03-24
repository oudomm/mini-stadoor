package dev.oudom.standard_gateway.controller;

import dev.oudom.standard_gateway.service.DynamicRouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/internal/routes")
@RequiredArgsConstructor
public class InternalRouteController {

    private final DynamicRouteService dynamicRouteService;

    @PostMapping("/refresh")
    public Mono<ResponseEntity<Map<String, Object>>> refreshRoutes() {
        return dynamicRouteService.refreshRoutesFromStorage()
            .map(activeRoutes -> ResponseEntity.ok(Map.of(
                "message", "Routes refreshed",
                "routeCount", activeRoutes.size()
            )));
    }
}
