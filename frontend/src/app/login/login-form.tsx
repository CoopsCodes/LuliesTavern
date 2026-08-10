"use client";

import { useActionState, useState } from "react";
import { loginWithPassword } from "./actions";
import { PinNumberForm } from "./pin-number-form";
import { StaffMember } from "./types";

export function LoginForm({ staff }: { staff: StaffMember[] }) {
  const [mode, setMode] = useState<"password" | "pin">("pin");
  const [passwordState, passwordAction, passwordPending] = useActionState(
    loginWithPassword,
    undefined,
  );
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  return (
    <div className="w-full max-w-115 rounded-2xl bg-bg-card p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="mb-8 text-center">
        <h1 className="neon-sign text-[44px] leading-none">Lulie Tavern</h1>
        <p className="mt-1 text-[13px] font-medium uppercase tracking-[1.5px] text-text-secondary">
          Member Badge Draws
        </p>
      </div>

      <div className="mb-6 flex rounded-full bg-bg-input p-1">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-full py-2 text-sm font-bold transition-colors ${
            mode === "password"
              ? "bg-accent-green text-text-on-accent"
              : "text-text-secondary"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("pin")}
          className={`flex-1 rounded-full py-2 text-sm font-bold transition-colors ${
            mode === "pin"
              ? "bg-accent-green text-text-on-accent"
              : "text-text-secondary"
          }`}
        >
          Quick PIN
        </button>
      </div>

      {mode === "password" ? (
        <form action={passwordAction} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-text-secondary">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="rounded-lg border border-border-input bg-bg-input px-3 py-2.5 text-[15px] text-text-primary outline-none focus:border-accent-green"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-text-secondary">
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-lg border border-border-input bg-bg-input px-3 py-2.5 text-[15px] text-text-primary outline-none focus:border-accent-green"
            />
          </label>
          {passwordState?.error && (
            <p className="text-sm text-red-400">{passwordState.error}</p>
          )}
          <button
            type="submit"
            disabled={passwordPending}
            className="mt-2 rounded-lg bg-accent-green py-3 text-[16px] font-bold text-text-on-accent transition-colors hover:bg-accent-green-hover disabled:opacity-60"
          >
            {passwordPending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      ) : selectedStaff === null ? (
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm font-medium text-text-secondary">
            Who&apos;s signing in?
          </p>
          {staff.length === 0 ? (
            <p className="text-center text-sm text-text-muted">
              No accounts with PIN access yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {staff.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => setSelectedStaff(person)}
                  className="flex flex-col items-center gap-1 rounded-xl bg-bg-input px-4 py-4 text-center transition-colors hover:bg-border-input"
                >
                  <span className="text-[15px] font-semibold text-text-primary">
                    {person.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <PinNumberForm
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
        />
      )}
    </div>
  );
}
