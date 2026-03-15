package dev.oudom.gateway_service.actuator;

import dev.oudom.gateway_service.dto.RouteRequest;
import dev.oudom.gateway_service.gateway.DynamicGatewayRouterFunction;
import dev.oudom.gateway_service.service.RouteStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.endpoint.Access;
import org.springframework.boot.actuate.endpoint.web.annotation.RestControllerEndpoint;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Map;

@Component
@RestControllerEndpoint(id = "gateway", defaultAccess = Access.UNRESTRICTED)
@RequiredArgsConstructor
public class GatewayActuatorEndpoint {

    private final RouteStorageService routeStorageService;
    private final DynamicGatewayRouterFunction dynamicGatewayRouterFunction;

    @GetMapping("/routes")
    public Map<String, List<RouteRequest>> routes() {
        return Map.of(
            "storedRoutes", routeStorageService.findAll(),
            "activeRoutes", dynamicGatewayRouterFunction.getActiveRoutes()
        );
    }

    @PostMapping("/refresh")
    public Map<String, Object> refresh() {
        List<RouteRequest> activeRoutes = dynamicGatewayRouterFunction.refreshRoutes(routeStorageService.findAll());
        return Map.of(
            "message", "Gateway routes refreshed",
            "routeCount", activeRoutes.size(),
            "routes", activeRoutes
        );
    }
}
