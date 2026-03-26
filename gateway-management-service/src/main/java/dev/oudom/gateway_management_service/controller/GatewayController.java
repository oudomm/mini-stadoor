package dev.oudom.gateway_management_service.controller;

import dev.oudom.gateway_management_service.dto.GatewayCatalogResponse;
import dev.oudom.gateway_management_service.dto.GatewayRequest;
import dev.oudom.gateway_management_service.security.DeveloperIdentityResolver;
import dev.oudom.gateway_management_service.service.GatewayCatalogService;
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
@RequestMapping("/gateways")
@RequiredArgsConstructor
public class GatewayController {

    private final GatewayCatalogService gatewayCatalogService;
    private final DeveloperIdentityResolver developerIdentityResolver;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createGateway(@Valid @RequestBody GatewayRequest request) {
        GatewayRequest savedGateway = gatewayCatalogService.save(request, developerIdentityResolver.currentDeveloper());
        return Map.of(
            "message", "Gateway created",
            "gateway", savedGateway
        );
    }

    @GetMapping
    public Map<String, List<GatewayCatalogResponse>> listGateways() {
        return Map.of("gateways", gatewayCatalogService.findAll(developerIdentityResolver.currentDeveloper()));
    }
}
