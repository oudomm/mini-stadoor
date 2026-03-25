package dev.oudom.standard_gateway.service;

import dev.oudom.standard_gateway.dto.AuthType;
import dev.oudom.standard_gateway.dto.RouteRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Service
public class RouteAuthorizationService {

    private final DynamicRouteService dynamicRouteService;
    private final ConsumerAuthService consumerAuthService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public RouteAuthorizationService(
        DynamicRouteService dynamicRouteService,
        ConsumerAuthService consumerAuthService
    ) {
        this.dynamicRouteService = dynamicRouteService;
        this.consumerAuthService = consumerAuthService;
    }

    public Mono<Void> authorize(String requestPath, String authorizationHeader, String apiKey) {
        Optional<RouteRequest> matchingRoute = dynamicRouteService.getActiveRoutes().stream()
            .filter(route -> pathMatcher.match(route.path(), requestPath))
            .findFirst();

        if (matchingRoute.isEmpty() || matchingRoute.get().authType() == AuthType.NONE) {
            return Mono.empty();
        }

        if (matchingRoute.get().authType() == AuthType.BASIC) {
            if (authorizationHeader == null || authorizationHeader.isBlank()) {
                return Mono.error(new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Basic authentication is required"));
            }

            return consumerAuthService.validateBasic(authorizationHeader).then();
        }

        if (matchingRoute.get().authType() == AuthType.API_KEY) {
            if (apiKey == null || apiKey.isBlank()) {
                return Mono.error(new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "API key is required"));
            }

            return consumerAuthService.validateApiKey(apiKey).then();
        }

        if (matchingRoute.get().authType() == AuthType.JWT) {
            if (authorizationHeader == null || authorizationHeader.isBlank()) {
                return Mono.error(new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Bearer token is required"));
            }

            return consumerAuthService.validateJwt(authorizationHeader).then();
        }

        return Mono.error(new ResponseStatusException(
            HttpStatus.NOT_IMPLEMENTED,
            "Unsupported auth type: " + matchingRoute.get().authType()));
    }
}
