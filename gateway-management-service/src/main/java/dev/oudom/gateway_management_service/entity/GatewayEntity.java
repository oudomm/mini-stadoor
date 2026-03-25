package dev.oudom.gateway_management_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "gateways")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GatewayEntity {

    @Id
    @Column(nullable = false, updatable = false)
    private String gatewayId;

    @Column(nullable = false)
    private String gatewayName;

    @Column(nullable = false)
    private String description;
}
