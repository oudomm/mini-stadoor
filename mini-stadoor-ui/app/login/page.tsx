import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Waypoints,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StadoorLogo } from "@/components/stadoor-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { getPortalSession } from "@/lib/platform-auth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getPortalSession();
  if (session) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const hasError = Boolean(params?.error);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-strong)]">
      <div className="grid min-h-screen lg:grid-cols-[0.98fr_1.02fr]">
        <aside className="relative hidden overflow-hidden border-r border-white/6 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_32%),linear-gradient(180deg,color-mix(in_srgb,var(--surface)_88%,var(--background))_0%,var(--background)_100%)] lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px] opacity-[0.08]" />
          <div className="relative flex h-full flex-col justify-between px-10 py-10">
            <StadoorLogo
              wordmarkClassName="text-2xl text-[var(--accent)]"
              subtitleClassName="text-[var(--text-faint)]"
              iconClassName="h-12 w-12"
            />

            <div className="max-w-xl">
              <div className="space-y-4 font-mono text-sm text-[var(--text-muted)]">
                <SignalLine time="08:42:11" tag="platform" text="Gateway policy surface initialized." />
                <SignalLine time="08:42:12" tag="secure" text="Service registration channel online." />
                <SignalLine time="08:42:13" tag="policy" text="Basic and API key flows available." />
                <SignalLine time="08:42:14" tag="status" text="Awaiting developer authentication." />
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                  developer_access
                </p>
                <h1 className="mt-4 max-w-lg text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--text-strong)]">
                  Access the
                  <span className="block text-[var(--accent)]">Stadoor control plane.</span>
                </h1>
                <p className="mt-5 max-w-lg text-lg leading-8 text-[var(--text-muted)]">
                  Sign in to manage developer services, dynamic routes, and route-level security from
                  one operational workspace.
                </p>
              </div>

              <div className="max-w-xl border-t border-white/8 pt-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <SignalStat icon={<Waypoints className="h-4 w-4" />} label="Dynamic Routes" value="Live" />
                  <SignalStat icon={<ShieldCheck className="h-4 w-4" />} label="Security Modes" value="3" />
                  <SignalStat icon={<KeyRound className="h-4 w-4" />} label="IAM" value="Planned" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="relative flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:34px_34px] opacity-[0.08]" />

          <div className="relative w-full max-w-xl">
            <div className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_88%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_92%,transparent)_100%)] p-7 shadow-[0_30px_80px_var(--glow)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                    developer_access
                  </p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--text-strong)]">
                    Log in
                  </h2>
                <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
                    Sign in with the copied iam-server so dashboard access is tied to real platform identity.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)] sm:block">
                    iam login
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              {hasError ? (
                <div className="mt-7 rounded-[1rem] border border-red-500/25 bg-red-500/8 px-4 py-3 text-sm text-red-300">
                  The IAM login flow did not complete. Try again.
                </div>
              ) : null}

              <div className="mt-7 space-y-5">
                <div className="rounded-[1rem] border border-white/8 bg-[var(--surface-muted)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">Demo identity</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Username</Label>
                      <Input value="oudom" readOnly className="border-white/8 bg-[var(--field)] text-[var(--text-strong)]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Password</Label>
                      <Input value="qwer" readOnly className="border-white/8 bg-[var(--field)] text-[var(--text-strong)]" />
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  variant="brand"
                  size="lg"
                  className="h-14 w-full rounded-[1rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_0_32px_var(--glow)] hover:bg-[var(--accent-bright)]"
                >
                  <Link href="/api/auth/login">
                    Continue with IAM
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--text-muted)]">
                  Need platform access lifecycle?{" "}
                  <Link href="/register" className="font-semibold text-[var(--accent-soft)]">
                    Review IAM onboarding
                  </Link>
                </p>
                <Link href="/" className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text-strong)]">
                  Back to landing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SignalLine({
  time,
  tag,
  text,
}: {
  time: string;
  tag: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[var(--text-faint)]">{time}</span>
      <span className="font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">[{tag}]</span>
      <span>{text}</span>
    </div>
  );
}

function SignalStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-l border-white/8 pl-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--surface-soft)] text-[var(--accent-soft)]">
        {icon}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[var(--text-strong)]">{value}</p>
    </div>
  );
}
