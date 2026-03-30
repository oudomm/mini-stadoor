"use client";

import type { ReactNode } from "react";
import { Activity, Network, Route, Server, ShieldCheck } from "lucide-react";

import type { RecentActivityItem } from "@/components/mini-stadoor-ui/model";
import { ActionLink, ActivityRow, MetricCard } from "@/components/mini-stadoor-ui/ui";

type OverviewPanelProps = {
  gatewayCount: number;
  serviceCount: number;
  routeCount: number;
  supportedModeCount: number;
  recentActivity: RecentActivityItem[];
};

export function OverviewPanel({
  gatewayCount,
  serviceCount,
  routeCount,
  supportedModeCount,
  recentActivity,
}: OverviewPanelProps) {
  const totalResources = gatewayCount + serviceCount + routeCount;
  const routePerService = serviceCount > 0 ? (routeCount / serviceCount).toFixed(2) : "0.00";

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="animate-panel rounded-[1.2rem] border border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] pb-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)]">workspace snapshot</p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--text-strong)]">Gateway runtime status</h2>
            </div>
            <div className="rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_80%,transparent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-soft)]">
              live
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InventoryRow icon={<Network className="h-4 w-4" />} label="Gateway workspaces" value={`${gatewayCount}`} helper="project boundaries" />
            <InventoryRow icon={<Server className="h-4 w-4" />} label="Registered services" value={`${serviceCount}`} helper="service catalog" />
            <InventoryRow icon={<Route className="h-4 w-4" />} label="Published routes" value={`${routeCount}`} helper="runtime entrypoints" />
            <InventoryRow icon={<ShieldCheck className="h-4 w-4" />} label="Security controls" value={`${supportedModeCount}`} helper="auth policies enabled" />
          </div>

          <div className="mt-4 grid gap-3 rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_78%,transparent)] p-3 sm:grid-cols-2">
            <MiniKpi label="Route per service" value={routePerService} />
            <MiniKpi label="Total managed resources" value={`${totalResources}`} />
          </div>
        </div>

        <div className="animate-panel rounded-[1.2rem] border border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] p-5" style={{ animationDelay: "80ms" }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">operator queue</p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--text-strong)]">Next actions</h3>
          <div className="mt-4 space-y-3">
            <ActionLink title="Create gateway workspace" body="Group services before assigning route policy." href="/dashboard?tab=gateway" />
            <ActionLink title="Register one more service" body="Increase route inventory and ownership clarity." href="/dashboard?tab=gateway" />
            <ActionLink title="Publish protected route" body="Attach BASIC, API_KEY, or JWT at route level." href="/dashboard?tab=gateway" />
            <ActionLink title="Check IAM roadmap" body="Track OAuth2/OIDC as upcoming module." href="/dashboard?tab=iam" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Gateways" value={String(gatewayCount)} accent="green" />
        <MetricCard label="Services" value={String(serviceCount)} accent="default" />
        <MetricCard label="Routes" value={String(routeCount)} accent="green" />
        <MetricCard label="Live controls" value={String(supportedModeCount)} accent="cyan" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="animate-panel rounded-[1.2rem] border border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] p-5" style={{ animationDelay: "120ms" }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">security distribution</p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--text-strong)]">Auth mode mix</h3>
          <div className="mt-5 space-y-3">
            <SecurityMixRow label="NONE" ratio={24} detail="open access routes" />
            <SecurityMixRow label="BASIC" ratio={26} detail="username/password routes" />
            <SecurityMixRow label="API_KEY" ratio={21} detail="partner integration routes" />
            <SecurityMixRow label="JWT" ratio={29} detail="token protected routes" />
          </div>

          <div className="mt-6 rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_76%,transparent)] p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">
              <Activity className="h-3.5 w-3.5" />
              security note
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              Demo scope is route-level protection with NONE, BASIC, API_KEY, and JWT. OAuth2/OIDC stays under IAM rollout.
            </p>
          </div>
        </div>

        <div className="animate-panel rounded-[1.2rem] border border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] p-5" style={{ animationDelay: "140ms" }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">recent events</p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--text-strong)]">Activity stream</h3>
          <div className="mt-5 space-y-3">
            {recentActivity.map((item, index) => (
              <ActivityRow key={`${item.title}-${index}`} title={item.title} meta={item.meta} tone={item.tone} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function InventoryRow({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="border-l border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] pl-3">
      <div className="flex items-center gap-2 text-[var(--accent-soft)]">{icon}</div>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-[var(--text-strong)]">{value}</p>
      <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">{helper}</p>
    </div>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] pl-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--text-strong)]">{value}</p>
    </div>
  );
}

function SecurityMixRow({
  label,
  ratio,
  detail,
}: {
  label: string;
  ratio: number;
  detail: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text-strong)]">{label}</p>
        <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">{ratio}%</p>
      </div>
      <div className="h-2 w-full rounded-full bg-[color:color-mix(in_srgb,var(--surface-muted)_92%,transparent)]">
        <div
          className="h-2 rounded-full bg-[linear-gradient(90deg,var(--accent)_0%,color-mix(in_srgb,var(--accent-bright)_88%,var(--accent))_100%)]"
          style={{ width: `${ratio}%` }}
        />
      </div>
      <p className="text-xs text-[var(--text-muted)]">{detail}</p>
    </div>
  );
}
