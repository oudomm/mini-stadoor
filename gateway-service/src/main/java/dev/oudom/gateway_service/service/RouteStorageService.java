package dev.oudom.gateway_service.service;

import dev.oudom.gateway_service.dto.RouteRequest;
import dev.oudom.gateway_service.dto.RouteResponse;
import dev.oudom.gateway_service.dto.RoutesResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteStorageService {

    private final RestClient.Builder restClientBuilder;

    @Value("${route-management.base-url}")
    private String routeManagementBaseUrl;

    public synchronized RouteRequest save(RouteRequest routeRequest) {
        RouteResponse response = restClient().post()
            .uri("/routes")
            .contentType(MediaType.APPLICATION_JSON)
            .body(routeRequest)
            .retrieve()
            .body(RouteResponse.class);

        return response.route();
    }

    public synchronized RouteRequest update(String id, RouteRequest routeRequest) {
        RouteResponse response = restClient().put()
            .uri("/routes/{id}", id)
            .contentType(MediaType.APPLICATION_JSON)
            .body(routeRequest)
            .retrieve()
            .body(RouteResponse.class);

        return response.route();
    }

    public synchronized void delete(String id) {
        restClient().delete()
            .uri("/routes/{id}", id)
            .retrieve()
            .toBodilessEntity();
    }

    public synchronized List<RouteRequest> findAll() {
        RoutesResponse response = restClient().get()
            .uri("/routes")
            .retrieve()
            .body(RoutesResponse.class);

        return response == null || response.routes() == null ? List.of() : response.routes();
    }

    private RestClient restClient() {
        return restClientBuilder
            .baseUrl(routeManagementBaseUrl)
            .build();
    }
}
