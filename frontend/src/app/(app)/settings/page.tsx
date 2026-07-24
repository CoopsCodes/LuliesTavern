import { apiJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { AddStaffForm } from "./add-staff-form";
import { MyAccountForm } from "./my-account-form";
import { toggleStaffActive } from "./actions";

type StaffUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  active: boolean;
};
type AuditEntry = {
  id: number;
  actor_name: string;
  action_type: string;
  description: string;
  created_at: string;
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isAdmin = user.role === "admin";
  const [staff, auditLog] = isAdmin
    ? await Promise.all([
        apiJson<StaffUser[]>("/admin/users"),
        apiJson<AuditEntry[]>("/admin/audit_log"),
      ])
    : [null, null];

  return (
    <div className="mx-auto flex max-w-180 flex-col gap-6">
      <h1 className="font-heading text-[26px] font-bold text-text-primary">
        Settings
      </h1>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-bold text-text-primary">My Account</h2>
        <div className="mb-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-secondary">Name</p>
            <p className="font-semibold text-text-primary">{user.name}</p>
          </div>
          <div>
            <p className="text-text-secondary">Role</p>
            <p className="font-semibold text-text-primary capitalize">
              {user.role}
            </p>
          </div>
        </div>
        <MyAccountForm />
      </Card>

      {isAdmin && staff && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">
              Staff Accounts
            </h2>
            <AddStaffForm />
          </div>
          <div className="flex flex-col">
            {staff.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 border-b border-border-default py-3 text-sm last:border-b-0"
              >
                <div className="flex-1">
                  <p className="font-semibold text-text-primary">{s.name}</p>
                  <p className="text-text-secondary">{s.email}</p>
                </div>
                <span className="rounded-full bg-bg-input px-2.5 py-1 text-xs font-semibold text-text-secondary uppercase">
                  {s.role}
                </span>
                <StatusPill active={s.active} />
                <form action={toggleStaffActive.bind(null, s.id, !s.active)}>
                  <button
                    type="submit"
                    className="text-sm font-semibold text-accent-green hover:underline"
                  >
                    {s.active ? "Deactivate" : "Activate"}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </Card>
      )}

      {isAdmin && auditLog && (
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-text-primary">
            Activity Log
          </h2>
          <ul className="flex flex-col gap-3 text-sm">
            {auditLog.length === 0 && (
              <li className="text-text-muted">No activity yet.</li>
            )}
            {auditLog.map((entry) => (
              <li
                key={entry.id}
                className="flex justify-between gap-4 border-b border-border-default pb-3 last:border-b-0 last:pb-0"
              >
                <span className="text-text-secondary">{entry.description}</span>
                <span className="shrink-0 text-text-muted">
                  {new Date(entry.created_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
