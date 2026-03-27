package dev.oudom.gateway_management_service.service;

import dev.oudom.gateway_management_service.dto.AuthType;
import dev.oudom.gateway_management_service.dto.ServiceRegistrationRequest;
import dev.oudom.gateway_management_service.entity.ExternalServiceEntity;
import dev.oudom.gateway_management_service.entity.GatewayEntity;
import dev.oudom.gateway_management_service.repository.ExternalServiceRepository;
import dev.oudom.gateway_management_service.repository.GatewayRepository;
import dev.oudom.gateway_management_service.repository.RouteRepository;
import dev.oudom.gateway_management_service.security.DeveloperIdentity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.http.MediaType;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Slf4j
public class ExternalServiceRegistrationService {

    private final RestClient restClient;
    private final ExternalServiceRepository externalServiceRepository;
    private final GatewayRepository gatewayRepository;
    private final RouteRepository routeRepository;

    public ExternalServiceRegistrationService(
        RestClient.Builder restClientBuilder,
        ExternalServiceRepository externalServiceRepository,
        GatewayRepository gatewayRepository,
        RouteRepository routeRepository,
        @Value("${eureka-api.base-url}") String eurekaApiBaseUrl
    ) {
        this.restClient = restClientBuilder
            .baseUrl(eurekaApiBaseUrl)
            .build();
        this.externalServiceRepository = externalServiceRepository;
        this.gatewayRepository = gatewayRepository;
        this.routeRepository = routeRepository;
    }

    public ServiceRegistrationRequest register(ServiceRegistrationRequest request, DeveloperIdentity owner) {
        GatewayEntity gateway = resolveGateway(request.gatewayId(), owner);
        validateServiceAuthType(request, gateway);
        registerWithEureka(request);
        externalServiceRepository.save(toEntity(request, owner));
        if (request.authType() != null) {
            applyServiceSecurityToExistingRoutes(request, owner, request.authType());
        }

        return request;
    }

    public List<ServiceRegistrationRequest> findAll(DeveloperIdentity owner) {
        return externalServiceRepository.findAllByOwnerUserUuidOrderByServiceNameAsc(owner.userUuid()).stream()
            .map(this::toRequest)
            .toList();
    }

    public List<ServiceRegistrationRequest> findAllByGatewayId(String gatewayId, DeveloperIdentity owner) {
        return externalServiceRepository.findAllByGatewayIdAndOwnerUserUuidOrderByServiceNameAsc(
            gatewayId,
            owner.userUuid()
        ).stream()
            .map(this::toRequest)
            .toList();
    }

    private GatewayEntity resolveGateway(String gatewayId, DeveloperIdentity owner) {
        return gatewayRepository.findByGatewayIdAndOwnerUserUuid(gatewayId, owner.userUuid())
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Gateway not found: " + gatewayId));
    }

    private void validateServiceAuthType(ServiceRegistrationRequest request, GatewayEntity gateway) {
        if (request.authType() == null) {
            return;
        }

        AuthType gatewayAuthType = gateway.getAuthType() == null ? AuthType.NONE : gateway.getAuthType();
        if (request.authType() != gatewayAuthType) {
            throw new ResponseStatusException(
                BAD_REQUEST,
                "Service authType " + request.authType() + " is not allowed in gateway " + gateway.getGatewayId()
                    + ". Gateway security is " + gatewayAuthType
            );
        }
    }

    private void applyServiceSecurityToExistingRoutes(
        ServiceRegistrationRequest request,
        DeveloperIdentity owner,
        AuthType serviceAuthType
    ) {
        List<dev.oudom.gateway_management_service.entity.RouteEntity> routes = routeRepository
            .findAllByGatewayIdAndServiceIdAndOwnerUserUuidOrderByIdAsc(
                request.gatewayId(),
                request.serviceId(),
                owner.userUuid()
            );
        if (routes.isEmpty()) {
            return;
        }
        routes.forEach(route -> route.setAuthType(serviceAuthType));
        routeRepository.saveAll(routes);
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

    private ExternalServiceEntity toEntity(ServiceRegistrationRequest request, DeveloperIdentity owner) {
        return new ExternalServiceEntity(
            request.gatewayId(),
            request.serviceId(),
            request.serviceName(),
            request.address(),
            request.port(),
            request.tagsAsCsv(),
            request.authType(),
            owner.userUuid(),
            owner.username(),
            owner.email()
        );
    }

    private ServiceRegistrationRequest toRequest(ExternalServiceEntity entity) {
        return new ServiceRegistrationRequest(
            entity.getGatewayId(),
            entity.getServiceId(),
            entity.getServiceName(),
            entity.getAddress(),
            entity.getPort(),
            ServiceRegistrationRequest.tagsFromCsv(entity.getTags()),
            entity.getAuthType()
        );
    }
}
