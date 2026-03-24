package dev.oudom.route_management_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RouteManagementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RouteManagementServiceApplication.class, args);
	}

}
