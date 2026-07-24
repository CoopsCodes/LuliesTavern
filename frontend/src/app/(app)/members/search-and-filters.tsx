"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function SearchAndFilters({
  counts,
}: {
  counts: { all: number; active: number; inactive: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();
  const status = searchParams.get("status") ?? "all";

  useEffect(() => {
    const timeout = setTimeout(() => updateParams({ q: query || null }), 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "all") params.delete(key);
      else params.set(key, value);
    }
    startTransition(() => {
      router.replace(
        params.size ? `${pathname}?${params.toString()}` : pathname,
      );
    });
  }

  const chips = [
    { key: "all", label: "All", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "inactive", label: "Inactive", count: counts.inactive },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or member number"
        className="min-w-60 flex-1 rounded-lg border border-border-input bg-bg-input px-3 py-2.5 text-[15px] text-text-primary outline-none focus:border-accent-green"
      />
      <div className="flex gap-2">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => updateParams({ status: chip.key })}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              status === chip.key
                ? "bg-accent-green text-text-on-accent"
                : "bg-bg-input text-text-secondary hover:text-text-primary"
            }`}
          >
            {chip.label} ({chip.count})
          </button>
        ))}
      </div>
    </div>
  );
}
