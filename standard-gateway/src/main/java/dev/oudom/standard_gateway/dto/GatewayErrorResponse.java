package dev.oudom.standard_gateway.dto;

public record GatewayErrorResponse(
    String timestamp,
    int status,
    String error,
    String message,
    String path,
    String code,
    String authType
) {
}
