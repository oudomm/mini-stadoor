package dev.oudom.route_management_service.controller;

import dev.oudom.route_management_service.dto.RouteRequest;
import dev.oudom.route_management_service.service.RouteStorageService;
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
@RequestMapping("/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteStorageService routeStorageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRoute(@Valid @RequestBody RouteRequest routeRequest) {
        RouteRequest savedRoute = routeStorageService.save(routeRequest);
        return Map.of(
            "message", "Route created",
            "route", savedRoute
        );
    }

    @GetMapping
    public Map<String, List<RouteRequest>> listRoutes() {
        return Map.of("routes", routeStorageService.findAll());
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateRoute(@PathVariable String id, @Valid @RequestBody RouteRequest routeRequest) {
        RouteRequest updatedRoute = routeStorageService.update(id, routeRequest);
        return Map.of(
            "message", "Route updated",
            "route", updatedRoute
        );
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteRoute(@PathVariable String id) {
        routeStorageService.delete(id);
        return Map.of("message", "Route deleted");
    }
}
