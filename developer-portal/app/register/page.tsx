import Link from "next/link";
import {
  BadgeCheck,
  KeyRound,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StadoorLogo } from "@/components/stadoor-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-strong)]">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden border-r border-white/6 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_34%),linear-gradient(180deg,color-mix(in_srgb,var(--surface)_88%,var(--background))_0%,var(--background)_100%)] lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.08]" />
          <div className="relative flex h-full flex-col justify-between px-10 py-10">
            <StadoorLogo
              wordmarkClassName="text-2xl text-[var(--accent)]"
              subtitleClassName="text-[var(--text-faint)]"
            />

            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                onboarding_surface
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--text-strong)]">
                Create your developer
                <span className="block text-[var(--accent)]">workspace identity.</span>
              </h2>
              <p className="mt-5 text-base leading-8 text-[var(--text-muted)]">
                Start with a clean account shell today, then connect it later to IAM, OAuth2, and
                the full Mini Stadoor access model.
              </p>

              <div className="mt-8 grid gap-4 border-t border-white/8 pt-5 sm:grid-cols-3">
                <RegisterStat icon={<BadgeCheck className="h-4 w-4" />} label="Portal" value="Ready" />
                <RegisterStat icon={<ShieldCheck className="h-4 w-4" />} label="Security" value="Live" />
                <RegisterStat icon={<KeyRound className="h-4 w-4" />} label="IAM" value="Next" />
              </div>
            </div>

            <div className="space-y-3 font-mono text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <span className="text-[var(--accent)]">&gt;</span>
                initialize developer namespace
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#56e340]">&gt;</span>
                prepare gateway management workspace
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#56e340]">&gt;</span>
                reserve future identity bindings
              </div>
            </div>
          </div>
        </aside>

        <section className="relative flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:34px_34px] opacity-[0.08]" />

          <div className="relative w-full max-w-2xl">
            <div className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_88%,transparent)_0%,color-mix(in_srgb,var(--surface-muted)_92%,transparent)_100%)] p-7 shadow-[0_30px_80px_var(--glow)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-soft)]">
                    developer_onboarding
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--text-strong)]">
                    Create account
                  </h1>
                  <p className="mt-3 max-w-xl text-base leading-7 text-[var(--text-muted)]">
                    This is a polished prototype flow for now. It will later connect to real IAM while
                    keeping the same Mini Stadoor onboarding experience.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)] sm:block">
                    preview signup
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <GhostAuthButton label="Continue with GitHub" />
                <GhostAuthButton label="Continue with Google" />
              </div>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/8" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">
                  or create with email
                </p>
                <div className="h-px flex-1 bg-white/8" />
              </div>

              <form action="/dashboard" className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    Full name
                  </Label>
                  <Input
                    id="full-name"
                    defaultValue="John Doe"
                    className="border-white/8 bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_14%,transparent)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@handle"
                    className="border-white/8 bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_14%,transparent)]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    Work email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="dev@company.com"
                    className="border-white/8 bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_14%,transparent)]"
                  />
                  <p className="text-sm text-[var(--accent-soft)]">Verified developer domains will fit future IAM onboarding best.</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password" className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    Secure password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    defaultValue="password"
                    className="border-white/8 bg-[var(--field)] text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_14%,transparent)]"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <span className="h-1.5 rounded-full bg-[var(--accent)]" />
                    <span className="h-1.5 rounded-full bg-[var(--accent)]" />
                    <span className="h-1.5 rounded-full bg-white/12" />
                    <span className="h-1.5 rounded-full bg-white/12" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-[var(--text-faint)]">
                    <span>Strength: Strong</span>
                    <span>Entropy: 78 bits</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    className="h-14 w-full rounded-[1rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_0_32px_var(--glow)] hover:bg-[var(--accent-bright)]"
                  >
                    Initialize account
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--text-muted)]">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-[var(--accent-soft)]">
                    Log in
                  </Link>
                </p>
                <div className="flex items-center gap-2 rounded-full border border-white/8 bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  <UserRound className="h-3.5 w-3.5 text-[var(--accent)]" />
                  region: us-east-1 // secure
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function GhostAuthButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-14 items-center justify-center rounded-[0.95rem] border border-white/8 bg-[var(--surface-muted)] text-sm font-medium text-[var(--text-strong)] transition hover:border-white/14 hover:bg-[var(--surface-soft)]"
    >
      {label}
    </button>
  );
}

function RegisterStat({
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
