"use client";

import type { ReactNode } from "react";
import { ChevronRight, CircleAlert, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { StatusState } from "@/components/mini-stadoor-ui/model";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-[var(--accent-soft)]">
      {label}
      {children}
    </label>
  );
}

export function MetricCard({
  icon,
  value,
  label,
  helper,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  helper: string;
}) {
  return (
    <div className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-4 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-[0.8rem] bg-[color:color-mix(in_srgb,var(--surface-soft)_88%,transparent)] text-[var(--accent-soft)]">
        {icon}
      </div>
      <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--accent-soft)]">{value}</p>
      <p className="mt-1 text-[1rem] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-sm text-[color:color-mix(in_srgb,#c9852b_92%,#a7641b)]">{helper}</p>
    </div>
  );
}

export function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-2 border-b border-[color:color-mix(in_srgb,var(--border-soft)_60%,transparent)] py-2 last:border-0">
      <p className="text-[1rem] text-[var(--text-muted)]">{label}</p>
      <p className="text-[1rem] font-medium text-[var(--accent-soft)]">{value}</p>
    </div>
  );
}

export function StatusPanel({ status }: { status: StatusState }) {
  if (!status) {
    return null;
  }

  const toneClass =
    status.tone === "success"
      ? "border-[color:color-mix(in_srgb,var(--accent)_26%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)]"
      : status.tone === "error"
        ? "border-[color:color-mix(in_srgb,#e05f49_42%,transparent)] bg-[color:color-mix(in_srgb,#ffcfca_36%,transparent)]"
        : "border-[color:color-mix(in_srgb,#d8aa45_40%,transparent)] bg-[color:color-mix(in_srgb,#ffe4a8_28%,transparent)]";

  return (
    <div className={`rounded-[0.8rem] border px-4 py-3 ${toneClass}`}>
      <div className="flex items-center gap-2">
        <CircleAlert className="h-4 w-4 text-[var(--text-muted)]" />
        <p className="text-[1rem] font-medium text-[var(--text-strong)]">{status.message}</p>
      </div>
    </div>
  );
}

export function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Button
      variant="secondary"
      asChild
      className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
    >
      <a href={href}>
        {label}
        <ChevronRight className="h-4 w-4" />
      </a>
    </Button>
  );
}

export function EmptyRow({ message }: { message: string }) {
  return (
    <div className="rounded-[0.85rem] border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,transparent)] px-4 py-6 text-[1rem] text-[var(--text-muted)]">
      {message}
    </div>
  );
}

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "neutral";
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
        tone === "success"
          ? "bg-[color:color-mix(in_srgb,var(--surface-soft)_90%,transparent)] text-[var(--accent-soft)]"
          : "bg-[color:color-mix(in_srgb,var(--surface-muted)_90%,transparent)] text-[var(--text-muted)]"
      }`}
    >
      {label}
    </span>
  );
}

export function AuthChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold tracking-[0.18em] ${
        active
          ? "border-[color:color-mix(in_srgb,var(--accent)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-soft)_90%,transparent)] text-[var(--accent-soft)]"
          : "border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] text-[var(--text-muted)]"
      }`}
    >
      {label}
    </span>
  );
}

export function InfoLine({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_60%,transparent)] py-2 last:border-0">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <p className={`text-sm text-[var(--text-strong)] ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export function CredentialLine({
  label,
  value,
  mono = false,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="rounded-[0.8rem] border border-[color:color-mix(in_srgb,var(--border-soft)_74%,transparent)] bg-[var(--surface)] px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
          <p className={`mt-1 break-all text-sm text-[var(--text-strong)] ${mono ? "font-mono" : ""}`}>{value}</p>
        </div>
        {onCopy ? (
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-[0.65rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function CodePanel({
  title,
  emptyMessage,
  primaryAction,
  children,
}: {
  title: string;
  emptyMessage: string;
  primaryAction?: { label: string; onClick: () => void } | null;
  children: ReactNode;
}) {
  const hasContent = Boolean(children);

  return (
    <div className="rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[1.08rem] font-semibold text-[var(--text-strong)]">{title}</p>
        {primaryAction ? (
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-[0.65rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
            onClick={primaryAction.onClick}
          >
            <Copy className="h-4 w-4" />
            {primaryAction.label}
          </Button>
        ) : null}
      </div>

      <div className="mt-3">
        {hasContent ? (
          children
        ) : (
          <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function consumerFlowHint(authType: string) {
  if (authType === "BASIC") {
    return "Use the consumer username and password directly on the route.";
  }

  if (authType === "API_KEY") {
    return "Hand off the issued API key and send it as X-API-Key.";
  }

  if (authType === "JWT") {
    return "Login here first, then forward the access token as Bearer.";
  }

  return "Open route with no consumer credential required.";
}
