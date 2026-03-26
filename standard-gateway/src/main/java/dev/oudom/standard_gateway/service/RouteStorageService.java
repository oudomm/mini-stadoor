package dev.oudom.standard_gateway.service;

import dev.oudom.standard_gateway.dto.RouteRequest;
import dev.oudom.standard_gateway.dto.RouteResponse;
import dev.oudom.standard_gateway.dto.RoutesResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class RouteStorageService {

    private final WebClient webClient;

    public RouteStorageService(
        @Qualifier("loadBalancedWebClientBuilder") WebClient.Builder webClientBuilder,
        @Value("${route-management.base-url}") String routeManagementBaseUrl
    ) {
        this.webClient = webClientBuilder
            .baseUrl(routeManagementBaseUrl)
            .build();
    }

    public Mono<RouteRequest> save(RouteRequest routeRequest) {
        return webClient.post()
            .uri("/routes")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(routeRequest)
            .retrieve()
            .bodyToMono(RouteResponse.class)
            .map(RouteResponse::route);
    }

    public Mono<RouteRequest> update(String id, RouteRequest routeRequest) {
        return webClient.put()
            .uri("/routes/{id}", id)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(routeRequest)
            .retrieve()
            .bodyToMono(RouteResponse.class)
            .map(RouteResponse::route);
    }

    public Mono<Void> delete(String id) {
        return webClient.delete()
            .uri("/routes/{id}", id)
            .retrieve()
            .toBodilessEntity()
            .then();
    }

    public Flux<RouteRequest> findAll() {
        return webClient.get()
            .uri("/internal/routes")
            .retrieve()
            .bodyToMono(RoutesResponse.class)
            .flatMapMany(response -> response == null || response.routes() == null
                ? Flux.empty()
                : Flux.fromIterable(response.routes()));
    }
}
