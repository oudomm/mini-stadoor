package dev.oudom.gateway_service.gateway;

import dev.oudom.gateway_service.dto.RouteRequest;
import dev.oudom.gateway_service.service.RouteStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.HandlerFunction;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.RouterFunctions;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@Component
@RequiredArgsConstructor
@Slf4j
public class DynamicGatewayRouterFunction implements RouterFunction<ServerResponse> {

    private final RouteStorageService routeStorageService;

    private final AtomicReference<RouterFunction<ServerResponse>> delegate =
        new AtomicReference<>(request -> Optional.empty());

    private final AtomicReference<List<RouteRequest>> activeRoutes = new AtomicReference<>(List.of());

    // The gateway reads from this live delegate, which we replace on refresh.
    public synchronized List<RouteRequest> refreshRoutes(List<RouteRequest> routes) {
        if (routes.isEmpty()) {
            delegate.set(request -> Optional.empty());
            activeRoutes.set(List.of());
            return List.of();
        }

        RouterFunctions.Builder builder = RouterFunctions.route();

        for (RouteRequest route : routes) {
            RouterFunction<ServerResponse> gatewayRoute = GatewayRouterFunctions.route(route.id())
                .route(GatewayRequestPredicates.path(route.path()), HandlerFunctions.http())
                .before(BeforeFilterFunctions.stripPrefix(1))
                .before(BeforeFilterFunctions.uri(route.uri()))
                .build();

            builder.add(gatewayRoute);
        }

        List<RouteRequest> snapshot = List.copyOf(routes);
        delegate.set(builder.build());
        activeRoutes.set(snapshot);
        return snapshot;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void loadRoutesFromDatabase() {
        try {
            refreshRoutes(routeStorageService.findAll());
        }
        catch (RuntimeException exception) {
            log.warn("Skipping initial route sync because route-management-service is unavailable or misconfigured: {}", exception.getMessage());
            refreshRoutes(List.of());
        }
    }

    public List<RouteRequest> getActiveRoutes() {
        return activeRoutes.get();
    }

    @Override
    public Optional<HandlerFunction<ServerResponse>> route(ServerRequest request) {
        return delegate.get().route(request);
    }
}
