"use client";

import type { FormEvent } from "react";
import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  gatewayPresets,
  routePresets,
  servicePresets,
  type GatewayForm,
  type GatewaySummary,
  type GatewayWorkspaceTab,
  type RouteForm,
  type ServiceForm,
  type StatusState,
} from "@/app/components/developer-portal/model";
import {
  EmptyState,
  FormField,
  GatewayRow,
  GatewayTree,
  MiniWorkspaceStat,
  PreviewStat,
  QuickLink,
  StatusCard,
  StepHint,
  WorkspaceStepTab,
} from "@/app/components/developer-portal/ui";

type GatewayWorkspaceProps = {
  gatewayWorkspaceTab: GatewayWorkspaceTab;
  setGatewayWorkspaceTab: (tab: GatewayWorkspaceTab) => void;
  gatewayCount: number;
  serviceCount: number;
  routeCount: number;
  gatewayForm: GatewayForm;
  setGatewayForm: (value: GatewayForm | ((current: GatewayForm) => GatewayForm)) => void;
  serviceForm: ServiceForm;
  setServiceForm: (value: ServiceForm | ((current: ServiceForm) => ServiceForm)) => void;
  routeForm: RouteForm;
  setRouteForm: (value: RouteForm | ((current: RouteForm) => RouteForm)) => void;
  gateways: GatewaySummary[];
  gatewayStatus: StatusState;
  serviceStatus: StatusState;
  routeStatus: StatusState;
  isPending: boolean;
  selectedRouteGateway: GatewaySummary | null;
  exampleCall: string;
  onCreateGateway: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onRegisterService: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onCreateRoute: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onRouteGatewayChange: (gatewayId: string) => void;
  onRouteServiceChange: (serviceId: string) => void;
  onReloadGateways: () => void;
};

export function GatewayWorkspace({
  gatewayWorkspaceTab,
  setGatewayWorkspaceTab,
  gatewayCount,
  serviceCount,
  routeCount,
  gatewayForm,
  setGatewayForm,
  serviceForm,
  setServiceForm,
  routeForm,
  setRouteForm,
  gateways,
  gatewayStatus,
  serviceStatus,
  routeStatus,
  isPending,
  selectedRouteGateway,
  exampleCall,
  onCreateGateway,
  onRegisterService,
  onCreateRoute,
  onRouteGatewayChange,
  onRouteServiceChange,
  onReloadGateways,
}: GatewayWorkspaceProps) {
  const inheritedSecurity =
    selectedRouteGateway?.authType ||
    gateways.find((gateway) => gateway.gatewayId === routeForm.gatewayId)?.authType ||
    "NONE";

  return (
    <section className="space-y-6">
      <div className="animate-panel rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_84%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_74%,transparent)_100%)] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
              gateway_workflow
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
              Create, group, and publish from one workspace.
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--text-muted)]">
              Move through gateway creation, service onboarding, and route publishing in one operational surface, then
              verify the structure in the live map.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniWorkspaceStat label="Gateways" value={String(gatewayCount)} />
            <MiniWorkspaceStat label="Services" value={String(serviceCount)} />
            <MiniWorkspaceStat label="Routes" value={String(routeCount)} />
          </div>
        </div>
      </div>

      <div className="animate-panel flex flex-wrap gap-3" style={{ animationDelay: "70ms" }}>
        <WorkspaceStepTab label="1. Create Gateway" active={gatewayWorkspaceTab === "gateway"} onClick={() => setGatewayWorkspaceTab("gateway")} />
        <WorkspaceStepTab label="2. Register Service" active={gatewayWorkspaceTab === "service"} onClick={() => setGatewayWorkspaceTab("service")} />
        <WorkspaceStepTab label="3. Create Route" active={gatewayWorkspaceTab === "route"} onClick={() => setGatewayWorkspaceTab("route")} />
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          {gatewayWorkspaceTab === "gateway" ? (
            <Card className="animate-panel border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_96%,var(--background))_0%,var(--surface)_100%)] text-[var(--text-strong)] shadow-none" style={{ animationDelay: "120ms" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-[var(--text-strong)]">Create a gateway</CardTitle>
                <CardDescription className="text-[var(--text-muted)]">
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
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--surface-muted)] text-[var(--text-strong)] hover:bg-[var(--surface-soft)]"
                      onClick={() => setGatewayForm({ ...preset.values })}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>

                <form className="space-y-4" onSubmit={onCreateGateway}>
                  <FormField label="Gateway ID">
                    <Input
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={gatewayForm.gatewayId}
                      onChange={(event) => setGatewayForm({ ...gatewayForm, gatewayId: event.target.value })}
                      placeholder="ecommerce-gateway"
                    />
                  </FormField>
                  <FormField label="Gateway name">
                    <Input
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={gatewayForm.gatewayName}
                      onChange={(event) => setGatewayForm({ ...gatewayForm, gatewayName: event.target.value })}
                      placeholder="E-Commerce Gateway"
                    />
                  </FormField>
                  <FormField label="Description">
                    <Textarea
                      className="min-h-[96px] border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={gatewayForm.description}
                      onChange={(event) => setGatewayForm({ ...gatewayForm, description: event.target.value })}
                      placeholder="Gateway workspace for checkout, catalog, and customer APIs."
                    />
                  </FormField>
                  <Button
                    type="submit"
                    variant="brand"
                    className="h-12 w-full rounded-[0.9rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                  >
                    Create gateway
                  </Button>
                </form>
                <StatusCard status={gatewayStatus} />
              </CardContent>
            </Card>
          ) : null}

          {gatewayWorkspaceTab === "service" ? (
            <Card className="animate-panel border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_96%,var(--background))_0%,var(--surface)_100%)] text-[var(--text-strong)] shadow-none" style={{ animationDelay: "120ms" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-[var(--text-strong)]">Register service</CardTitle>
                <CardDescription className="text-[var(--text-muted)]">
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
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--surface-muted)] text-[var(--text-strong)] hover:bg-[var(--surface-soft)]"
                      onClick={() => setServiceForm({ ...preset.values })}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>

                <form className="grid gap-4 md:grid-cols-2" onSubmit={onRegisterService}>
                  <FormField label="Gateway">
                    <select
                      className="flex h-12 w-full rounded-2xl border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] px-4 py-3 text-sm text-[var(--text-strong)] outline-none transition focus-visible:border-[var(--border-strong)] focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
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
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={serviceForm.serviceId}
                      onChange={(event) => setServiceForm({ ...serviceForm, serviceId: event.target.value })}
                      placeholder="product-service-manual-1"
                    />
                  </FormField>
                  <FormField label="Service name">
                    <Input
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={serviceForm.serviceName}
                      onChange={(event) => setServiceForm({ ...serviceForm, serviceName: event.target.value })}
                      placeholder="product-service"
                    />
                  </FormField>
                  <FormField label="Address">
                    <Input
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={serviceForm.address}
                      onChange={(event) => setServiceForm({ ...serviceForm, address: event.target.value })}
                      placeholder="localhost"
                    />
                  </FormField>
                  <FormField label="Port">
                    <Input
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={serviceForm.port}
                      onChange={(event) => setServiceForm({ ...serviceForm, port: event.target.value })}
                      placeholder="8082"
                    />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Tags">
                      <Textarea
                        className="min-h-[96px] border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
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
                      className="h-12 w-full rounded-[0.9rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)] disabled:cursor-not-allowed disabled:opacity-50"
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
            <Card className="animate-panel border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_96%,var(--background))_0%,var(--surface)_100%)] text-[var(--text-strong)] shadow-none" style={{ animationDelay: "120ms" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-[var(--text-strong)]">Publish route</CardTitle>
                <CardDescription className="text-[var(--text-muted)]">
                  Pick the gateway, choose one of its services, then attach the public path. Security is inherited from the gateway.
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
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--surface-muted)] text-[var(--text-strong)] hover:bg-[var(--surface-soft)]"
                      onClick={() =>
                        setRouteForm({
                          gatewayId: preset.values.gatewayId,
                          serviceId: preset.values.serviceId,
                          id: preset.values.id,
                          path: preset.values.path,
                          uri: preset.values.uri,
                        })
                      }
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>

                <div className="grid gap-3 rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--surface-muted)] p-4 md:grid-cols-3">
                  <PreviewStat label="Gateway" value={routeForm.gatewayId || "select_gateway"} />
                  <PreviewStat label="Security policy" value={inheritedSecurity} />
                  <PreviewStat label="Example request" value={exampleCall} mono />
                </div>

                <form className="space-y-4" onSubmit={onCreateRoute}>
                  <FormField label="Gateway">
                    <select
                      className="flex h-12 w-full rounded-2xl border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] px-4 py-3 text-sm text-[var(--text-strong)] outline-none transition focus-visible:border-[var(--border-strong)] focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={routeForm.gatewayId}
                      onChange={(event) => onRouteGatewayChange(event.target.value)}
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
                      className="flex h-12 w-full rounded-2xl border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] px-4 py-3 text-sm text-[var(--text-strong)] outline-none transition focus-visible:border-[var(--border-strong)] focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={routeForm.serviceId}
                      onChange={(event) => onRouteServiceChange(event.target.value)}
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
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={routeForm.id}
                      onChange={(event) => setRouteForm({ ...routeForm, id: event.target.value })}
                      placeholder="product-route-basic"
                    />
                  </FormField>
                  <FormField label="Public path">
                    <Input
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={routeForm.path}
                      onChange={(event) => setRouteForm({ ...routeForm, path: event.target.value })}
                      placeholder="/basic/products/**"
                    />
                  </FormField>
                  <FormField label="Target URI">
                    <Input
                      className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                      value={routeForm.uri}
                      onChange={(event) => setRouteForm({ ...routeForm, uri: event.target.value })}
                      placeholder="lb://product-service"
                    />
                  </FormField>
                  <div className="rounded-[1rem] border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_80%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_72%,transparent)] px-4 py-4 text-sm leading-7 text-[var(--text-muted)]">
                    This route will inherit <span className="text-[var(--text-strong)]">{inheritedSecurity}</span> from the selected gateway.
                    If you need a different security type, create another gateway workspace with that policy.
                  </div>
                  <Button
                    type="submit"
                    disabled={!routeForm.gatewayId || !routeForm.serviceId}
                    className="h-12 w-full rounded-[0.9rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Publish route
                  </Button>
                </form>
                <StatusCard status={routeStatus} />
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="animate-panel border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] text-[var(--text-strong)] shadow-none" style={{ animationDelay: "160ms" }}>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[var(--text-strong)]">Flow guide</CardTitle>
            <CardDescription className="text-[var(--text-muted)]">
              Keep the gateway setup organized from top to bottom.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <StepHint index="01" title="Create gateway" body="Use a gateway as the top-level project group for related services and routes." active={gatewayWorkspaceTab === "gateway"} />
            <StepHint index="02" title="Register service" body="Add a service into the selected gateway so it becomes available for dynamic route publishing." active={gatewayWorkspaceTab === "service"} />
            <StepHint index="03" title="Create route" body="Attach a public path to one service. The gateway's security mode applies automatically." active={gatewayWorkspaceTab === "route"} />
            <div className="grid gap-3 rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--surface-muted)] p-4 md:grid-cols-3">
              <PreviewStat label="Gateway" value={routeForm.gatewayId || "select_gateway"} />
              <PreviewStat label="Security policy" value={inheritedSecurity} />
              <PreviewStat label="Example request" value={exampleCall} mono />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="animate-panel border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] text-[var(--text-strong)] shadow-none" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-[var(--text-strong)]">Gateway map</CardTitle>
              <CardDescription className="text-[var(--text-muted)]">
                Browse gateways, their services, and the routes already attached to each service.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[var(--surface-muted)] text-[var(--text-strong)] hover:bg-[var(--surface-soft)]"
              onClick={onReloadGateways}
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
          <Card className="animate-panel border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] text-[var(--text-strong)] shadow-none" style={{ animationDelay: "220ms" }}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-[var(--text-strong)]">Workspace inventory</CardTitle>
              <CardDescription className="text-[var(--text-muted)]">
                Current gateway groups that own services and routes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {gateways.length === 0 ? (
                <EmptyState message="No gateways created yet. Start with a workspace like e-commerce or partner APIs." />
              ) : (
                gateways.map((gateway) => <GatewayRow key={gateway.gatewayId} gateway={gateway} />)
              )}
            </CardContent>
          </Card>

          <Card className="animate-panel border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] text-[var(--text-strong)] shadow-none" style={{ animationDelay: "260ms" }}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-[var(--text-strong)]">Quick test matrix</CardTitle>
              <CardDescription className="text-[var(--text-muted)]">
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
  );
}
