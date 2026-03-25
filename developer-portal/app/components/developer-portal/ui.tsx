"use client";

import type { ReactNode } from "react";
import { Activity, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import type {
  GatewaySummary,
  RouteSummary,
  StatusState,
} from "@/app/components/developer-portal/model";
import { pretty } from "@/app/components/developer-portal/model";

export function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "green" | "default" | "cyan";
}) {
  const accentText =
    accent === "green"
      ? "text-[var(--accent)]"
      : accent === "cyan"
        ? "text-[color:color-mix(in_srgb,var(--accent)_74%,var(--text-strong))]"
        : "text-[var(--text-strong)]";
  return (
    <Card className="border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-transparent text-[var(--text-strong)] shadow-none transition duration-300 hover:-translate-y-0.5">
      <CardContent className="rounded-[1.1rem] border border-white/8 bg-[color:color-mix(in_srgb,var(--surface)_72%,transparent)] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">{label}</p>
        <p className={`mt-5 text-5xl font-semibold tracking-[-0.05em] ${accentText}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

export function ModuleRow({
  icon,
  title,
  meta,
}: {
  icon: ReactNode;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-4 border-l border-[color:color-mix(in_srgb,var(--accent)_16%,transparent)] pl-4 transition duration-300 hover:border-[color:color-mix(in_srgb,var(--accent)_34%,transparent)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-soft)] text-[var(--accent-soft)]">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text-strong)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{meta}</p>
      </div>
    </div>
  );
}

export function WorkspaceStepTab({
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
          ? "border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_0_26px_var(--glow)]"
          : "border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,transparent)] text-[var(--text-muted)] hover:border-[color:color-mix(in_srgb,var(--border-soft)_100%,transparent)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
      }`}
    >
      {label}
    </button>
  );
}

export function MiniWorkspaceStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-[color:color-mix(in_srgb,var(--surface)_72%,transparent)] px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--text-strong)]">{value}</p>
    </div>
  );
}

export function StepHint({
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
      className={`border-l px-4 py-1 ${
        active
          ? "border-[color:color-mix(in_srgb,var(--accent)_24%,transparent)] bg-transparent"
          : "border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-transparent"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_85%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
          {index}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-strong)]">{title}</p>
          <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{body}</p>
        </div>
      </div>
    </div>
  );
}

export function ActionLink({
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
      className="flex items-center justify-between gap-4 border-l border-[color:color-mix(in_srgb,var(--accent)_16%,transparent)] pl-4 transition hover:border-[color:color-mix(in_srgb,var(--accent)_34%,transparent)]"
    >
      <div>
        <p className="text-sm font-semibold text-[var(--text-strong)]">{title}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{body}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-[var(--text-faint)]" />
    </a>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">{label}</Label>
      {children}
    </div>
  );
}

export function PreviewStat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border-l border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pl-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{label}</p>
      <p className={`mt-2 text-sm font-semibold text-[var(--text-strong)] ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export function RouteRow({ route }: { route: RouteSummary }) {
  const authType = route.authType ?? "NONE";
  const authTone =
    authType === "BASIC"
      ? "text-[color:color-mix(in_srgb,#b46a00_86%,var(--text-strong))]"
      : authType === "API_KEY"
        ? "text-[color:color-mix(in_srgb,var(--accent)_74%,var(--text-strong))]"
        : authType === "JWT"
          ? "text-[var(--accent)]"
          : "text-[var(--text-muted)]";

  return (
    <div className="border-l border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pl-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--text-strong)]">{route.id}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{route.path}</p>
        </div>
        <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${authTone}`}>{authType}</span>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
        {route.gatewayId} / {route.serviceId}
      </p>
      <code className="mt-3 block rounded-[0.75rem] bg-[var(--code)] px-3 py-2 text-xs text-[var(--accent)]">{route.uri}</code>
    </div>
  );
}

export function GatewayRow({ gateway }: { gateway: GatewaySummary }) {
  return (
    <div className="border-l border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pl-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--text-strong)]">{gateway.gatewayName}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.18em] text-[var(--text-faint)]">{gateway.gatewayId}</p>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {gateway.services.length} service{gateway.services.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{gateway.description || "No description yet."}</p>
    </div>
  );
}

export function GatewayTree({ gateway }: { gateway: GatewaySummary }) {
  return (
    <div className="border-t border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pt-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--text-strong)]">{gateway.gatewayName}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">{gateway.gatewayId}</p>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {gateway.services.length} service{gateway.services.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{gateway.description || "No description yet."}</p>

      <div className="mt-4 space-y-3">
        {gateway.services.length === 0 ? (
          <EmptyState message="No services in this gateway yet." />
        ) : (
          gateway.services.map((service) => (
            <div key={service.serviceId} className="border-l border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pl-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--text-strong)]">{service.serviceName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">{service.serviceId}</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {service.address}:{service.port}
                  </p>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--accent)_74%,var(--text-strong))]">
                  {service.routes.length} route{service.routes.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--text-muted)]">{service.tags.join(", ") || "No tags"}</p>
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

export function ActivityRow({
  title,
  meta,
  tone,
}: {
  title: string;
  meta: string;
  tone: "loading" | "success" | "error";
}) {
  const dotClass =
    tone === "success"
      ? "bg-[var(--accent)]"
      : tone === "error"
        ? "bg-[color:color-mix(in_srgb,#ff7a59_92%,#c04d24)]"
        : "bg-[color:color-mix(in_srgb,#ffd166_88%,#e7b84c)]";

  return (
    <div className="border-l border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pl-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--text-strong)]">{title}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{meta}</p>
        </div>
        <span className={`mt-1 inline-flex h-3 w-3 rounded-full ${dotClass}`} />
      </div>
    </div>
  );
}

export function QuickLink({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] pl-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-[var(--text-strong)]">{label}</p>
          <code className="mt-2 block text-xs leading-6 text-[var(--text-muted)]">{value}</code>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 text-[var(--text-faint)]" />
      </div>
    </div>
  );
}

export function StatusCard({ status }: { status: StatusState }) {
  if (!status) {
    return null;
  }

  const toneClass =
    status.tone === "success"
      ? "border-[color:color-mix(in_srgb,var(--accent)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-soft)_72%,var(--background))]"
      : status.tone === "error"
        ? "border-[color:color-mix(in_srgb,#ff7a59_20%,transparent)] bg-[color:color-mix(in_srgb,#ff7a59_10%,var(--background))]"
        : "border-[color:color-mix(in_srgb,var(--border-soft)_75%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,transparent)]";

  return (
    <div className={`border-l p-4 ${toneClass}`}>
      <div className="flex items-center gap-3">
        <Activity className="h-4 w-4 text-[var(--text-muted)]" />
        <p className="font-semibold text-[var(--text-strong)]">{status.message}</p>
      </div>
      {status.payload ? (
        <pre className="mt-3 overflow-auto rounded-[0.9rem] bg-[var(--code)] p-4 text-xs leading-6 text-[var(--text-muted)]">
          {pretty(status.payload)}
        </pre>
      ) : null}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_80%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_50%,transparent)] px-4 py-6 text-center text-sm text-[var(--text-muted)]">
      {message}
    </div>
  );
}

export function PlaceholderSection({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[var(--surface)] text-[var(--text-strong)] shadow-none">
      <CardContent className="p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--surface-soft)] text-[var(--accent-soft)]">
          {icon}
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-[var(--text-strong)]">{title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--text-muted)]">{body}</p>
      </CardContent>
    </Card>
  );
}
