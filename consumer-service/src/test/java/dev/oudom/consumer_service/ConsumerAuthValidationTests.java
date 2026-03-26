package dev.oudom.consumer_service;

import dev.oudom.consumer_service.dto.LoginResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ConsumerAuthValidationTests {

    @Autowired
    private ApplicationContext applicationContext;

    private WebTestClient webTestClient;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        this.webTestClient = WebTestClient.bindToApplicationContext(applicationContext).build();
    }

    @Test
    void returnsUnauthorizedForMissingAuthorizationHeader() {
        webTestClient.post()
            .uri("/internal/auth/basic/validate")
            .exchange()
            .expectStatus().isUnauthorized();
    }

    @Test
    void validatesCorrectBasicCredentials() {
        webTestClient.post()
            .uri("/internal/auth/basic/validate")
            .header(HttpHeaders.AUTHORIZATION, basicAuth("enduser", "enduser123"))
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.authenticated").isEqualTo(true)
            .jsonPath("$.authenticationType").isEqualTo("BASIC")
            .jsonPath("$.principal").isEqualTo("enduser");
    }

    @Test
    void rejectsWrongBasicCredentials() {
        webTestClient.post()
            .uri("/internal/auth/basic/validate")
            .header(HttpHeaders.AUTHORIZATION, basicAuth("enduser", "wrong-password"))
            .exchange()
            .expectStatus().isUnauthorized();
    }

    @Test
    void validatesCorrectApiKey() {
        webTestClient.post()
            .uri("/internal/auth/api-key/validate")
            .header("X-API-Key", "stadoor-demo-key")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.authenticated").isEqualTo(true)
            .jsonPath("$.authenticationType").isEqualTo("API_KEY")
            .jsonPath("$.principal").isEqualTo("enduser");
    }

    @Test
    void rejectsWrongApiKey() {
        webTestClient.post()
            .uri("/internal/auth/api-key/validate")
            .header("X-API-Key", "wrong-key")
            .exchange()
            .expectStatus().isUnauthorized();
    }

    @Test
    void issuesAndValidatesJwtAccessToken() {
        LoginResponse loginResponse = webTestClient.post()
            .uri("/api/login")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("""
                {
                  "username": "enduser",
                  "password": "enduser123"
                }
                """)
            .exchange()
            .expectStatus().isOk()
            .expectBody(LoginResponse.class)
            .returnResult()
            .getResponseBody();

        assert loginResponse != null;
        String accessToken = loginResponse.accessToken();

        webTestClient.post()
            .uri("/internal/auth/jwt/validate")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.authenticated").isEqualTo(true)
            .jsonPath("$.authenticationType").isEqualTo("JWT")
            .jsonPath("$.principal").isEqualTo("enduser");
    }

    @Test
    void rejectsInvalidJwtAccessToken() {
        webTestClient.post()
            .uri("/internal/auth/jwt/validate")
            .header(HttpHeaders.AUTHORIZATION, "Bearer invalid-token")
            .exchange()
            .expectStatus().isUnauthorized();
    }

    private String basicAuth(String username, String password) {
        String token = Base64.getEncoder().encodeToString((username + ":" + password).getBytes(StandardCharsets.UTF_8));
        return "Basic " + token;
    }
}
