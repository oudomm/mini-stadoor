package dev.oudom.gateway_service.service;

import dev.oudom.gateway_service.dto.RouteRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cloud.gateway.event.RefreshRoutesEvent;
import org.springframework.cloud.gateway.route.RouteDefinitionWriter;
import org.springframework.cloud.gateway.support.NotFoundException;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.handler.predicate.PredicateDefinition;
import org.springframework.cloud.gateway.filter.FilterDefinition;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
@Slf4j
public class DynamicRouteService {

    private final RouteStorageService routeStorageService;
    private final RouteDefinitionWriter routeDefinitionWriter;
    private final ApplicationEventPublisher eventPublisher;

    private final AtomicReference<List<RouteRequest>> activeRoutes = new AtomicReference<>(List.of());

    @EventListener(ApplicationReadyEvent.class)
    public void loadRoutesFromDatabase() {
        refreshRoutesFromStorage()
            .doOnError(exception -> log.warn(
                "Skipping initial route sync because route-management-service is unavailable or misconfigured: {}",
                exception.getMessage()))
            .onErrorResume(exception -> {
                activeRoutes.set(List.of());
                return Mono.empty();
            })
            .subscribe();
    }

    public Mono<List<RouteRequest>> refreshRoutesFromStorage() {
        return routeStorageService.findAll()
            .collectList()
            .flatMap(this::replaceRoutes);
    }

    public Mono<List<RouteRequest>> replaceRoutes(List<RouteRequest> routes) {
        List<RouteRequest> snapshot = List.copyOf(routes);
        List<RouteRequest> previousRoutes = activeRoutes.get();

        Mono<Void> deleteExistingRoutes = Flux.fromIterable(previousRoutes)
            .concatMap(route -> routeDefinitionWriter.delete(Mono.just(route.id()))
                .onErrorResume(NotFoundException.class, exception -> Mono.empty()))
            .then();

        Mono<Void> saveRoutes = Flux.fromIterable(snapshot)
            .concatMap(route -> routeDefinitionWriter.save(Mono.just(toRouteDefinition(route))))
            .then();

        return deleteExistingRoutes
            .then(saveRoutes)
            .then(Mono.fromRunnable(() -> {
                activeRoutes.set(snapshot);
                eventPublisher.publishEvent(new RefreshRoutesEvent(this));
            }))
            .thenReturn(snapshot);
    }

    public List<RouteRequest> getActiveRoutes() {
        return activeRoutes.get();
    }

    private RouteDefinition toRouteDefinition(RouteRequest route) {
        RouteDefinition routeDefinition = new RouteDefinition();
        routeDefinition.setId(route.id());
        routeDefinition.setUri(URI.create(route.uri()));
        routeDefinition.setPredicates(List.of(new PredicateDefinition("Path=" + route.path())));
        routeDefinition.setFilters(List.of(new FilterDefinition("StripPrefix=1")));
        return routeDefinition;
    }
}
