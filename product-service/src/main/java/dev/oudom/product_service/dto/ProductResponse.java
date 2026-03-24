package dev.oudom.product_service.dto;

public record ProductResponse(
    String id,
    String name,
    String category,
    double price
) {
}
