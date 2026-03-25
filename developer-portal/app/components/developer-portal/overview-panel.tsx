"use client";

import { Network, Route, Server, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { RecentActivityItem } from "@/app/components/developer-portal/model";
import { ActionLink, ActivityRow, MetricCard, ModuleRow } from "@/app/components/developer-portal/ui";

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
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="animate-panel rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_84%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_76%,transparent)_100%)] p-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--accent-soft)]">
                workspace_summary
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[var(--text-strong)] lg:text-4xl">
                Operate services, gateway groups, and route security from one working surface.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">
                Register applications, place them under a gateway workspace, and expose protected runtime routes without
                scattering the flow across multiple pages.
              </p>
            </div>

            <div className="grid min-w-[190px] gap-4 border-l border-[color:color-mix(in_srgb,var(--accent)_20%,transparent)] pl-5 lg:text-right">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">live_status</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--accent-soft)]">Operational</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">focus</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Gateway registration and protected routing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-panel rounded-[1.4rem] border border-white/8 bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] p-6" style={{ animationDelay: "80ms" }}>
          <div className="pb-3">
            <p className="text-xl font-semibold text-[var(--text-strong)]">Quick actions</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Start from the main workflow.</p>
          </div>
          <div className="space-y-4 pt-4">
            <ActionLink title="Create gateway" body="Start a new workspace group for related services." href="/dashboard?tab=gateway" />
            <ActionLink title="Register application" body="Add a service into one of your gateway workspaces." href="/dashboard?tab=gateway" />
            <ActionLink title="Publish route" body="Expose a public path and attach a security type." href="/dashboard?tab=gateway" />
            <ActionLink title="Review IAM roadmap" body="Keep upcoming identity capabilities visible." href="/dashboard?tab=iam" />
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
        <Card className="border-white/6 bg-transparent text-[var(--text-strong)] shadow-none">
          <CardHeader className="border-t border-white/8 px-0 pt-6">
            <CardTitle className="text-2xl font-semibold text-[var(--text-strong)]">Live modules</CardTitle>
            <CardDescription className="text-[var(--text-muted)]">
              Main surfaces available in the current workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-0">
            <ModuleRow icon={<Network className="h-4 w-4" />} title="Gateway workspaces" meta="Group services and routes by project boundary." />
            <ModuleRow icon={<Server className="h-4 w-4" />} title="Application registry" meta="Register backend services into a selected gateway." />
            <ModuleRow icon={<Route className="h-4 w-4" />} title="Dynamic routes" meta="Publish runtime routes through the control plane." />
            <ModuleRow icon={<ShieldCheck className="h-4 w-4" />} title="Security controls" meta="Use live route protection and keep roadmap controls visible." />
          </CardContent>
        </Card>

        <Card className="border-white/6 bg-transparent text-[var(--text-strong)] shadow-none">
          <CardHeader className="border-t border-white/8 px-0 pt-6">
            <CardTitle className="text-2xl font-semibold text-[var(--text-strong)]">Recent activity</CardTitle>
            <CardDescription className="text-[var(--text-muted)]">
              Latest workspace events across gateway creation, onboarding, and route publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-0">
            {recentActivity.map((item, index) => (
              <ActivityRow key={`${item.title}-${index}`} title={item.title} meta={item.meta} tone={item.tone} />
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
