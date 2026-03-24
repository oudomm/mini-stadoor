package dev.oudom.route_management_service.service;

import dev.oudom.route_management_service.dto.ServiceRegistrationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ExternalServiceRegistrationService {

    private final RestClient restClient;

    public ExternalServiceRegistrationService(
        RestClient.Builder restClientBuilder,
        @Value("${eureka-api.base-url}") String eurekaApiBaseUrl
    ) {
        this.restClient = restClientBuilder
            .baseUrl(eurekaApiBaseUrl)
            .build();
    }

    public ServiceRegistrationRequest register(ServiceRegistrationRequest request) {
        Map<String, Object> instance = new LinkedHashMap<>();
        instance.put("instanceId", request.serviceId());
        instance.put("hostName", request.address());
        instance.put("app", request.appName());
        instance.put("ipAddr", request.address());
        instance.put("vipAddress", request.vipAddress());
        instance.put("secureVipAddress", request.vipAddress());
        instance.put("status", "UP");
        instance.put("port", Map.of("$", request.port(), "@enabled", "true"));
        instance.put("securePort", Map.of("$", 443, "@enabled", "false"));
        instance.put("homePageUrl", request.homePageUrl());
        instance.put("statusPageUrl", request.statusPageUrl());
        instance.put("healthCheckUrl", request.healthCheckUrl());
        instance.put("dataCenterInfo", Map.of(
            "@class", "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            "name", "MyOwn"
        ));
        instance.put("metadata", request.metadataMap());

        restClient.post()
            .uri("/apps/{appName}", request.appName())
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .body(Map.of("instance", instance))
            .retrieve()
            .toBodilessEntity();

        return request;
    }

    public void deregister(String appName, String serviceId) {
        restClient.delete()
            .uri("/apps/{appName}/{serviceId}", appName.toUpperCase(), serviceId)
            .retrieve()
            .toBodilessEntity();
    }
}
