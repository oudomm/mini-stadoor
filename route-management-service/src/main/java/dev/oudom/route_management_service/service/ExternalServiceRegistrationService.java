package dev.oudom.route_management_service.service;

import dev.oudom.route_management_service.dto.ServiceRegistrationRequest;
import dev.oudom.route_management_service.entity.ExternalServiceEntity;
import dev.oudom.route_management_service.repository.ExternalServiceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.http.MediaType;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@Slf4j
public class ExternalServiceRegistrationService {

    private final RestClient restClient;
    private final ExternalServiceRepository externalServiceRepository;

    public ExternalServiceRegistrationService(
        RestClient.Builder restClientBuilder,
        ExternalServiceRepository externalServiceRepository,
        @Value("${eureka-api.base-url}") String eurekaApiBaseUrl
    ) {
        this.restClient = restClientBuilder
            .baseUrl(eurekaApiBaseUrl)
            .build();
        this.externalServiceRepository = externalServiceRepository;
    }

    public ServiceRegistrationRequest register(ServiceRegistrationRequest request) {
        registerWithEureka(request);
        externalServiceRepository.save(toEntity(request));

        return request;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void restoreRegisteredServices() {
        externalServiceRepository.findAll().stream()
            .map(this::toRequest)
            .forEach(request -> {
                try {
                    registerWithEureka(request);
                }
                catch (RestClientException exception) {
                    log.warn("Could not restore Eureka registration for {}: {}", request.serviceId(), exception.getMessage());
                }
            });
    }

    @Scheduled(fixedDelayString = "${eureka-api.heartbeat-interval-ms:20000}")
    public void renewRegisteredServices() {
        externalServiceRepository.findAll().stream()
            .map(this::toRequest)
            .forEach(request -> {
                try {
                    renewLease(request);
                }
                catch (RestClientException exception) {
                    log.warn("Could not renew Eureka lease for {}: {}", request.serviceId(), exception.getMessage());
                }
            });
    }

    private void registerWithEureka(ServiceRegistrationRequest request) {
        restClient.post()
            .uri("/apps/{appName}", request.appName())
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .body(Map.of("instance", eurekaInstancePayload(request)))
            .retrieve()
            .toBodilessEntity();
    }

    private void renewLease(ServiceRegistrationRequest request) {
        restClient.put()
            .uri("/apps/{appName}/{serviceId}", request.appName(), request.serviceId())
            .retrieve()
            .toBodilessEntity();
    }

    private Map<String, Object> eurekaInstancePayload(ServiceRegistrationRequest request) {
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
        return instance;
    }

    private ExternalServiceEntity toEntity(ServiceRegistrationRequest request) {
        return new ExternalServiceEntity(
            request.serviceId(),
            request.serviceName(),
            request.address(),
            request.port(),
            request.tagsAsCsv()
        );
    }

    private ServiceRegistrationRequest toRequest(ExternalServiceEntity entity) {
        return new ServiceRegistrationRequest(
            entity.getServiceId(),
            entity.getServiceName(),
            entity.getAddress(),
            entity.getPort(),
            ServiceRegistrationRequest.tagsFromCsv(entity.getTags())
        );
    }
}
