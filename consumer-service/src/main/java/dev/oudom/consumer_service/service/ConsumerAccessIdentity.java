package dev.oudom.consumer_service.service;

public record ConsumerAccessIdentity(
    String consumerId,
    String gatewayId,
    String consumerName,
    String username
) {
}
