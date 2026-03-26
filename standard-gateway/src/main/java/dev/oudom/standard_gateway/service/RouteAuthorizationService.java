package dev.oudom.standard_gateway.service;

import dev.oudom.standard_gateway.dto.AuthType;
import dev.oudom.standard_gateway.dto.RouteRequest;
import dev.oudom.standard_gateway.exception.RouteSecurityException;
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
    private final IamTokenValidationService iamTokenValidationService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public RouteAuthorizationService(
        DynamicRouteService dynamicRouteService,
        ConsumerAuthService consumerAuthService,
        IamTokenValidationService iamTokenValidationService
    ) {
        this.dynamicRouteService = dynamicRouteService;
        this.consumerAuthService = consumerAuthService;
        this.iamTokenValidationService = iamTokenValidationService;
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
                return Mono.error(new RouteSecurityException(
                    HttpStatus.UNAUTHORIZED,
                    "Route '" + requestPath + "' requires Basic authentication",
                    "basic_auth_required",
                    "BASIC",
                    "Basic realm=\"stadoor\""
                ));
            }

            return consumerAuthService.validateBasic(authorizationHeader).then();
        }

        if (matchingRoute.get().authType() == AuthType.API_KEY) {
            if (apiKey == null || apiKey.isBlank()) {
                return Mono.error(new RouteSecurityException(
                    HttpStatus.UNAUTHORIZED,
                    "Route '" + requestPath + "' requires X-API-Key header",
                    "api_key_required",
                    "API_KEY",
                    null
                ));
            }

            return consumerAuthService.validateApiKey(apiKey).then();
        }

        if (matchingRoute.get().authType() == AuthType.JWT) {
            if (authorizationHeader == null || authorizationHeader.isBlank()) {
                return Mono.error(new RouteSecurityException(
                    HttpStatus.UNAUTHORIZED,
                    "Route '" + requestPath + "' requires a JWT Bearer access token",
                    "jwt_token_required",
                    "JWT",
                    "Bearer"
                ));
            }

            return consumerAuthService.validateJwt(authorizationHeader).then();
        }

        if (matchingRoute.get().authType() == AuthType.OAUTH2) {
            if (authorizationHeader == null || authorizationHeader.isBlank()) {
                return Mono.error(new RouteSecurityException(
                    HttpStatus.UNAUTHORIZED,
                    "Route '" + requestPath + "' requires an OAuth2 Bearer access token",
                    "oauth2_token_required",
                    "OAUTH2",
                    "Bearer"
                ));
            }

            return iamTokenValidationService.validateBearerToken(authorizationHeader);
        }

        return Mono.error(new ResponseStatusException(
            HttpStatus.NOT_IMPLEMENTED,
            "Unsupported auth type: " + matchingRoute.get().authType()));
    }
}
