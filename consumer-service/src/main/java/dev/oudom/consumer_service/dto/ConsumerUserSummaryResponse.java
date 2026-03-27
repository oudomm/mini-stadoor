package dev.oudom.consumer_service.dto;

import java.time.Instant;

public record ConsumerUserSummaryResponse(
    String id,
    String username,
    String apiKeyPreview,
    String status,
    Instant createdAt
) {
}
