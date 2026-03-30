"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronRight,
  Cable,
  Fingerprint,
  Grid2x2,
  KeyRound,
  Route,
  Server,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  Waypoints,
} from "lucide-react";

import type { DashboardTab } from "../components/developer-portal/model";

type SidebarGroupKey = "gateway" | "iam";

type SidebarItem = {
  key: DashboardTab;
  label: string;
  icon: LucideIcon;
};

type SidebarStandaloneItem = {
  key: DashboardTab;
  label: string;
  icon: LucideIcon;
};

type SidebarGroup = {
  key: SidebarGroupKey;
  label: string;
  icon: LucideIcon;
  items: SidebarItem[];
};

const standaloneItems: SidebarStandaloneItem[] = [
  { key: "dashboard", label: "Welcome", icon: Grid2x2 },
];

const sidebarGroups: SidebarGroup[] = [
  {
    key: "iam",
    label: "IAM",
    icon: ShieldCheck,
    items: [
      { key: "clients", label: "Client", icon: Cable },
      { key: "roles", label: "Role", icon: KeyRound },
      { key: "users", label: "User", icon: UserRound },
      { key: "settings", label: "Settings", icon: Settings },
    ],
  },
  {
    key: "gateway",
    label: "Gateway",
    icon: Waypoints,
    items: [
      { key: "gateways", label: "Gateways", icon: Waypoints },
      { key: "services", label: "Services", icon: Server },
      { key: "routes", label: "Routes", icon: Route },
      { key: "consumers", label: "Consumers", icon: Users },
    ],
  },
];

const trailingStandaloneItems: SidebarStandaloneItem[] = [
  { key: "tunnel-cli", label: "Tunnel CLI", icon: Fingerprint },
];

function groupForTab(tab: DashboardTab): SidebarGroupKey | null {
  if (tab === "dashboard" || tab === "tunnel-cli") {
    return null;
  }
  if (tab === "clients" || tab === "roles" || tab === "users" || tab === "settings") {
    return "iam";
  }
  return "gateway";
}

export function SidebarNav({ activeTab }: { activeTab: DashboardTab }) {
  const activeGroup = groupForTab(activeTab);
  const [expandedGroups, setExpandedGroups] = useState<Record<SidebarGroupKey, boolean>>({
    gateway: true,
    iam: false,
  });

  useEffect(() => {
    if (!activeGroup) {
      return;
    }
    setExpandedGroups((current) => ({ ...current, [activeGroup]: true }));
  }, [activeGroup]);

  function toggleGroup(group: SidebarGroupKey) {
    setExpandedGroups((current) => ({
      ...current,
      [group]: !current[group],
    }));
  }

  return (
    <nav className="space-y-3 px-3 py-4">
      <div className="space-y-1.5">
        {standaloneItems.map((item) => {
          const ItemIcon = item.icon;
          const isActive = item.key === activeTab;

          return (
            <Link
              key={item.key}
              href={`/dashboard?tab=${item.key}`}
              className={`flex items-center gap-3 rounded-[0.95rem] px-3 py-3 text-[1rem] font-semibold transition ${
                isActive
                  ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                  : "text-[var(--accent-soft)] hover:bg-[color:color-mix(in_srgb,var(--surface-soft)_72%,transparent)]"
              }`}
            >
              <ItemIcon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {sidebarGroups.map((group) => {
        const GroupIcon = group.icon;
        const isExpanded = expandedGroups[group.key];
        const hasActiveItem = group.items.some((item) => item.key === activeTab);
        const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

        return (
          <div key={group.key} className="space-y-1.5">
            <button
              type="button"
              onClick={() => toggleGroup(group.key)}
              className={`flex w-full items-center justify-between rounded-[0.95rem] px-3 py-2.5 text-left transition ${
                hasActiveItem
                  ? "bg-[color:color-mix(in_srgb,var(--surface-soft)_88%,transparent)] text-[var(--text-strong)]"
                  : "text-[var(--accent-soft)] hover:bg-[color:color-mix(in_srgb,var(--surface-soft)_72%,transparent)]"
              }`}
              aria-expanded={isExpanded}
            >
              <span className="flex items-center gap-3">
                <GroupIcon className="h-5 w-5" />
                <span className="text-[0.98rem] font-semibold tracking-[0.12em] uppercase">
                  {group.label}
                </span>
              </span>
              <ChevronIcon className="h-4 w-4" />
            </button>

            {isExpanded ? (
              <div className="space-y-1 border-l border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] pl-3">
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = item.key === activeTab;

                  return (
                    <Link
                      key={item.key}
                      href={`/dashboard?tab=${item.key}`}
                      className={`flex items-center gap-3 rounded-[0.82rem] px-3.5 py-3 text-[1.02rem] font-medium transition ${
                        isActive
                          ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                          : "text-[var(--accent-soft)] hover:bg-[color:color-mix(in_srgb,var(--surface-soft)_88%,transparent)]"
                      }`}
                    >
                      <ItemIcon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="space-y-1.5">
        {trailingStandaloneItems.map((item) => {
          const ItemIcon = item.icon;
          const isActive = item.key === activeTab;

          return (
            <Link
              key={item.key}
              href={`/dashboard?tab=${item.key}`}
              className={`flex items-center gap-3 rounded-[0.95rem] px-3 py-3 text-[1rem] font-semibold transition ${
                isActive
                  ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                  : "text-[var(--accent-soft)] hover:bg-[color:color-mix(in_srgb,var(--surface-soft)_72%,transparent)]"
              }`}
            >
              <ItemIcon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
