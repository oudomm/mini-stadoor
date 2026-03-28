package dev.oudom.consumer_service.dto;

import java.time.Instant;

public record ConsumerUserSummaryResponse(
    String id,
    String gatewayId,
    String consumerName,
    String username,
    String apiKeyPreview,
    String status,
    Instant createdAt
) {
}
