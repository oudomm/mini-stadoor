package dev.oudom.consumer_service.controller;

import dev.oudom.consumer_service.dto.AuthValidationResponse;
import dev.oudom.consumer_service.service.BasicAuthValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/internal/auth")
@RequiredArgsConstructor
public class InternalAuthController {

    private final BasicAuthValidationService basicAuthValidationService;

    @PostMapping("/basic/validate")
    public Mono<AuthValidationResponse> validateBasic(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        return basicAuthValidationService.validate(authorizationHeader);
    }
}
