"use client";

import type {
  FlattenedRouteSummary,
  GatewayRow,
  GatewaySummary,
  ProtectedGatewaySummary,
  ServiceSummary,
} from "@/components/mini-stadoor-ui/model";

export function toAllServices(gateways: GatewaySummary[]): ServiceSummary[] {
  return gateways.flatMap((gateway) => gateway.services);
}

export function toAllRoutes(gateways: GatewaySummary[], services: ServiceSummary[]): FlattenedRouteSummary[] {
  return services.flatMap((service) =>
    service.routes.map((route) => ({
      ...route,
      serviceName: service.serviceName,
      gatewayName: gateways.find((gateway) => gateway.gatewayId === route.gatewayId)?.gatewayName ?? route.gatewayId,
    })),
  );
}

export function toGatewayRows(gateways: GatewaySummary[]): GatewayRow[] {
  return gateways.map((gateway) => {
    const serviceTotal = gateway.services.length;
    const routeTotal = gateway.services.reduce((total, service) => total + service.routes.length, 0);
    const primaryAuth = gateway.authType ?? "NONE";

    return {
      gateway,
      serviceTotal,
      routeTotal,
      primaryAuth,
    };
  });
}

export function toProtectedGateways(gateways: GatewaySummary[]): ProtectedGatewaySummary[] {
  return gateways
    .filter((gateway) => (gateway.authType ?? "NONE") !== "NONE")
    .map((gateway) => ({
      gatewayId: gateway.gatewayId,
      gatewayName: gateway.gatewayName,
      authType: gateway.authType ?? "NONE",
      routeCount: gateway.services.reduce((total, service) => total + service.routes.length, 0),
      serviceCount: gateway.services.length,
    }));
}

export function countProtectedRoutes(routes: FlattenedRouteSummary[]): number {
  return routes.filter((route) => (route.authType ?? "NONE") !== "NONE").length;
}

export function countProtectedRoutesInGateway(gateway: GatewaySummary | null): number {
  if (!gateway) {
    return 0;
  }

  return gateway.services.reduce(
    (total, service) => total + service.routes.filter((route) => (route.authType ?? "NONE") !== "NONE").length,
    0,
  );
}
