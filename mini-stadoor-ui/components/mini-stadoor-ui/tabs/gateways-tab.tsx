"use client";

import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  supportedSecurityModes,
  type GatewayForm,
  type GatewayRow,
  type StatusState,
} from "@/components/mini-stadoor-ui/model";
import { Field, ReviewRow, StatusPanel } from "@/components/mini-stadoor-ui/ui-primitives";

type WizardStep = 1 | 2;

type GatewayTabProps = {
  showGatewayForm: boolean;
  setShowGatewayForm: Dispatch<SetStateAction<boolean>>;
  gatewayWizardSteps: ReadonlyArray<{ id: WizardStep; label: string }>;
  gatewayStep: WizardStep;
  setGatewayStep: Dispatch<SetStateAction<WizardStep>>;
  gatewayForm: GatewayForm;
  setGatewayForm: Dispatch<SetStateAction<GatewayForm>>;
  canGoNext: boolean;
  isPending: boolean;
  onSubmitGateway: () => void | Promise<void>;
  gatewayStatus: StatusState;
  gatewayRows: GatewayRow[];
  onRefreshGateways: () => void | Promise<void>;
};

export function GatewaysTabPanel({
  showGatewayForm,
  setShowGatewayForm,
  gatewayWizardSteps,
  gatewayStep,
  setGatewayStep,
  gatewayForm,
  setGatewayForm,
  canGoNext,
  isPending,
  onSubmitGateway,
  gatewayStatus,
  gatewayRows,
  onRefreshGateways,
}: GatewayTabProps) {
  return (
    <section className="space-y-4">
      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
        <header className="flex items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-5 py-4">
          <div>
            <p className="text-[2.15rem] font-semibold tracking-[-0.05em] text-[var(--text-strong)]">Create New Gateway</p>
            <p className="text-[1rem] text-[var(--text-muted)]">Set up a new gateway workspace for your services and routes.</p>
          </div>
          <Button
            type="button"
            variant="brand"
            className="h-10 rounded-[0.72rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
            onClick={() => setShowGatewayForm((current) => !current)}
          >
            {showGatewayForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showGatewayForm ? "Close" : "Add Gateway"}
          </Button>
        </header>

        {showGatewayForm ? (
          <>
            <div className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-5 py-4">
              <div className="grid gap-3 md:grid-cols-4">
                {gatewayWizardSteps.map((step, index) => {
                  const isActive = step.id === gatewayStep;
                  const isDone = step.id < gatewayStep;
                  return (
                    <div key={step.id} className="flex items-center gap-2.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                          isActive || isDone
                            ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                            : "bg-[color:color-mix(in_srgb,var(--surface-muted)_96%,transparent)] text-[var(--text-muted)]"
                        }`}
                      >
                        {isDone ? <Check className="h-4 w-4" /> : step.id}
                      </div>
                      <p className="text-[1rem] font-medium text-[var(--accent-soft)]">{step.label}</p>
                      {index < gatewayWizardSteps.length - 1 ? (
                        <div className="hidden h-px flex-1 bg-[color:color-mix(in_srgb,var(--border-soft)_80%,transparent)] md:block" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-5 py-5">
              {gatewayStep === 1 ? (
                <div className="space-y-4">
                  <Field label="Gateway Name">
                    <Input
                      value={gatewayForm.gatewayName}
                      onChange={(event) => setGatewayForm({ ...gatewayForm, gatewayName: event.target.value })}
                      placeholder="e.g., E-Commerce API Gateway"
                      className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                    />
                  </Field>
                  <Field label="Gateway ID">
                    <Input
                      value={gatewayForm.gatewayId}
                      onChange={(event) => setGatewayForm({ ...gatewayForm, gatewayId: event.target.value })}
                      placeholder="e.g., ecommerce-gateway"
                      className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                    />
                  </Field>
                  <Field label="Description (optional)">
                    <Textarea
                      value={gatewayForm.description}
                      onChange={(event) => setGatewayForm({ ...gatewayForm, description: event.target.value })}
                      placeholder="What this gateway is for (e.g., product, checkout, partner APIs)"
                      className="min-h-[96px] border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                    />
                  </Field>
                  <Field label="Gateway Default Security">
                    <select
                      className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                      value={gatewayForm.authType}
                      onChange={(event) =>
                        setGatewayForm((current) => ({
                          ...current,
                          authType: event.target.value as GatewayForm["authType"],
                        }))
                      }
                    >
                      {supportedSecurityModes.map((mode) => (
                        <option key={mode.label} value={mode.label}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Gateway Type">
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        {
                          label: "API Gateway",
                          value: "API" as const,
                          hint: "General-purpose gateway for APIs, partners, and service traffic.",
                        },
                        {
                          label: "BFF Gateway",
                          value: "BFF" as const,
                          hint: "Backend-for-frontend gateway optimized for web or mobile clients.",
                        },
                      ].map((option) => {
                        const active = gatewayForm.workspaceType === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setGatewayForm((current) => ({
                                ...current,
                                workspaceType: option.value,
                              }))
                            }
                            className={`rounded-[0.85rem] border px-4 py-4 text-left transition ${
                              active
                                ? "border-[var(--border-strong)] bg-[color:color-mix(in_srgb,var(--accent)_10%,var(--surface))]"
                                : "border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] hover:bg-[var(--surface-soft)]"
                            }`}
                          >
                            <p className="text-[1rem] font-semibold text-[var(--text-strong)]">{option.label}</p>
                            <p className="mt-1 text-[0.9rem] text-[var(--text-muted)]">{option.hint}</p>
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              ) : null}

              {gatewayStep === 2 ? (
                <div className="space-y-4">
                  <p className="text-[1.2rem] font-semibold text-[var(--accent-soft)]">Review Configuration</p>
                  <div className="rounded-[0.85rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_94%,transparent)] px-4 py-4">
                    <ReviewRow label="Gateway Name" value={gatewayForm.gatewayName || "-"} />
                    <ReviewRow label="Gateway ID" value={gatewayForm.gatewayId || "-"} />
                    <ReviewRow label="Gateway Type" value={gatewayForm.workspaceType === "BFF" ? "BFF Gateway" : "API Gateway"} />
                    <ReviewRow label="Default Security" value={gatewayForm.authType || "NONE"} />
                    <ReviewRow label="Description" value={gatewayForm.description || "No description"} />
                  </div>
                </div>
              ) : null}
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-5 py-4">
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                onClick={() => setGatewayStep((current) => (current > 1 ? ((current - 1) as WizardStep) : current))}
                disabled={gatewayStep === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                type="button"
                variant="brand"
                className="h-10 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)] disabled:opacity-50"
                disabled={!canGoNext || isPending}
                onClick={() => {
                  if (gatewayStep < 2) {
                    setGatewayStep((current) => (current + 1) as WizardStep);
                    return;
                  }
                  void onSubmitGateway();
                }}
              >
                {gatewayStep === 2 ? "Create Gateway" : "Next"}
                {gatewayStep < 2 ? <ChevronRight className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </Button>
            </footer>
          </>
        ) : null}
      </section>
      <StatusPanel status={gatewayStatus} />

      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
          <div>
            <p className="text-[1.6rem] font-semibold tracking-[-0.04em] text-[var(--text-strong)]">Existing Gateways</p>
            <p className="text-[1rem] text-[var(--text-muted)]">Gateway workspaces already registered in your control plane.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="h-10 rounded-[0.72rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
            onClick={() => void onRefreshGateways()}
          >
            Refresh
          </Button>
        </header>

        <div className="overflow-x-auto px-4 py-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Gateway</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Services</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Routes</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Default Auth</th>
                <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gatewayRows.length === 0 ? (
                <tr>
                  <td className="px-3 py-5 text-[1rem] text-[var(--text-muted)]" colSpan={5}>
                    No gateways registered yet.
                  </td>
                </tr>
              ) : (
                gatewayRows.map((row) => (
                  <tr key={row.gateway.gatewayId} className="text-[1rem] text-[var(--text-strong)]">
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                      <p className="font-semibold">{row.gateway.gatewayName}</p>
                      <p className="text-sm text-[var(--text-muted)]">{row.gateway.gatewayId}</p>
                    </td>
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">{row.serviceTotal}</td>
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">{row.routeTotal}</td>
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                      <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-2.5 py-1 text-sm font-medium text-[var(--accent-soft)]">
                        {row.primaryAuth}
                      </span>
                    </td>
                    <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          asChild
                          className="h-8 rounded-[0.6rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent px-3 text-sm text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                        >
                          <Link href="/dashboard?tab=services">Services</Link>
                        </Button>
                        <Button
                          variant="secondary"
                          asChild
                          className="h-8 rounded-[0.6rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent px-3 text-sm text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                        >
                          <Link href="/dashboard?tab=routes">Routes</Link>
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
    </section>
  );
}
