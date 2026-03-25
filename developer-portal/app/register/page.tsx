import Link from "next/link";
import {
  ArrowRight,
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

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden border-r border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(0,255,65,0.08),transparent_34%),linear-gradient(180deg,#0d0f0d_0%,#0a0a0a_100%)] lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.08]" />
          <div className="relative flex h-full flex-col justify-between px-10 py-10">
            <StadoorLogo
              wordmarkClassName="text-2xl text-[#00ff41]"
              subtitleClassName="text-white/38"
            />

            <div className="max-w-xl rounded-[1.6rem] border border-white/8 bg-black/20 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8fff8b]">
                onboarding_surface
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white">
                Create your developer
                <span className="block text-[#00ff41]">workspace identity.</span>
              </h2>
              <p className="mt-5 text-base leading-8 text-white/60">
                Start with a clean account shell today, then connect it later to IAM, OAuth2, and
                the full Mini Stadoor access model.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <RegisterStat icon={<BadgeCheck className="h-4 w-4" />} label="Portal" value="Ready" />
                <RegisterStat icon={<ShieldCheck className="h-4 w-4" />} label="Security" value="Live" />
                <RegisterStat icon={<KeyRound className="h-4 w-4" />} label="IAM" value="Next" />
              </div>
            </div>

            <div className="space-y-3 font-mono text-sm text-white/70">
              <div className="flex items-center gap-3">
                <span className="text-[#00ff41]">&gt;</span>
                initialize developer namespace
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#00ff41]">&gt;</span>
                prepare gateway management workspace
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#00ff41]">&gt;</span>
                reserve future identity bindings
              </div>
            </div>
          </div>
        </aside>

        <section className="relative flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,65,0.12),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:34px_34px] opacity-[0.08]" />

          <div className="relative w-full max-w-2xl">
            <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,20,20,0.92)_0%,rgba(14,14,14,0.98)_100%)] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8fff8b]">
                    developer_onboarding
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                    Create account
                  </h1>
                  <p className="mt-3 max-w-xl text-base leading-7 text-white/56">
                    This is a polished prototype flow for now. It will later connect to real IAM while
                    keeping the same Mini Stadoor onboarding experience.
                  </p>
                </div>
                <div className="hidden rounded-full border border-[#00ff41]/18 bg-[#101810] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aff9d] sm:block">
                  preview signup
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <GhostAuthButton label="Continue with GitHub" />
                <GhostAuthButton label="Continue with Google" />
              </div>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/8" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/32">
                  or create with email
                </p>
                <div className="h-px flex-1 bg-white/8" />
              </div>

              <form action="/dashboard" className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-[11px] uppercase tracking-[0.2em] text-white/44">
                    Full name
                  </Label>
                  <Input
                    id="full-name"
                    defaultValue="John Doe"
                    className="border-white/8 bg-[#2b2f36] text-white placeholder:text-white/22 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[11px] uppercase tracking-[0.2em] text-white/44">
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue="@handle"
                    className="border-white/8 bg-[#2b2f36] text-white placeholder:text-white/22 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.2em] text-white/44">
                    Work email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="dev@company.com"
                    className="border-white/8 bg-[#2b2f36] text-white placeholder:text-white/22 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                  />
                  <p className="text-sm text-[#8fff8b]">Verified developer domains will fit future IAM onboarding best.</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password" className="text-[11px] uppercase tracking-[0.2em] text-white/44">
                    Secure password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    defaultValue="password"
                    className="border-white/8 bg-[#2b2f36] text-white placeholder:text-white/22 focus-visible:border-[#00ff41]/35 focus-visible:ring-[#00ff41]/10"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <span className="h-1.5 rounded-full bg-[#00ff41]" />
                    <span className="h-1.5 rounded-full bg-[#00ff41]" />
                    <span className="h-1.5 rounded-full bg-white/12" />
                    <span className="h-1.5 rounded-full bg-white/12" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/44">
                    <span>Strength: Strong</span>
                    <span>Entropy: 78 bits</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    className="h-14 w-full rounded-[1rem] border border-[#00ff41]/30 bg-[#00ff41] text-black shadow-[0_0_32px_rgba(0,255,65,0.18)] hover:bg-[#74ff96]"
                  >
                    Initialize account
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-white/46">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-[#8fff8b]">
                    Log in
                  </Link>
                </p>
                <div className="flex items-center gap-2 rounded-full border border-white/8 bg-black/18 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  <UserRound className="h-3.5 w-3.5 text-[#00ff41]" />
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
      className="flex h-14 items-center justify-center rounded-[1rem] border border-white/8 bg-[#2a2f36] text-sm font-medium text-white transition hover:border-white/14 hover:bg-[#323842]"
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
    <div className="rounded-[1.1rem] border border-white/8 bg-black/20 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#132113] text-[#8fff8b]">
        {icon}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
