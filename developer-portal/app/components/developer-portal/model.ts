"use client";

export type DashboardTab =
  | "dashboard"
  | "gateways"
  | "services"
  | "routes"
  | "consumers"
  | "settings";
export type SupportedAuthType = "NONE" | "BASIC" | "API_KEY" | "JWT";
export type FutureAuthType = "OAUTH2";
export type GatewayAuthType = SupportedAuthType | FutureAuthType;
export type GatewayWorkspaceTab = "gateway" | "service" | "route";
export type GatewayWorkspaceType = "API" | "BFF";

export type GatewayForm = {
  gatewayId: string;
  gatewayName: string;
  description: string;
  authType: GatewayAuthType;
  workspaceType: GatewayWorkspaceType;
};

export type ServiceForm = {
  gatewayId: string;
  serviceId: string;
  serviceName: string;
  address: string;
  port: string;
  tags: string;
};

export type RouteForm = {
  gatewayId: string;
  serviceId: string;
  id: string;
  path: string;
  uri: string;
};

export type RouteSummary = {
  gatewayId: string;
  serviceId: string;
  id: string;
  path: string;
  uri: string;
  authType?: GatewayAuthType;
};

export type ServiceSummary = {
  gatewayId: string;
  serviceId: string;
  serviceName: string;
  address: string;
  port: number;
  tags: string[];
  authType?: GatewayAuthType;
  routes: RouteSummary[];
};

export type GatewaySummary = {
  gatewayId: string;
  gatewayName: string;
  description: string;
  workspaceId?: string;
  workspaceName?: string;
  workspaceType?: GatewayWorkspaceType;
  authType?: GatewayAuthType;
  services: ServiceSummary[];
};

export type StatusState = {
  tone: "loading" | "success" | "error";
  message: string;
  payload?: unknown;
} | null;

export type ConsumerSummary = {
  id: string;
  gatewayId: string;
  consumerName: string;
  username: string;
  apiKeyPreview: string;
  status: string;
  createdAt: string;
};

export type ConsumerForm = {
  gatewayId: string;
  consumerName: string;
  username: string;
  password: string;
};

export type ConsumerLoginForm = {
  gatewayId: string;
  username: string;
  password: string;
};

export type ConsumerRegistrationResult = {
  id: string;
  gatewayId: string;
  consumerName: string;
  username: string;
  apiKey: string;
};

export type ConsumerTokenResult = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  principal: string;
  gatewayId: string;
};

export type ConsumerTokenValidationResult = {
  authenticated: boolean;
  authenticationType: string;
  principal: string;
};

export type DeveloperPortalProps = {
  activeTab: DashboardTab;
  operatorName?: string;
  operatorEmail?: string;
};

export type RecentActivityItem = {
  title: string;
  meta: string;
  tone: "loading" | "success" | "error";
};

export const initialGatewayForm: GatewayForm = {
  gatewayId: "ecommerce-gateway",
  gatewayName: "E-Commerce Gateway",
  description: "Gateway workspace for catalog, cart, checkout, and customer-facing APIs.",
  authType: "NONE",
  workspaceType: "API",
};

export const initialServiceForm: ServiceForm = {
  gatewayId: "ecommerce-gateway",
  serviceId: "product-service-manual-1",
  serviceName: "product-service",
  address: "localhost",
  port: "8082",
  tags: "manual-registration,ecommerce,spring",
};

export const initialRouteForm: RouteForm = {
  gatewayId: "ecommerce-gateway",
  serviceId: "product-service-manual-1",
  id: "product-route-open",
  path: "/open/products/**",
  uri: "lb://product-service",
};

export const initialConsumerForm: ConsumerForm = {
  gatewayId: "ecommerce-gateway",
  consumerName: "Partner Client 1",
  username: "partner-client-1",
  password: "qwer1234",
};

export const initialConsumerLoginForm: ConsumerLoginForm = {
  gatewayId: "ecommerce-gateway",
  username: "",
  password: "",
};

export const gatewayPresets = [
  {
    label: "E-Commerce",
    values: {
      gatewayId: "ecommerce-gateway",
      gatewayName: "E-Commerce Gateway",
      description: "Gateway workspace for catalog, cart, checkout, and customer-facing APIs.",
      authType: "JWT" as const,
      workspaceType: "API" as const,
    },
  },
  {
    label: "Partner APIs",
    values: {
      gatewayId: "partner-gateway",
      gatewayName: "Partner Gateway",
      description: "Expose supplier and partner endpoints with isolated routing and security rules.",
      authType: "API_KEY" as const,
      workspaceType: "API" as const,
    },
  },
] as const;

export const servicePresets = [
  {
    label: "Product API",
    values: {
      gatewayId: "ecommerce-gateway",
      serviceId: "product-service-manual-1",
      serviceName: "product-service",
      address: "localhost",
      port: "8082",
      tags: "manual-registration,ecommerce,spring",
    },
  },
  {
    label: "Inventory API",
    values: {
      gatewayId: "ecommerce-gateway",
      serviceId: "inventory-service-manual-1",
      serviceName: "inventory-service",
      address: "localhost",
      port: "8090",
      tags: "manual-registration,ecommerce,express",
    },
  },
  {
    label: "Customer API",
    values: {
      gatewayId: "ecommerce-gateway",
      serviceId: "customer-service-manual-1",
      serviceName: "customer-service",
      address: "localhost",
      port: "8091",
      tags: "manual-registration,ecommerce,fastapi",
    },
  },
] as const;

export const routePresets = [
  {
    label: "Open catalog",
    values: {
      gatewayId: "ecommerce-gateway",
      serviceId: "product-service-manual-1",
      id: "product-route-open",
      path: "/open/products/**",
      uri: "lb://product-service",
    },
  },
  {
    label: "Basic catalog",
    values: {
      gatewayId: "ecommerce-gateway",
      serviceId: "product-service-manual-1",
      id: "product-route-basic",
      path: "/basic/products/**",
      uri: "lb://product-service",
    },
  },
  {
    label: "API key inventory",
    values: {
      gatewayId: "ecommerce-gateway",
      serviceId: "inventory-service-manual-1",
      id: "inventory-route-api-key",
      path: "/partner/inventory/**",
      uri: "lb://inventory-service",
    },
  },
  {
    label: "JWT catalog",
    values: {
      gatewayId: "ecommerce-gateway",
      serviceId: "product-service-manual-1",
      id: "product-route-jwt",
      path: "/jwt/products/**",
      uri: "lb://product-service",
    },
  },
] as const;

export const supportedSecurityModes: Array<{
  label: SupportedAuthType;
  status: "live";
  detail: string;
}> = [
  { label: "NONE", status: "live", detail: "Open route with no gateway authentication." },
  { label: "BASIC", status: "live", detail: "Username and password validation through consumer-service." },
  { label: "API_KEY", status: "live", detail: "Shared key validation using the current gateway enforcement flow." },
  { label: "JWT", status: "live", detail: "Bearer access token validation through consumer-service login and token endpoints." },
];

export const futureSecurityModes: Array<{
  label: FutureAuthType;
  status: "planned";
  detail: string;
}> = [
  { label: "OAUTH2", status: "planned", detail: "Future identity-driven security mode for broader IAM integration." },
];

export function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}
