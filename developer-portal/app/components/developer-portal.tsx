"use client";

import { useEffect, useState, useTransition } from "react";
import { Fingerprint } from "lucide-react";

import {
  futureSecurityModes,
  initialGatewayForm,
  initialRouteForm,
  initialServiceForm,
  type RecentActivityItem,
  supportedSecurityModes,
  type DeveloperPortalProps,
  type GatewayForm,
  type GatewaySummary,
  type GatewayWorkspaceTab,
  type RouteForm,
  type ServiceForm,
  type StatusState,
} from "@/app/components/developer-portal/model";
import { GatewayWorkspace } from "@/app/components/developer-portal/gateway-workspace";
import { OverviewPanel } from "@/app/components/developer-portal/overview-panel";
import { PlaceholderSection } from "@/app/components/developer-portal/ui";

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
  const selectedRouteGateway =
    gateways.find((gateway) => gateway.gatewayId === routeForm.gatewayId) ?? gateways[0] ?? null;
  const publicBasePath = routeForm.path.replace("/**", "");
  const exampleCall =
    publicBasePath && routeForm.serviceId ? `${publicBasePath} -> ${routeForm.uri || "lb://service-name"}` : publicBasePath || "/";

  const recentActivity: RecentActivityItem[] = [
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
  ].filter((item): item is RecentActivityItem => item !== null);

  return (
    <div className="space-y-6 px-6 py-6">
      {activeTab === "overview" ? (
        <OverviewPanel
          gatewayCount={gatewayCount}
          serviceCount={serviceCount}
          routeCount={routeCount}
          supportedModeCount={supportedModeCount}
          recentActivity={recentActivity}
        />
      ) : null}

      {activeTab === "gateway" ? (
        <GatewayWorkspace
          gatewayWorkspaceTab={gatewayWorkspaceTab}
          setGatewayWorkspaceTab={setGatewayWorkspaceTab}
          gatewayCount={gatewayCount}
          serviceCount={serviceCount}
          routeCount={routeCount}
          gatewayForm={gatewayForm}
          setGatewayForm={setGatewayForm}
          serviceForm={serviceForm}
          setServiceForm={setServiceForm}
          routeForm={routeForm}
          setRouteForm={setRouteForm}
          gateways={gateways}
          gatewayStatus={gatewayStatus}
          serviceStatus={serviceStatus}
          routeStatus={routeStatus}
          isPending={isPending}
          selectedRouteGateway={selectedRouteGateway}
          exampleCall={exampleCall}
          onCreateGateway={createGateway}
          onRegisterService={registerService}
          onCreateRoute={createRoute}
          onRouteGatewayChange={handleRouteGatewayChange}
          onRouteServiceChange={handleRouteServiceChange}
          onReloadGateways={() => {
            void loadGateways(routeForm.gatewayId, routeForm.serviceId);
          }}
        />
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
