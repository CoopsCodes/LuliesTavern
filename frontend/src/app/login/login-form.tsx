"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { loginWithPassword, loginWithPin } from "./actions";

const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

type StaffMember = { id: number; name: string; role: "admin" | "user" };

export function LoginForm({ staff }: { staff: StaffMember[] }) {
  const [mode, setMode] = useState<"password" | "pin">("pin");
  const [passwordState, passwordAction, passwordPending] = useActionState(
    loginWithPassword,
    undefined,
  );
  const [pinState, pinAction, pinPending] = useActionState(
    loginWithPin,
    undefined,
  );
  const [pin, setPin] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const pinFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (pin.length === 4 && !pinPending) {
      pinFormRef.current?.requestSubmit();
    }
  }, [pin, pinPending]);

  function pressKey(key: string) {
    if (pinPending || !key) return;
    if (key === "⌫") {
      setPin((p) => p.slice(0, -1));
    } else if (pin.length < 4) {
      setPin((p) => p + key);
    }
  }

  function deselectStaff() {
    setSelectedStaff(null);
    setPin("");
  }

  return (
    <div className="w-full max-w-[460px] rounded-2xl bg-bg-card p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-[32px] font-bold text-accent-green">
          Lulies Tavern
        </h1>
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
        <form
          ref={pinFormRef}
          action={pinAction}
          className="flex flex-col items-center gap-6"
        >
          <input type="hidden" name="user_id" value={selectedStaff.id} />
          <input type="hidden" name="pin" value={pin} />

          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={deselectStaff}
              className="text-sm font-semibold text-text-secondary hover:text-text-primary"
            >
              ← Back
            </button>
            <span className="text-[15px] font-semibold text-text-primary">
              {selectedStaff.name}
            </span>
            <span className="w-13" />
          </div>

          <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-full border border-border-input ${
                  i < pin.length ? "bg-accent-green" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {KEYPAD_KEYS.map((key, i) => (
              <button
                key={i}
                type="button"
                disabled={!key || pinPending}
                onClick={() => pressKey(key)}
                className={
                  key
                    ? "h-14 w-14 rounded-xl bg-bg-input text-lg font-semibold text-text-primary active:bg-border-input"
                    : "invisible h-14 w-14"
                }
              >
                {key}
              </button>
            ))}
          </div>
          {pinState?.error && (
            <p className="text-sm text-red-400">{pinState.error}</p>
          )}
          <button
            type="submit"
            disabled={pin.length !== 4 || pinPending}
            className="w-full rounded-lg bg-accent-green py-3 text-[16px] font-bold text-text-on-accent transition-colors hover:bg-accent-green-hover disabled:opacity-60"
          >
            {pinPending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      )}
    </div>
  );
}
