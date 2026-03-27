package dev.oudom.consumer_service.controller;

import dev.oudom.consumer_service.dto.ConsumerUserSummaryResponse;
import dev.oudom.consumer_service.dto.AuthValidationResponse;
import dev.oudom.consumer_service.dto.LoginRequest;
import dev.oudom.consumer_service.dto.LoginResponse;
import dev.oudom.consumer_service.dto.TokenValidationRequest;
import dev.oudom.consumer_service.dto.UserRegistrationRequest;
import dev.oudom.consumer_service.dto.UserRegistrationResponse;
import dev.oudom.consumer_service.service.JwtAuthService;
import dev.oudom.consumer_service.service.ConsumerUserStore;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final JwtAuthService jwtAuthService;
    private final ConsumerUserStore consumerUserStore;

    @GetMapping("/users")
    public Mono<List<ConsumerUserSummaryResponse>> listUsers() {
        return consumerUserStore.findAllUsers();
    }

    @PostMapping("/users/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UserRegistrationResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        return consumerUserStore.register(request);
    }

    @PostMapping("/login")
    public Mono<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return jwtAuthService.login(request.username(), request.password());
    }

    @PostMapping("/token/validate")
    public Mono<AuthValidationResponse> validateToken(
        @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
        @Valid @RequestBody(required = false) TokenValidationRequest request
    ) {
        String token = request != null ? request.token() : authorizationHeader;
        return jwtAuthService.validateAccessToken(token);
    }
}
