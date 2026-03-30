"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Plus, Server, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type GatewaySummary,
  type ServiceForm,
  type ServiceSummary,
  type StatusState,
} from "@/components/mini-stadoor-ui/model";
import { Field, StatusPanel } from "@/components/mini-stadoor-ui/ui-primitives";

type ServicesTabProps = {
  allServices: ServiceSummary[];
  gateways: GatewaySummary[];
  showServiceForm: boolean;
  setShowServiceForm: Dispatch<SetStateAction<boolean>>;
  serviceForm: ServiceForm;
  setServiceForm: Dispatch<SetStateAction<ServiceForm>>;
  serviceBaseUrl: string;
  setServiceBaseUrl: Dispatch<SetStateAction<string>>;
  selectedServiceGatewayAuthType: string;
  onSubmitService: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  serviceStatus: StatusState;
};

export function ServicesTabPanel({
  allServices,
  gateways,
  showServiceForm,
  setShowServiceForm,
  serviceForm,
  setServiceForm,
  serviceBaseUrl,
  setServiceBaseUrl,
  selectedServiceGatewayAuthType,
  onSubmitService,
  serviceStatus,
}: ServicesTabProps) {
  return (
    <section className="space-y-4">
      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
        <header className="flex items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
          <div>
            <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Registered Services</p>
            <p className="text-[1rem] text-[var(--text-muted)]">{allServices.length} services registered across your gateways</p>
          </div>
          <Button
            type="button"
            variant="brand"
            className="h-10 rounded-[0.72rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
            onClick={() => setShowServiceForm((current) => !current)}
          >
            {showServiceForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showServiceForm ? "Close" : "Add Service"}
          </Button>
        </header>

        {showServiceForm ? (
          <form className="grid gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4 md:grid-cols-2" onSubmit={onSubmitService}>
            <Field label="Service Name">
              <Input
                value={serviceForm.serviceName}
                onChange={(event) =>
                  setServiceForm((current) => ({
                    ...current,
                    serviceName: event.target.value,
                    serviceId: event.target.value.replace(/\s+/g, "-").toLowerCase() + "-manual-1",
                  }))
                }
                placeholder="e.g., Payment Service"
                className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
              />
            </Field>
            <Field label="Assign to Gateway">
              <select
                className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                value={serviceForm.gatewayId}
                onChange={(event) =>
                  setServiceForm((current) => ({
                    ...current,
                    gatewayId: event.target.value,
                  }))
                }
              >
                {gateways.length === 0 ? <option value="">Create a gateway first</option> : null}
                {gateways.map((gateway) => (
                  <option key={gateway.gatewayId} value={gateway.gatewayId}>
                    {gateway.gatewayName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Base URL">
              <Input
                value={serviceBaseUrl}
                onChange={(event) => setServiceBaseUrl(event.target.value)}
                placeholder="https://api.internal.com/service"
                className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
              />
            </Field>
            <Field label="Tags">
              <Input
                value={serviceForm.tags}
                onChange={(event) => setServiceForm((current) => ({ ...current, tags: event.target.value }))}
                placeholder="manual-registration,ecommerce,spring"
                className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
              />
            </Field>
            <div className="rounded-[0.8rem] border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,transparent)] px-4 py-3 md:col-span-2">
              <p className="text-sm font-medium text-[var(--accent-soft)]">Applied Security</p>
              <p className="mt-1 text-[1rem] text-[var(--text-muted)]">
                This service will automatically use <span className="font-semibold text-[var(--text-strong)]">{selectedServiceGatewayAuthType}</span> from its gateway.
              </p>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <Button
                type="submit"
                variant="brand"
                disabled={gateways.length === 0}
                className="h-10 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)] disabled:opacity-50"
              >
                Register Service
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                onClick={() => setShowServiceForm(false)}
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
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Service Name</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Base URL</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Gateway</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Service Auth</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Status</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allServices.length === 0 ? (
                <tr>
                  <td
                    className="px-3 py-5 text-[1rem] text-[var(--text-muted)]"
                    colSpan={6}
                  >
                    No services registered yet.
                  </td>
                </tr>
              ) : (
                allServices.map((service) => {
                  const gateway = gateways.find((item) => item.gatewayId === service.gatewayId);
                  return (
                    <tr key={service.serviceId} className="text-[1rem] text-[var(--text-strong)]">
                      <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                        <p className="font-semibold">{service.serviceName}</p>
                        <p className="text-sm text-[var(--text-muted)]">{service.serviceId}</p>
                      </td>
                      <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3 font-mono text-sm">
                        https://{service.address}:{service.port}
                      </td>
                      <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                        {gateway?.gatewayName ?? service.gatewayId}
                      </td>
                      <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                        <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-2.5 py-1 text-sm font-medium text-[var(--accent-soft)]">
                          {service.authType ?? "NONE"}
                        </span>
                      </td>
                      <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                        <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-2.5 py-1 text-sm font-medium text-[var(--accent-soft)]">
                          Healthy
                        </span>
                      </td>
                      <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Server className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[color:color-mix(in_srgb,#e05f49_90%,#bc422f)]">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
      <StatusPanel status={serviceStatus} />
    </section>
  );
}
