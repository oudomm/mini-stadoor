package dev.oudom.gateway_management_service.entity;

import dev.oudom.gateway_management_service.dto.AuthType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "gateway_routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RouteEntity {

    @Column(nullable = false)
    private String gatewayId;

    @Column(nullable = false)
    private String serviceId;

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @Column(nullable = false)
    private String path;

    @Column(nullable = false)
    private String uri;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthType authType;

}
