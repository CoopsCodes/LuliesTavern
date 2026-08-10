import { logout } from "@/app/login/actions";
import type { CurrentUser } from "@/lib/session";

export function Header({ user }: { user: CurrentUser }) {
  return (
    <header className="flex items-center justify-between bg-bg-header px-7 py-[18px]">
      <div className="text-center">
        <h1 className="neon-sign text-[30px] leading-none">Lulie St Tavern</h1>
        <p className="text-[13px] font-medium uppercase tracking-[1.5px] text-text-secondary">
          Member Badge Draws
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-text-primary">{user.name}</p>
          <p className="text-[11px] font-medium uppercase tracking-[1px] text-accent-green">
            {user.role === "admin" ? "Admin" : "Staff"}
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-border-default px-4 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
          >
            Log Out
          </button>
        </form>
      </div>
    </header>
  );
}
