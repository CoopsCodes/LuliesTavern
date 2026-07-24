"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/members", label: "Members" },
  { href: "/spin", label: "Spin" },
  { href: "/winners", label: "Winners" },
  { href: "/settings", label: "Settings" },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="flex bg-bg-tabbar">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 border-b-[3px] py-4 text-center text-sm font-bold transition-colors ${
              active
                ? "border-accent-green text-accent-green"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
