"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Fingerprint,
  Network,
  RefreshCcw,
  Route,
  Server,
  Shield,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DashboardTab = "overview" | "gateway" | "iam";
type SupportedAuthType = "NONE" | "BASIC" | "API_KEY" | "JWT";
type FutureAuthType = "OAUTH2";
type GatewayWorkspaceTab = "gateway" | "service" | "route";

type GatewayForm = {
  gatewayId: string;
  gatewayName: string;
  description: string;
};

type ServiceForm = {
  gatewayId: string;
  serviceId: string;
  serviceName: string;
  address: string;
  port: string;
  tags: string;
};

type RouteForm = {
  gatewayId: string;
  serviceId: string;
  id: string;
  path: string;
  uri: string;
  authType: SupportedAuthType;
};

type RouteSummary = {
  gatewayId: string;
  serviceId: string;
  id: string;
  path: string;
  uri: string;
  authType?: SupportedAuthType;
};

type ServiceSummary = {
  gatewayId: string;
  serviceId: string;
  serviceName: string;
  address: string;
  port: number;
  tags: string[];
  routes: RouteSummary[];
};

type GatewaySummary = {
  gatewayId: string;
  gatewayName: string;
  description: string;
  services: ServiceSummary[];
};

type StatusState = {
  tone: "loading" | "success" | "error";
  message: string;
  payload?: unknown;
} | null;

type DeveloperPortalProps = {
  activeTab: DashboardTab;
};

const initialGatewayForm: GatewayForm = {
  gatewayId: "ecommerce-gateway",
  gatewayName: "E-Commerce Gateway",
  description: "Gateway workspace for catalog, cart, checkout, and customer-facing APIs.",
};

const initialServiceForm: ServiceForm = {
  gatewayId: "ecommerce-gateway",
  serviceId: "product-service-manual-1",
  serviceName: "product-service",
  address: "localhost",
  port: "8082",
  tags: "manual-registration,ecommerce,spring",
};

const initialRouteForm: RouteForm = {
  gatewayId: "ecommerce-gateway",
  serviceId: "product-service-manual-1",
  id: "product-route-open",
  path: "/open/products/**",
  uri: "lb://product-service",
  authType: "NONE",
};

const gatewayPresets = [
  {
    label: "E-Commerce",
    values: {
      gatewayId: "ecommerce-gateway",
      gatewayName: "E-Commerce Gateway",
      description: "Gateway workspace for catalog, cart, checkout, and customer-facing APIs.",
    },
  },
  {
    label: "Partner APIs",
    values: {
      gatewayId: "partner-gateway",
      gatewayName: "Partner Gateway",
      description: "Expose supplier and partner endpoints with isolated routing and security rules.",
    },
  },
] as const;

const servicePresets = [
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

const routePresets = [
  {
    label: "Open catalog",
    values: {
      gatewayId: "ecommerce-gateway",
      serviceId: "product-service-manual-1",
      id: "product-route-open",
      path: "/open/products/**",
      uri: "lb://product-service",
      authType: "NONE" as const,
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
      authType: "BASIC" as const,
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
      authType: "API_KEY" as const,
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
      authType: "JWT" as const,
    },
  },
] as const;

const supportedSecurityModes: Array<{
  label: SupportedAuthType;
  status: "live";
  detail: string;
}> = [
  { label: "NONE", status: "live", detail: "Open route with no gateway authentication." },
  { label: "BASIC", status: "live", detail: "Username and password validation through consumer-service." },
  { label: "API_KEY", status: "live", detail: "Shared key validation using the current gateway enforcement flow." },
  { label: "JWT", status: "live", detail: "Bearer access token validation through consumer-service login and token endpoints." },
];

const futureSecurityModes: Array<{
  label: FutureAuthType;
  status: "planned";
  detail: string;
}> = [
  { label: "OAUTH2", status: "planned", detail: "Future identity-driven security mode for broader IAM integration." },
];

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function DeveloperPortal({ activeTab }: DeveloperPortalProps) {
  const [gatewayForm, setGatewayForm] = useState<GatewayForm>(initialGatewayForm);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(initialServiceForm);
  const [routeForm, setRouteForm] = useState<RouteForm>(initialRouteForm);
  const [gatewayWorkspaceTab, setGatewayWorkspaceTab] = useState<GatewayWorkspaceTab>("gateway");
  const [gateways, setGateways] = useState<GatewaySummary[]>([]);
  const [gatewayStatus, setGatewayStatus] = useState<StatusState>(null);
  const [serviceStatus, setServiceStatus] = useState<StatusState>(null);
  const [routeStatus, setRouteStatus] = useState<StatusState>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    void loadGateways();
  }, []);

  async function loadGateways(preferredGatewayId?: string, preferredServiceId?: string) {
    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/gateways", { cache: "no-store" });
        const data = (await response.json().catch(() => ({ gateways: [] }))) as { gateways?: GatewaySummary[] };
        const gatewayList = Array.isArray(data.gateways) ? data.gateways : [];
        setGateways(gatewayList);
        syncSelections(gatewayList, preferredGatewayId, preferredServiceId);
      })();
    });
  }

  function syncSelections(
    gatewayList: GatewaySummary[],
    preferredGatewayId?: string,
    preferredServiceId?: string,
  ) {
    if (gatewayList.length === 0) {
      return;
    }

    const gatewayId =
      preferredGatewayId && gatewayList.some((gateway) => gateway.gatewayId === preferredGatewayId)
        ? preferredGatewayId
        : gatewayList.some((gateway) => gateway.gatewayId === serviceForm.gatewayId)
          ? serviceForm.gatewayId
          : gatewayList[0].gatewayId;

    const activeGateway = gatewayList.find((gateway) => gateway.gatewayId === gatewayId) ?? gatewayList[0];
    const serviceId =
      preferredServiceId && activeGateway.services.some((service) => service.serviceId === preferredServiceId)
        ? preferredServiceId
        : activeGateway.services.some((service) => service.serviceId === routeForm.serviceId)
          ? routeForm.serviceId
          : activeGateway.services[0]?.serviceId ?? "";

    const activeService = activeGateway.services.find((service) => service.serviceId === serviceId);

    setServiceForm((current) => ({
      ...current,
      gatewayId: activeGateway.gatewayId,
    }));

    setRouteForm((current) => ({
      ...current,
      gatewayId: activeGateway.gatewayId,
      serviceId,
      uri: activeService ? `lb://${activeService.serviceName}` : current.uri,
    }));
  }

  async function createGateway(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGatewayStatus({ tone: "loading", message: "Creating gateway..." });

    const response = await fetch("/api/gateways", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gatewayForm),
    });

    const data = await response.json().catch(() => ({ message: "Unable to parse response" }));
    setGatewayStatus({
      tone: response.ok ? "success" : "error",
      message: response.ok ? "Gateway created successfully." : "Failed to create gateway.",
      payload: data,
    });

    if (response.ok) {
      setServiceForm((current) => ({ ...current, gatewayId: gatewayForm.gatewayId }));
      setRouteForm((current) => ({ ...current, gatewayId: gatewayForm.gatewayId, serviceId: "" }));
      void loadGateways(gatewayForm.gatewayId);
    }
  }

  async function registerService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServiceStatus({ tone: "loading", message: "Registering service..." });

    const payload = {
      gatewayId: serviceForm.gatewayId,
      serviceId: serviceForm.serviceId,
      serviceName: serviceForm.serviceName,
      address: serviceForm.address,
      port: Number(serviceForm.port),
      tags: serviceForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const response = await fetch("/api/services/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({ message: "Unable to parse response" }));
    setServiceStatus({
      tone: response.ok ? "success" : "error",
      message: response.ok ? "Service registered successfully." : "Failed to register service.",
      payload: data,
    });

    if (response.ok) {
      setRouteForm((current) => ({
        ...current,
        gatewayId: serviceForm.gatewayId,
        serviceId: serviceForm.serviceId,
        uri: `lb://${serviceForm.serviceName}`,
      }));
      void loadGateways(serviceForm.gatewayId, serviceForm.serviceId);
    }
  }

  async function createRoute(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRouteStatus({ tone: "loading", message: "Creating route..." });

    const response = await fetch("/api/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(routeForm),
    });

    const data = await response.json().catch(() => ({ message: "Unable to parse response" }));
    setRouteStatus({
      tone: response.ok ? "success" : "error",
      message: response.ok ? "Route created and synced." : "Failed to create route.",
      payload: data,
    });

    if (response.ok) {
      void loadGateways(routeForm.gatewayId, routeForm.serviceId);
    }
  }

  function handleRouteGatewayChange(gatewayId: string) {
    const gateway = gateways.find((item) => item.gatewayId === gatewayId);
    const firstService = gateway?.services[0];

    setRouteForm((current) => ({
      ...current,
      gatewayId,
      serviceId: firstService?.serviceId ?? "",
      uri: firstService ? `lb://${firstService.serviceName}` : current.uri,
    }));
  }

  function handleRouteServiceChange(serviceId: string) {
    const service = selectedRouteGateway?.services.find((item) => item.serviceId === serviceId);
    setRouteForm((current) => ({
      ...current,
      serviceId,
      uri: service ? `lb://${service.serviceName}` : current.uri,
    }));
  }

  const allServices = gateways.flatMap((gateway) => gateway.services);
  const routes = allServices.flatMap((service) => service.routes);
  const supportedModeCount = supportedSecurityModes.length;
  const gatewayCount = gateways.length;
  const serviceCount = allServices.length;
  const routeCount = routes.length;
  const securedRoutes = routes.filter((route) => route.authType && route.authType !== "NONE").length;
  const basicRoutes = routes.filter((route) => route.authType === "BASIC").length;
  const apiKeyRoutes = routes.filter((route) => route.authType === "API_KEY").length;
  const selectedRouteGateway =
    gateways.find((gateway) => gateway.gatewayId === routeForm.gatewayId) ?? gateways[0] ?? null;
  const publicBasePath = routeForm.path.replace("/**", "");
  const exampleCall =
    publicBasePath && routeForm.serviceId ? `${publicBasePath} -> ${routeForm.uri || "lb://service-name"}` : publicBasePath || "/";

  const recentActivity = [
    gatewayStatus
      ? {
          title: gatewayStatus.message,
          meta: "Gateway workspace",
          tone: gatewayStatus.tone,
        }
      : null,
    serviceStatus
      ? {
          title: serviceStatus.message,
          meta: "Service onboarding",
          tone: serviceStatus.tone,
        }
      : null,
    routeStatus
      ? {
          title: routeStatus.message,
          meta: "Route publishing",
          tone: routeStatus.tone,
        }
      : null,
    {
      title: `${gatewayCount} gateway workspace${gatewayCount === 1 ? "" : "s"} in control plane`,
      meta: "Gateway catalog",
      tone: "success" as const,
    },
  ].filter(Boolean) as Array<{ title: string; meta: string; tone: "loading" | "success" | "error" }>;

  return (
    <div className="space-y-6 px-6 py-6">
      {activeTab === "overview" ? (
        <>
          <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <Card className="border-white/6 bg-[#131313] text-white shadow-none">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8fff8b]">
                      workspace_summary
                    </p>
                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                      Manage registered applications, gateway workspaces, and route security from one control plane.
                    </h2>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-white/52">
                      Create a gateway workspace, onboard services inside it, and publish protected routes without hardcoding
                      everything directly in the gateway.
                    </p>
                  </div>

                  <div className="rounded-[1rem] border border-[#00ff41]/20 bg-[#101610] px-5 py-4 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
                      live_status
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[#8fff8b]">Operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/6 bg-[#161616] text-white shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-white">Quick actions</CardTitle>
                <CardDescription className="text-white/42">
                  Start from the main workflow.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ActionLink title="Create gateway" body="Start a new workspace group for related services." href="/dashboard?tab=gateway" />
                <ActionLink title="Register application" body="Add a service into one of your gateway workspaces." href="/dashboard?tab=gateway" />
                <ActionLink title="Publish route" body="Expose a public path and attach a security type." href="/dashboard?tab=gateway" />
                <ActionLink title="Review IAM roadmap" body="Keep upcoming identity capabilities visible." href="/dashboard?tab=iam" />
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Gateways" value={String(gatewayCount)} accent="green" />
            <MetricCard label="Services" value={String(serviceCount)} accent="default" />
            <MetricCard label="Routes" value={String(routeCount)} accent="green" />
            <MetricCard label="Live controls" value={String(supportedModeCount)} accent="cyan" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Card className="border-white/6 bg-[#151515] text-white shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Live modules</CardTitle>
                <CardDescription className="text-white/42">
                  Main surfaces available in the current workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ModuleRow icon={<Network className="h-4 w-4" />} title="Gateway workspaces" meta="Group services and routes by project boundary." />
                <ModuleRow icon={<Server className="h-4 w-4" />} title="Application registry" meta="Register backend services into a selected gateway." />
                <ModuleRow icon={<Route className="h-4 w-4" />} title="Dynamic routes" meta="Publish runtime routes through the control plane." />
                <ModuleRow icon={<ShieldCheck className="h-4 w-4" />} title="Security controls" meta="Use live route protection and keep roadmap controls visible." />
              </CardContent>
            </Card>

            <Card className="border-white/6 bg-[#151515] text-white shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Recent activity</CardTitle>
                <CardDescription className="text-white/42">
                  Latest workspace events across gateway creation, onboarding, and route publishing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((item, index) => (
                  <ActivityRow key={`${item.title}-${index}`} title={item.title} meta={item.meta} tone={item.tone} />
                ))}
              </CardContent>
            </Card>
          </section>
        </>
      ) : null}

      {activeTab === "gateway" ? (
        <section className="space-y-6">
          <Card className="border-white/6 bg-[#131313] text-white shadow-none">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8fff8b]">
                    gateway_workflow
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                    Manage the full gateway flow from one page.
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-8 text-white/52">
                    Create a gateway first, register services inside it, then publish protected routes. Everything stays on
                    one screen, but each step has its own workspace tab for cleaner management.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <MiniWorkspaceStat label="Gateways" value={String(gatewayCount)} />
                  <MiniWorkspaceStat label="Services" value={String(serviceCount)} />
                  <MiniWorkspaceStat label="Routes" value={String(routeCount)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <WorkspaceStepTab
              label="1. Create Gateway"
              active={gatewayWorkspaceTab === "gateway"}
              onClick={() => setGatewayWorkspaceTab("gateway")}
            />
            <WorkspaceStepTab
              label="2. Register Service"
              active={gatewayWorkspaceTab === "service"}
              onClick={() => setGatewayWorkspaceTab("service")}
            />
            <WorkspaceStepTab
              label="3. Create Route"
              active={gatewayWorkspaceTab === "route"}
              onClick={() => setGatewayWorkspaceTab("route")}
            />
          </div>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              {gatewayWorkspaceTab === "gateway" ? (
                <Card className="border-white/6 bg-[#151515] text-white shadow-none">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-white">Create a gateway</CardTitle>
                    <CardDescription className="text-white/42">
                      Start with the top-level workspace, such as e-commerce or partner APIs, before onboarding services and routes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {gatewayPresets.map((preset) => (
                        <Button
                          key={preset.label}
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="border-white/8 bg-[#1d1d1d] text-white hover:bg-[#252525]"
                          onClick={() => setGatewayForm({ ...preset.values })}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>

                    <form className="space-y-4" onSubmit={createGateway}>
                      <FormField label="Gateway ID">
                        <Input
                          className="border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={gatewayForm.gatewayId}
                          onChange={(event) => setGatewayForm({ ...gatewayForm, gatewayId: event.target.value })}
                          placeholder="ecommerce-gateway"
                        />
                      </FormField>
                      <FormField label="Gateway name">
                        <Input
                          className="border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={gatewayForm.gatewayName}
                          onChange={(event) => setGatewayForm({ ...gatewayForm, gatewayName: event.target.value })}
                          placeholder="E-Commerce Gateway"
                        />
                      </FormField>
                      <FormField label="Description">
                        <Textarea
                          className="min-h-[96px] border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={gatewayForm.description}
                          onChange={(event) => setGatewayForm({ ...gatewayForm, description: event.target.value })}
                          placeholder="Gateway workspace for checkout, catalog, and customer APIs."
                        />
                      </FormField>
                      <Button
                        type="submit"
                        variant="brand"
                        className="h-12 w-full rounded-[0.9rem] border border-[#00ff41]/30 bg-[#00ff41] text-black hover:bg-[#7cff98]"
                      >
                        Create gateway
                      </Button>
                    </form>
                    <StatusCard status={gatewayStatus} />
                  </CardContent>
                </Card>
              ) : null}

              {gatewayWorkspaceTab === "service" ? (
                <Card className="border-white/6 bg-[#151515] text-white shadow-none">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-white">Register service</CardTitle>
                    <CardDescription className="text-white/42">
                      Register an API into a selected gateway so routing and security stay grouped in one place.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {servicePresets.map((preset) => (
                        <Button
                          key={preset.label}
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="border-white/8 bg-[#1d1d1d] text-white hover:bg-[#252525]"
                          onClick={() => setServiceForm({ ...preset.values })}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>

                    <form className="grid gap-4 md:grid-cols-2" onSubmit={registerService}>
                      <FormField label="Gateway">
                        <select
                          className="flex h-12 w-full rounded-2xl border border-white/8 bg-[#1b1b1b] px-4 py-3 text-sm text-white outline-none transition focus-visible:border-[#00ff41]/35 focus-visible:ring-4 focus-visible:ring-[#00ff41]/10"
                          value={serviceForm.gatewayId}
                          onChange={(event) => setServiceForm({ ...serviceForm, gatewayId: event.target.value })}
                        >
                          {gateways.length === 0 ? <option value="">Create a gateway first</option> : null}
                          {gateways.map((gateway) => (
                            <option key={gateway.gatewayId} value={gateway.gatewayId}>
                              {gateway.gatewayName}
                            </option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="Service instance ID">
                        <Input
                          className="border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={serviceForm.serviceId}
                          onChange={(event) => setServiceForm({ ...serviceForm, serviceId: event.target.value })}
                          placeholder="product-service-manual-1"
                        />
                      </FormField>
                      <FormField label="Service name">
                        <Input
                          className="border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={serviceForm.serviceName}
                          onChange={(event) => setServiceForm({ ...serviceForm, serviceName: event.target.value })}
                          placeholder="product-service"
                        />
                      </FormField>
                      <FormField label="Address">
                        <Input
                          className="border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={serviceForm.address}
                          onChange={(event) => setServiceForm({ ...serviceForm, address: event.target.value })}
                          placeholder="localhost"
                        />
                      </FormField>
                      <FormField label="Port">
                        <Input
                          className="border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={serviceForm.port}
                          onChange={(event) => setServiceForm({ ...serviceForm, port: event.target.value })}
                          placeholder="8082"
                        />
                      </FormField>
                      <div className="md:col-span-2">
                        <FormField label="Tags">
                          <Textarea
                            className="min-h-[96px] border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                            value={serviceForm.tags}
                            onChange={(event) => setServiceForm({ ...serviceForm, tags: event.target.value })}
                            placeholder="manual-registration,ecommerce"
                          />
                        </FormField>
                      </div>
                      <div className="md:col-span-2">
                        <Button
                          type="submit"
                          variant="brand"
                          disabled={gateways.length === 0}
                          className="h-12 w-full rounded-[0.9rem] border border-[#00ff41]/30 bg-[#00ff41] text-black hover:bg-[#7cff98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Register service
                        </Button>
                      </div>
                    </form>
                    <StatusCard status={serviceStatus} />
                  </CardContent>
                </Card>
              ) : null}

              {gatewayWorkspaceTab === "route" ? (
                <Card className="border-white/6 bg-[#151515] text-white shadow-none">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-white">Publish route</CardTitle>
                    <CardDescription className="text-white/42">
                      Pick the gateway, choose one of its services, then attach the public path and security type.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      {routePresets.map((preset) => (
                        <Button
                          key={preset.label}
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="border-white/8 bg-[#1d1d1d] text-white hover:bg-[#252525]"
                          onClick={() => setRouteForm({ ...preset.values })}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>

                    <div className="grid gap-3 rounded-[1rem] border border-white/8 bg-[#1a1a1a] p-4 md:grid-cols-3">
                      <PreviewStat label="Gateway" value={routeForm.gatewayId || "select_gateway"} />
                      <PreviewStat label="Security policy" value={routeForm.authType} />
                      <PreviewStat label="Example request" value={exampleCall} mono />
                    </div>

                    <form className="space-y-4" onSubmit={createRoute}>
                      <FormField label="Gateway">
                        <select
                          className="flex h-12 w-full rounded-2xl border border-white/8 bg-[#1b1b1b] px-4 py-3 text-sm text-white outline-none transition focus-visible:border-[#00ff41]/35 focus-visible:ring-4 focus-visible:ring-[#00ff41]/10"
                          value={routeForm.gatewayId}
                          onChange={(event) => handleRouteGatewayChange(event.target.value)}
                        >
                          {gateways.length === 0 ? <option value="">Create a gateway first</option> : null}
                          {gateways.map((gateway) => (
                            <option key={gateway.gatewayId} value={gateway.gatewayId}>
                              {gateway.gatewayName}
                            </option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="Service">
                        <select
                          className="flex h-12 w-full rounded-2xl border border-white/8 bg-[#1b1b1b] px-4 py-3 text-sm text-white outline-none transition focus-visible:border-[#00ff41]/35 focus-visible:ring-4 focus-visible:ring-[#00ff41]/10"
                          value={routeForm.serviceId}
                          onChange={(event) => handleRouteServiceChange(event.target.value)}
                        >
                          {!selectedRouteGateway?.services.length ? <option value="">Register a service first</option> : null}
                          {selectedRouteGateway?.services.map((service) => (
                            <option key={service.serviceId} value={service.serviceId}>
                              {service.serviceName} ({service.serviceId})
                            </option>
                          ))}
                        </select>
                      </FormField>
                      <FormField label="Route ID">
                        <Input
                          className="border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={routeForm.id}
                          onChange={(event) => setRouteForm({ ...routeForm, id: event.target.value })}
                          placeholder="product-route-basic"
                        />
                      </FormField>
                      <FormField label="Public path">
                        <Input
                          className="border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={routeForm.path}
                          onChange={(event) => setRouteForm({ ...routeForm, path: event.target.value })}
                          placeholder="/basic/products/**"
                        />
                      </FormField>
                      <FormField label="Target URI">
                        <Input
                          className="border-white/8 bg-[#1b1b1b] text-white placeholder:text-white/24 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                          value={routeForm.uri}
                          onChange={(event) => setRouteForm({ ...routeForm, uri: event.target.value })}
                          placeholder="lb://product-service"
                        />
                      </FormField>
                      <FormField label="Auth Type">
                        <select
                          className="flex h-12 w-full rounded-2xl border border-white/8 bg-[#1b1b1b] px-4 py-3 text-sm text-white outline-none transition focus-visible:border-[#00ff41]/35 focus-visible:ring-4 focus-visible:ring-[#00ff41]/10"
                          value={routeForm.authType}
                          onChange={(event) =>
                            setRouteForm({
                              ...routeForm,
                              authType: event.target.value as SupportedAuthType,
                            })
                          }
                        >
                          {supportedSecurityModes.map((mode) => (
                            <option key={mode.label} value={mode.label}>
                              {mode.label}
                            </option>
                          ))}
                        </select>
                      </FormField>
                      <div className="rounded-[1rem] border border-dashed border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white/52">
                        Route security belongs to the gateway workspace. This prototype currently publishes live routes with
                        <span className="text-white"> NONE</span>, <span className="text-white"> BASIC</span>, and
                        <span className="text-white"> API_KEY</span>, while <span className="text-white">JWT</span> and
                        <span className="text-white">OAuth2/OIDC</span> stay visible as the next step.
                      </div>
                      <Button
                        type="submit"
                        disabled={!routeForm.gatewayId || !routeForm.serviceId}
                        className="h-12 w-full rounded-[0.9rem] border border-[#00ff41]/30 bg-[#00ff41] text-black hover:bg-[#7cff98] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Publish route
                      </Button>
                    </form>
                    <StatusCard status={routeStatus} />
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <Card className="border-white/6 bg-[#151515] text-white shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Flow guide</CardTitle>
                <CardDescription className="text-white/42">
                  Keep the gateway setup organized from top to bottom.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <StepHint
                  index="01"
                  title="Create gateway"
                  body="Use a gateway as the top-level project group for related services and routes."
                  active={gatewayWorkspaceTab === "gateway"}
                />
                <StepHint
                  index="02"
                  title="Register service"
                  body="Add a service into the selected gateway so it becomes available for dynamic route publishing."
                  active={gatewayWorkspaceTab === "service"}
                />
                <StepHint
                  index="03"
                  title="Create route"
                  body="Attach a public path and security mode to one service inside the gateway."
                  active={gatewayWorkspaceTab === "route"}
                />
                <div className="grid gap-3 rounded-[1rem] border border-white/8 bg-[#1a1a1a] p-4 md:grid-cols-3">
                  <PreviewStat label="Gateway" value={routeForm.gatewayId || "select_gateway"} />
                  <PreviewStat label="Security policy" value={routeForm.authType} />
                  <PreviewStat label="Example request" value={exampleCall} mono />
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-white/6 bg-[#151515] text-white shadow-none">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-semibold text-white">Gateway map</CardTitle>
                  <CardDescription className="text-white/42">
                    Browse gateways, their services, and the routes already attached to each service.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="border-white/8 bg-[#1d1d1d] text-white hover:bg-[#252525]"
                  onClick={() => void loadGateways(routeForm.gatewayId, routeForm.serviceId)}
                >
                  <RefreshCcw className="h-4 w-4" />
                  {isPending ? "Syncing" : "Refresh"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {gateways.length === 0 ? (
                  <EmptyState message="Create a gateway, then add services and routes to see the hierarchy here." />
                ) : (
                  gateways.map((gateway) => <GatewayTree key={gateway.gatewayId} gateway={gateway} />)
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-white/6 bg-[#151515] text-white shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white">Workspace inventory</CardTitle>
                  <CardDescription className="text-white/42">
                    Current gateway groups that own services and routes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {gateways.length === 0 ? (
                    <EmptyState message="No gateways created yet. Start with a workspace like e-commerce or partner APIs." />
                  ) : (
                    gateways.map((gateway) => (
                      <GatewayRow key={gateway.gatewayId} gateway={gateway} />
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/6 bg-[#151515] text-white shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-white">Quick test matrix</CardTitle>
                  <CardDescription className="text-white/42">
                    Use these calls to explain the current prototype during demo or viva.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <QuickLink label="Open route" value="GET http://localhost:8080/open/products" />
                  <QuickLink label="Basic route" value="GET http://localhost:8080/basic/products with Basic Auth" />
                  <QuickLink label="API key route" value="GET http://localhost:8080/partner/inventory with X-API-Key" />
                  <QuickLink label="JWT route" value="POST http://localhost:8081/api/login then GET http://localhost:8080/jwt/products with Bearer token" />
                </CardContent>
              </Card>
            </div>
          </section>
        </section>
      ) : null}

      {activeTab === "iam" ? (
        <PlaceholderSection
          icon={<Fingerprint className="h-5 w-5" />}
          title="IAM module is planned"
          body="Mini Stadoor’s IAM module should cover identity lifecycle, login, access and refresh tokens, OAuth2 with OIDC, and role-aware access management for registered applications."
        />
      ) : null}

    </div>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "green" | "default" | "cyan";
}) {
  const accentText =
    accent === "green" ? "text-[#8fff8b]" : accent === "cyan" ? "text-[#9ef0ff]" : "text-white";
  return (
    <Card className="border-white/6 bg-[#151515] text-white shadow-none">
      <CardContent className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/34">{label}</p>
        <p className={`mt-4 text-5xl font-semibold tracking-[-0.05em] ${accentText}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function RolloutRow({
  label,
  status,
}: {
  label: string;
  status: "live" | "planned";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[0.9rem] border border-white/6 bg-black/20 px-4 py-4">
      <p className="text-sm text-white">{label}</p>
      <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${status === "live" ? "text-[#8fff8b]" : "text-white/34"}`}>
        {status}
      </span>
    </div>
  );
}

function CapabilityCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1rem] border border-white/6 bg-black/20 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1c2c1f] text-[#8fff8b]">
        {icon}
      </div>
      <p className="mt-4 text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-white/54">{body}</p>
    </div>
  );
}

function ModuleRow({
  icon,
  title,
  meta,
}: {
  icon: ReactNode;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[0.95rem] border border-white/6 bg-black/20 px-4 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1c2c1f] text-[#8fff8b]">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-white/48">{meta}</p>
      </div>
    </div>
  );
}

function WorkspaceStepTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "border-[#00ff41]/35 bg-[#00ff41] text-black"
          : "border-white/10 bg-[#171717] text-white/68 hover:border-white/20 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function MiniWorkspaceStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-[#171717] px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/32">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function StepHint({
  index,
  title,
  body,
  active,
}: {
  index: string;
  title: string;
  body: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-[1rem] border px-4 py-4 ${
        active ? "border-[#00ff41]/24 bg-[#101610]" : "border-white/6 bg-black/20"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
          {index}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-2 text-sm leading-7 text-white/52">{body}</p>
        </div>
      </div>
    </div>
  );
}

function ActionLink({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between gap-4 rounded-[0.95rem] border border-white/6 bg-black/20 px-4 py-4 transition hover:border-white/12 hover:bg-white/5"
    >
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-white/48">{body}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-white/30" />
    </a>
  );
}


function SecurityBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "warn";
}) {
  const width = Number.parseInt(value, 10);
  const color = tone === "good" ? "from-[#7cff98] to-[#00ff41]" : "from-[#ffd166] to-[#ff7a59]";
  const textColor = tone === "good" ? "text-[#8fff8b]" : "text-[#ffd27a]";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className={`text-sm font-semibold ${textColor}`}>{value}</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-white/8">
        <div className={`h-2 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] uppercase tracking-[0.2em] text-white/40">{label}</Label>
      {children}
    </div>
  );
}

function PreviewStat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[0.85rem] border border-white/6 bg-black/20 p-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/34">{label}</p>
      <p className={`mt-2 text-sm font-semibold text-white ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function SecurityRow({
  icon,
  label,
  status,
  description,
}: {
  icon: ReactNode;
  label: string;
  status: "live" | "planned";
  description: string;
}) {
  return (
    <div className="rounded-[0.9rem] border border-white/6 bg-black/20 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-[#8fff8b]">{icon}</div>
          <p className="text-sm font-medium text-white">{label}</p>
        </div>
        <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${status === "live" ? "text-[#8fff8b]" : "text-white/34"}`}>
          {status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-white/52">{description}</p>
    </div>
  );
}

function RouteRow({ route }: { route: RouteSummary }) {
  const authType = route.authType ?? "NONE";
  const authTone =
    authType === "BASIC" ? "text-[#ffd27a]" : authType === "API_KEY" ? "text-[#9ef0ff]" : authType === "JWT" ? "text-[#8fff8b]" : "text-white/55";

  return (
    <div className="rounded-[1rem] border border-white/6 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{route.id}</p>
          <p className="mt-1 text-sm text-white/42">{route.path}</p>
        </div>
        <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${authTone}`}>{authType}</span>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/34">
        {route.gatewayId} / {route.serviceId}
      </p>
      <code className="mt-3 block rounded-lg bg-[#121212] px-3 py-2 text-xs text-[#8fff8b]">{route.uri}</code>
    </div>
  );
}

function GatewayRow({ gateway }: { gateway: GatewaySummary }) {
  return (
    <div className="rounded-[1rem] border border-white/6 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{gateway.gatewayName}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.18em] text-white/34">{gateway.gatewayId}</p>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fff8b]">
          {gateway.services.length} service{gateway.services.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-white/52">{gateway.description || "No description yet."}</p>
    </div>
  );
}

function GatewayTree({ gateway }: { gateway: GatewaySummary }) {
  return (
    <div className="rounded-[1.1rem] border border-white/6 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{gateway.gatewayName}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/34">{gateway.gatewayId}</p>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fff8b]">
          {gateway.services.length} service{gateway.services.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-white/52">{gateway.description || "No description yet."}</p>

      <div className="mt-4 space-y-3">
        {gateway.services.length === 0 ? (
          <EmptyState message="No services in this gateway yet." />
        ) : (
          gateway.services.map((service) => (
            <div key={service.serviceId} className="rounded-[1rem] border border-white/6 bg-[#111111] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{service.serviceName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/34">{service.serviceId}</p>
                  <p className="mt-2 text-sm text-white/48">
                    {service.address}:{service.port}
                  </p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ef0ff]">
                  {service.routes.length} route{service.routes.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/48">{service.tags.join(", ") || "No tags"}</p>
              <div className="mt-4 space-y-3">
                {service.routes.length === 0 ? (
                  <EmptyState message="No routes attached to this service yet." />
                ) : (
                  service.routes.map((route) => <RouteRow key={route.id} route={route} />)
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActivityRow({
  title,
  meta,
  tone,
}: {
  title: string;
  meta: string;
  tone: "loading" | "success" | "error";
}) {
  const dotClass =
    tone === "success" ? "bg-[#00ff41]" : tone === "error" ? "bg-[#ff7a59]" : "bg-[#ffd166]";

  return (
    <div className="rounded-[1rem] border border-white/6 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-white/42">{meta}</p>
        </div>
        <span className={`mt-1 inline-flex h-3 w-3 rounded-full ${dotClass}`} />
      </div>
    </div>
  );
}

function QuickLink({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-white/6 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white">{label}</p>
          <code className="mt-2 block text-xs leading-6 text-white/42">{value}</code>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 text-white/30" />
      </div>
    </div>
  );
}

function StatusCard({ status }: { status: StatusState }) {
  if (!status) {
    return null;
  }

  const toneClass =
    status.tone === "success"
      ? "border-[#00ff41]/14 bg-[#0f180f]"
      : status.tone === "error"
        ? "border-[#ff7a59]/18 bg-[#1b1210]"
        : "border-white/8 bg-[#1a1a1a]";

  return (
    <div className={`rounded-[1rem] border p-4 ${toneClass}`}>
      <div className="flex items-center gap-3">
        <Activity className="h-4 w-4 text-white/55" />
        <p className="font-semibold text-white">{status.message}</p>
      </div>
      {status.payload ? (
        <pre className="mt-3 overflow-auto rounded-[0.9rem] bg-[#0e0e0e] p-4 text-xs leading-6 text-white/72">
          {pretty(status.payload)}
        </pre>
      ) : null}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[1rem] border border-dashed border-white/10 bg-black/20 px-4 py-6 text-center text-sm text-white/42">
      {message}
    </div>
  );
}

function PlaceholderSection({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="border-white/6 bg-[#151515] text-white shadow-none">
      <CardContent className="p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#1c2c1f] text-[#8fff8b]">
          {icon}
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-white">{title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-white/54">{body}</p>
      </CardContent>
    </Card>
  );
}
