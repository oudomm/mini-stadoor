package dev.oudom.standard_gateway.dto;

public record RouteResponse(
    String message,
    RouteRequest route
) {
}
