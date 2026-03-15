package dev.oudom.gateway_service.dto;

public record RouteResponse(
    String message,
    RouteRequest route
) {
}
