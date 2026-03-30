package dev.oudom.gateway_management_service.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
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
            log.warn("Could not refresh standard-gateway routes: {}", exception.getMessage());
            return false;
        } catch (RuntimeException exception) {
            log.warn("Unexpected error while refreshing standard-gateway routes: {}", exception.getMessage());
            return false;
        }
    }
}
