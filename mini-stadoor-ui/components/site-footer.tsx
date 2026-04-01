import Image from "next/image";

import { StadoorLogo } from "@/components/stadoor-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_88%,var(--background))]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.75fr] lg:items-start">
          <div>
            <StadoorLogo
              className="items-start"
              iconClassName="h-10 w-10"
              wordmarkClassName="text-2xl uppercase tracking-[-0.04em] text-[var(--text-strong)]"
              subtitleClassName="hidden"
            />
            <p className="mt-6 max-w-sm text-[15px] leading-8 text-[var(--text-muted)]">
              A developer security platform for onboarding APIs or frontend apps with easier
              gateway, policy, and access management.
            </p>
          </div>

          <FooterColumn
            title="Platform"
            items={["Reactive Services", "Gateway Runtime", "Discovery Layer", "Microfrontend Portal"]}
          />
          <FooterColumn
            title="Management"
            items={["Service Registration", "Dynamic Routes", "Security Policies", "Notification"]}
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">Organized by</p>
            <div className="mt-4 flex h-[116px] items-center justify-center px-2">
              <Image
                src="/images/istad-logo-text.png"
                alt="ISTAD logo"
                width={132}
                height={126}
                className="h-auto max-h-[72px] w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[color:color-mix(in_srgb,var(--border-soft)_70%,transparent)] pt-6 text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)] md:flex-row md:items-center md:justify-between">
          <p>© 2026 stadoor platform. all_rights_reserved.</p>
          <div className="flex flex-wrap gap-5">
            <span>Privacy Policy</span>
            <span>Terms of Access</span>
            <span>Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)]">{title}</p>
      <div className="mt-4 space-y-4 text-[15px] text-[var(--text-muted)]">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
