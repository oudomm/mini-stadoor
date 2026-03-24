package dev.oudom.standard_gateway.config;

import dev.oudom.standard_gateway.service.RouteAuthorizationService;
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

@Component
@RequiredArgsConstructor
public class RouteSecurityWebFilter implements WebFilter {

    private final RouteAuthorizationService routeAuthorizationService;

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
        if (exception.getStatusCode() == HttpStatus.UNAUTHORIZED) {
            exchange.getResponse().getHeaders().set(HttpHeaders.WWW_AUTHENTICATE, "Basic realm=\"stadoor\"");
        }

        exchange.getResponse().setStatusCode(exception.getStatusCode());
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String body = "{\"message\":\"" + escapeJson(exception.getReason()) + "\"}";
        return exchange.getResponse().writeWith(Mono.just(
            exchange.getResponse().bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8))));
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
