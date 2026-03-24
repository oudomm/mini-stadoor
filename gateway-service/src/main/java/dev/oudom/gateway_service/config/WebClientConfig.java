package dev.oudom.gateway_service.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    @LoadBalanced
    @Qualifier("loadBalancedWebClientBuilder")
    WebClient.Builder loadBalancedWebClientBuilder() {
        return WebClient.builder();
    }
}
