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
@Table(name = "external_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExternalServiceEntity {

    @Column(nullable = false)
    private String gatewayId;

    @Id
    @Column(nullable = false, updatable = false)
    private String serviceId;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Integer port;

    @Column(nullable = false)
    private String tags;

    @Enumerated(EnumType.STRING)
    @Column
    private AuthType authType;

    @Column
    private String ownerUserUuid;

    @Column
    private String ownerUsername;

    @Column
    private String ownerEmail;
}
