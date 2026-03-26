package dev.oudom.gateway_management_service.controller;

import dev.oudom.gateway_management_service.dto.ServiceRegistrationRequest;
import dev.oudom.gateway_management_service.security.DeveloperIdentityResolver;
import dev.oudom.gateway_management_service.service.ExternalServiceRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceRegistrationController {

    private final ExternalServiceRegistrationService externalServiceRegistrationService;
    private final DeveloperIdentityResolver developerIdentityResolver;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@Valid @RequestBody ServiceRegistrationRequest request) {
        ServiceRegistrationRequest registeredService = externalServiceRegistrationService.register(
            request,
            developerIdentityResolver.currentDeveloper()
        );
        return Map.of(
            "message", "Service registered in Eureka",
            "service", registeredService
        );
    }

    @GetMapping
    public Map<String, List<ServiceRegistrationRequest>> list() {
        return Map.of("services", externalServiceRegistrationService.findAll(developerIdentityResolver.currentDeveloper()));
    }
}
