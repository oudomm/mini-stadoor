package dev.oudom.gateway_management_service.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class StandardGatewaySyncService {

    private final RestClient restClient;

    public StandardGatewaySyncService(
        @Qualifier("loadBalancedRestClientBuilder") RestClient.Builder restClientBuilder,
        @Value("${standard-gateway.base-url}") String standardGatewayBaseUrl
    ) {
        this.restClient = restClientBuilder.baseUrl(standardGatewayBaseUrl).build();
    }

    public boolean refreshRoutes() {
        try {
            restClient.post()
                .uri("/internal/routes/refresh")
                .retrieve()
                .toBodilessEntity();
            return true;
        } catch (RestClientException exception) {
            return false;
        }
    }
}
