"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Plus, Route, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type FlattenedRouteSummary,
  type GatewaySummary,
  type RouteForm,
  type StatusState,
} from "@/components/mini-stadoor-ui/model";
import { Field, StatusPanel } from "@/components/mini-stadoor-ui/ui-primitives";

type RoutesTabProps = {
  allRoutes: FlattenedRouteSummary[];
  gateways: GatewaySummary[];
  selectedRouteGateway: GatewaySummary | null;
  routeForm: RouteForm;
  setRouteForm: Dispatch<SetStateAction<RouteForm>>;
  showRouteForm: boolean;
  setShowRouteForm: Dispatch<SetStateAction<boolean>>;
  selectedRouteGatewayAuthType: string;
  onRouteGatewayChange: (gatewayId: string) => void;
  onRouteServiceChange: (serviceId: string) => void;
  onSubmitRoute: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  routeStatus: StatusState;
};

export function RoutesTabPanel({
  allRoutes,
  gateways,
  selectedRouteGateway,
  routeForm,
  setRouteForm,
  showRouteForm,
  setShowRouteForm,
  selectedRouteGatewayAuthType,
  onRouteGatewayChange,
  onRouteServiceChange,
  onSubmitRoute,
  routeStatus,
}: RoutesTabProps) {
  return (
    <section className="space-y-4">
      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
        <header className="flex items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
          <div>
            <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Routes</p>
            <p className="text-[1rem] text-[var(--text-muted)]">Configure API routes and map public endpoints to backend services</p>
          </div>
          <Button
            type="button"
            variant="brand"
            className="h-10 rounded-[0.72rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
            onClick={() => setShowRouteForm((current) => !current)}
          >
            {showRouteForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showRouteForm ? "Close" : "Add Route"}
          </Button>
        </header>

        {showRouteForm ? (
          <form className="grid gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4 md:grid-cols-2" onSubmit={onSubmitRoute}>
            <Field label="Gateway">
              <select
                className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
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
            </Field>
            <Field label="Target Service">
              <select
                className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                value={routeForm.serviceId}
                onChange={(event) => onRouteServiceChange(event.target.value)}
              >
                {!selectedRouteGateway?.services.length ? <option value="">Register a service first</option> : null}
                {selectedRouteGateway?.services.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Public Path">
              <Input
                value={routeForm.path}
                onChange={(event) => setRouteForm((current) => ({ ...current, path: event.target.value }))}
                placeholder="/api/endpoint"
                className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
              />
            </Field>
            <Field label="Route ID">
              <Input
                value={routeForm.id}
                onChange={(event) => setRouteForm((current) => ({ ...current, id: event.target.value }))}
                placeholder="product-route-jwt"
                className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
              />
            </Field>
            <Field label="Target URI">
              <Input
                value={routeForm.uri}
                onChange={(event) => setRouteForm((current) => ({ ...current, uri: event.target.value }))}
                placeholder="lb://product-service"
                className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
              />
            </Field>
            <div className="rounded-[0.8rem] border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,transparent)] px-4 py-3 md:col-span-2">
              <p className="text-sm font-medium text-[var(--accent-soft)]">Applied Security</p>
              <p className="mt-1 text-[1rem] text-[var(--text-muted)]">
                This route will automatically use <span className="font-semibold text-[var(--text-strong)]">{selectedRouteGatewayAuthType}</span> from its gateway.
              </p>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <Button
                type="submit"
                variant="brand"
                disabled={!routeForm.gatewayId || !routeForm.serviceId}
                className="h-10 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)] disabled:opacity-50"
              >
                Create Route
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                onClick={() => setShowRouteForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : null}

        <div className="overflow-x-auto px-4 py-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Route</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Gateway</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Service</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Auth</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allRoutes.length === 0 ? (
                <tr>
                  <td className="px-3 py-5 text-[1rem] text-[var(--text-muted)]" colSpan={5}>
                    No routes published yet.
                  </td>
                </tr>
              ) : (
                allRoutes.map((route) => (
                  <tr key={`${route.id}-${route.serviceId}`} className="text-[1rem] text-[var(--text-strong)]">
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                      <p className="font-semibold">{route.id}</p>
                      <p className="font-mono text-sm text-[var(--text-muted)]">{route.path}</p>
                    </td>
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">{route.gatewayName}</td>
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">{route.serviceName}</td>
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                      <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-2.5 py-1 text-sm font-medium text-[var(--accent-soft)]">
                        {route.authType ?? "NONE"}
                      </span>
                    </td>
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Route className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[color:color-mix(in_srgb,#e05f49_90%,#bc422f)]">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      <StatusPanel status={routeStatus} />
    </section>
  );
}
