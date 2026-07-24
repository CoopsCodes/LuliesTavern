import Link from "next/link";
import { apiJson } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { SearchAndFilters } from "./search-and-filters";

type Member = {
  id: number;
  full_name: string;
  email: string | null;
  member_number: string;
  active: boolean;
  old_numbers: { id: number; number: string; retired_on: string }[];
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);

  const [members, allMembers] = await Promise.all([
    apiJson<Member[]>(`/members?${params.toString()}`),
    apiJson<Member[]>("/members"),
  ]);

  const counts = {
    all: allMembers.length,
    active: allMembers.filter((m) => m.active).length,
    inactive: allMembers.filter((m) => !m.active).length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[26px] font-bold text-text-primary">
          Members
        </h1>
        <Link href="/members/new">
          <Button>+ Add Member</Button>
        </Link>
      </div>

      <SearchAndFilters counts={counts} />

      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="grid grid-cols-[2fr_2fr_1fr_1.5fr_1fr_auto] gap-4 border-b border-border-default bg-bg-panel px-5 py-3 text-xs font-semibold tracking-wide text-text-secondary uppercase">
          <span>Name</span>
          <span>Email</span>
          <span>Number</span>
          <span>Old Numbers</span>
          <span>Status</span>
          <span />
        </div>

        {members.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-text-muted">
            No members match your search.
          </p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-[2fr_2fr_1fr_1.5fr_1fr_auto] items-center gap-4 border-b border-border-default px-5 py-4 text-sm last:border-b-0"
            >
              <span className="font-semibold text-text-primary">
                {member.full_name}
              </span>
              <span className="text-text-secondary">{member.email || "—"}</span>
              <span className="font-bold text-accent-blue">
                #{member.member_number}
              </span>
              <span className="text-text-secondary">
                {member.old_numbers.length > 0
                  ? member.old_numbers.map((n) => `#${n.number}`).join(", ")
                  : "—"}
              </span>
              <StatusPill active={member.active} />
              <Link href={`/members/${member.id}/edit`}>
                <Button variant="outline" className="px-3 py-1.5 text-xs">
                  Edit
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
