"use client";

import { Check, KeyRound, Shield, ShieldCheck, UserRound } from "lucide-react";

import { CodePanel, CredentialLine, EmptyRow, MetricCard } from "./ui-primitives";

export function ClientTabPlaceholder() {
  return (
    <section className="space-y-4">
      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-5 py-5">
        <p className="text-[1.9rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">OAuth Clients</p>
        <p className="mt-1 max-w-3xl text-[1rem] text-[var(--text-muted)]">
          This area will manage OAuth clients from the IAM side of Stadoor. For now, use the IAM server and Postman flow when you need client credentials or authorization-code testing.
        </p>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <MetricCard icon={<ShieldCheck className="h-5 w-5" />} value={0} label="Registered Clients" helper="IAM-backed app identities" />
        <MetricCard icon={<KeyRound className="h-5 w-5" />} value={0} label="Confidential Apps" helper="Client secret protected" />
        <MetricCard icon={<UserRound className="h-5 w-5" />} value={0} label="Trusted Redirects" helper="Frontends and BFF callbacks" />
      </section>
      <EmptyRow message="Client management is planned under IAM. The navigation is ready; the working flow will come after the gateway and consumer domains are stable." />
    </section>
  );
}

export function RoleTabPlaceholder() {
  return (
    <section className="space-y-4">
      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-5 py-5">
        <p className="text-[1.9rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Roles & Authorities</p>
        <p className="mt-1 max-w-3xl text-[1rem] text-[var(--text-muted)]">
          Roles belong to the IAM side of Stadoor. This screen is reserved for platform permissions such as tenant admins, gateway operators, and readonly members.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<Shield className="h-5 w-5" />} value={0} label="Tenant Roles" helper="Workspace-level access" />
        <MetricCard icon={<ShieldCheck className="h-5 w-5" />} value={0} label="Authorities" helper="Fine-grained permissions" />
        <MetricCard icon={<UserRound className="h-5 w-5" />} value={0} label="Assigned Users" helper="Mapped from IAM identities" />
        <MetricCard icon={<Check className="h-5 w-5" />} value={0} label="Policies Applied" helper="Role-based access rules" />
      </section>
      <EmptyRow message="Role management is not wired yet. We can add it once you define the IAM role hierarchy from your final Stadoor design." />
    </section>
  );
}

export function UserTabPlaceholder() {
  return (
    <section className="space-y-4">
      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-5 py-5">
        <p className="text-[1.9rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">IAM Users</p>
        <p className="mt-1 max-w-3xl text-[1rem] text-[var(--text-muted)]">
          This screen will manage platform users from the IAM side of Stadoor, separate from gateway consumers and runtime credentials.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<UserRound className="h-5 w-5" />} value={0} label="Platform Users" helper="Developer and operator identities" />
        <MetricCard icon={<ShieldCheck className="h-5 w-5" />} value={0} label="Verified Accounts" helper="Enabled IAM identities" />
        <MetricCard icon={<KeyRound className="h-5 w-5" />} value={0} label="MFA Enrolled" helper="Additional login assurance" />
        <MetricCard icon={<Check className="h-5 w-5" />} value={0} label="Active Sessions" helper="Portal sign-in activity" />
      </section>
      <EmptyRow message="IAM user management is a placeholder for now. Gateway consumers stay in the Consumers tab under the Gateway section." />
    </section>
  );
}

export function IamSettingsPlaceholder() {
  return (
    <section className="space-y-4">
      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-4 py-4">
        <p className="text-[1.9rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">IAM Settings</p>
        <p className="mt-1 max-w-3xl text-[1rem] text-[var(--text-muted)]">
          These settings belong to the IAM domain, such as tenant-wide identity policy, login rules, session lifetime, and default authority mapping.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<Shield className="h-5 w-5" />} value={0} label="Password Policies" helper="Tenant login requirements" />
        <MetricCard icon={<ShieldCheck className="h-5 w-5" />} value={0} label="Session Rules" helper="Portal and token defaults" />
        <MetricCard icon={<KeyRound className="h-5 w-5" />} value={0} label="MFA Profiles" helper="Second-factor templates" />
        <MetricCard icon={<Check className="h-5 w-5" />} value={0} label="Audit Hooks" helper="Identity event destinations" />
      </section>
      <EmptyRow message="IAM Settings is a placeholder for now. The personal developer profile settings can be designed separately later." />
    </section>
  );
}

export function TunnelCliPlaceholder() {
  return (
    <section className="space-y-4">
      <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-5 py-5">
        <p className="text-[1.9rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Tunnel CLI</p>
        <p className="mt-1 max-w-3xl text-[1rem] text-[var(--text-muted)]">
          Tunnel CLI will help developers expose local services into Stadoor during development. It stays top-level because it is operational tooling, not part of Gateway or IAM management.
        </p>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-5 py-5">
          <p className="text-[1.2rem] font-semibold text-[var(--text-strong)]">Planned Flow</p>
          <div className="mt-4 space-y-3 text-[1rem] text-[var(--text-muted)]">
            <p>1. Install the Stadoor CLI.</p>
            <p>2. Authenticate with your tenant token.</p>
            <p>3. Open a secure tunnel to your local service.</p>
            <p>4. Bind the tunnel to a BFF or API gateway service entry.</p>
          </div>
        </section>
        <CodePanel title="Example Command" emptyMessage="">
          <div className="space-y-3">
            <CredentialLine label="Login" value="stadoor tunnel login" mono />
            <CredentialLine label="Expose service" value="stadoor tunnel open --service customer-service --port 8091" mono />
          </div>
        </CodePanel>
      </div>
      <EmptyRow message="Tunnel CLI is reserved as the third main area. We can design the real install and connect flow next when you are ready." />
    </section>
  );
}
