import { apiJson } from "@/lib/api";

type Winner = {
  id: number;
  drawn_at: string;
  member_name: string;
  member_number: string;
};

export default async function WinnersPage() {
  const winners = await apiJson<Winner[]>("/winners");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-[26px] font-bold text-text-primary">
        Winners History
      </h1>

      <div className="overflow-hidden rounded-xl border border-border-default">
        <div className="grid grid-cols-[1.5fr_2fr_1fr] gap-4 border-b border-border-default bg-bg-panel px-5 py-3 text-xs font-semibold tracking-wide text-text-secondary uppercase">
          <span>Date</span>
          <span>Member</span>
          <span>Badge #</span>
        </div>

        {winners.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-text-muted">
            No draws recorded yet.
          </p>
        ) : (
          winners.map((winner) => (
            <div
              key={winner.id}
              className="grid grid-cols-[1.5fr_2fr_1fr] items-center gap-4 border-b border-border-default px-5 py-4 text-sm last:border-b-0"
            >
              <span className="text-text-secondary">
                {new Date(winner.drawn_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="font-semibold text-text-primary">
                {winner.member_name}
              </span>
              <span className="font-bold text-accent-blue">
                #{winner.member_number}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
