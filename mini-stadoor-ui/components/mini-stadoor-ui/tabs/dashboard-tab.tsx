"use client";

import Link from "next/link";
import { Route, Server, Shield, Waypoints } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GatewayRow } from "@/components/mini-stadoor-ui/model";
import { EmptyRow, LinkButton, MetricCard } from "@/components/mini-stadoor-ui/ui-primitives";

type DashboardTabProps = {
  gatewayCount: number;
  serviceCount: number;
  routeCount: number;
  protectedRouteCount: number;
  gatewayRows: GatewayRow[];
};

export function DashboardTabPanel({
  gatewayCount,
  serviceCount,
  routeCount,
  protectedRouteCount,
  gatewayRows,
}: DashboardTabProps) {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Waypoints className="h-5 w-5" />}
          value={gatewayCount}
          label="Total Gateways"
          helper={`+${Math.max(gatewayCount, 1)} this month`}
        />
        <MetricCard
          icon={<Server className="h-5 w-5" />}
          value={serviceCount}
          label="Registered Services"
          helper={`+${Math.max(serviceCount, 1)} this month`}
        />
        <MetricCard
          icon={<Route className="h-5 w-5" />}
          value={routeCount}
          label="Active Routes"
          helper={`+${Math.max(routeCount, 1)} this month`}
        />
        <MetricCard
          icon={<Shield className="h-5 w-5" />}
          value={protectedRouteCount}
          label="Protected Routes"
          helper={routeCount > 0 ? `${Math.round((protectedRouteCount / routeCount) * 100)}% coverage` : "0% coverage"}
        />
      </div>

      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
          <div>
            <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Your Gateways</p>
            <p className="mt-0.5 text-[1rem] text-[var(--text-muted)]">Manage and monitor your API Gateway instances</p>
          </div>
          <LinkButton href="/dashboard?tab=gateways" label="View All" />
        </header>

        <div className="space-y-3 px-4 py-4">
          {gatewayRows.length === 0 ? (
            <EmptyRow message="No gateways yet. Go to Gateways and create your first workspace." />
          ) : (
            gatewayRows.map((row) => (
              <div
                key={row.gateway.gatewayId}
                className="flex flex-wrap items-center gap-3 rounded-[0.9rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_94%,transparent)] px-4 py-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[0.8rem] bg-[color:color-mix(in_srgb,var(--surface-soft)_88%,transparent)] text-[var(--accent-soft)]">
                  <Waypoints className="h-5 w-5" />
                </div>
                <div className="min-w-[220px] flex-1">
                  <p className="text-[1.35rem] font-semibold text-[var(--text-strong)]">{row.gateway.gatewayName}</p>
                  <p className="text-[1rem] text-[var(--text-muted)]">
                    {row.serviceTotal} services • {row.routeTotal} endpoints • {row.gateway.gatewayId}
                  </p>
                </div>
                <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_90%,transparent)] px-3 py-1 text-sm font-semibold text-[var(--accent-soft)]">
                  Active
                </span>
                <span className="rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] px-3 py-1 text-sm text-[var(--text-muted)]">
                  {row.primaryAuth}
                </span>
                <Button
                  variant="secondary"
                  asChild
                  className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                >
                  <Link href="/dashboard?tab=gateways">Manage</Link>
                </Button>
              </div>
            ))
          )}
        </div>
      </section>
    </section>
  );
}
