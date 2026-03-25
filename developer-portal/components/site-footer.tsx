import Image from "next/image";

import { StadoorLogo } from "@/components/stadoor-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/6 bg-[#111111]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.75fr] lg:items-start">
          <div>
            <StadoorLogo
              className="items-start"
              iconClassName="h-10 w-10"
              wordmarkClassName="text-2xl uppercase tracking-[-0.04em] text-[#8fff8b]"
              subtitleClassName="hidden"
            />
            <p className="mt-6 max-w-sm text-[15px] leading-8 text-white/56">
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">Organized by</p>
            <div className="mt-4 flex h-[116px] items-center justify-center px-2">
              <Image
                src="/images/istad-logo.png"
                alt="ISTAD logo"
                width={132}
                height={126}
                className="h-auto max-h-[72px] w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/6 pt-6 text-[11px] uppercase tracking-[0.18em] text-white/32 md:flex-row md:items-center md:justify-between">
          <p>© 2026 stadoor_systems_intl. all_signals_reserved.</p>
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
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">{title}</p>
      <div className="mt-4 space-y-4 text-[15px] text-white/58">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
