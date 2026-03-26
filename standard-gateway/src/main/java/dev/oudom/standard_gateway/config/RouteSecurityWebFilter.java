package dev.oudom.standard_gateway.config;

import dev.oudom.standard_gateway.dto.GatewayErrorResponse;
import dev.oudom.standard_gateway.exception.RouteSecurityException;
import dev.oudom.standard_gateway.service.RouteAuthorizationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Component
@RequiredArgsConstructor
public class RouteSecurityWebFilter implements WebFilter {

    private final RouteAuthorizationService routeAuthorizationService;
    private final ObjectMapper objectMapper;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();

        if (path.startsWith("/internal/") || path.startsWith("/actuator")) {
            return chain.filter(exchange);
        }

        return routeAuthorizationService.authorize(
                path,
                exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION),
                exchange.getRequest().getHeaders().getFirst("X-API-Key"))
            .then(chain.filter(exchange))
            .onErrorResume(ResponseStatusException.class, exception -> writeError(exchange, exception));
    }

    private Mono<Void> writeError(ServerWebExchange exchange, ResponseStatusException exception) {
        if (exception instanceof RouteSecurityException routeSecurityException
            && routeSecurityException.getWwwAuthenticate() != null
            && !routeSecurityException.getWwwAuthenticate().isBlank()) {
            exchange.getResponse().getHeaders().set(
                HttpHeaders.WWW_AUTHENTICATE,
                routeSecurityException.getWwwAuthenticate()
            );
        }

        exchange.getResponse().setStatusCode(exception.getStatusCode());
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String body = serializeError(exchange, exception);
        return exchange.getResponse().writeWith(Mono.just(
            exchange.getResponse().bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8))));
    }

    private String serializeError(ServerWebExchange exchange, ResponseStatusException exception) {
        String authType = exception instanceof RouteSecurityException routeSecurityException
            ? routeSecurityException.getAuthType()
            : null;
        String code = exception instanceof RouteSecurityException routeSecurityException
            ? routeSecurityException.getCode()
            : "gateway_error";

        GatewayErrorResponse response = new GatewayErrorResponse(
            Instant.now().toString(),
            exception.getStatusCode().value(),
            resolveErrorName(exception.getStatusCode()),
            exception.getReason() == null ? "Gateway request failed" : exception.getReason(),
            exchange.getRequest().getPath().value(),
            code,
            authType
        );

        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException jsonProcessingException) {
            return "{\"message\":\"Gateway request failed\"}";
        }
    }

    private String resolveErrorName(org.springframework.http.HttpStatusCode statusCode) {
        if (statusCode instanceof HttpStatus status) {
            return status.getReasonPhrase();
        }
        return "Error";
    }
}
