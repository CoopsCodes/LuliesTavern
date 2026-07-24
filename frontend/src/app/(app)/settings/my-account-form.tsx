"use client";

import { useActionState } from "react";
import { updateMyAccount } from "./actions";

const inputClass =
  "rounded-lg border border-border-input bg-bg-input px-3 py-2.5 text-[15px] text-text-primary outline-none focus:border-accent-green";
const labelClass =
  "flex flex-col gap-1.5 text-sm font-medium text-text-secondary";

export function MyAccountForm() {
  const [state, formAction, pending] = useActionState(
    updateMyAccount,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          New Password
          <input
            name="password"
            type="password"
            placeholder="Leave blank to keep current"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Quick-Access PIN
          <input
            name="pin"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            placeholder="Leave blank to keep current"
            className={inputClass}
          />
        </label>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-status-success-text">Saved.</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-accent-green px-5 py-2.5 text-sm font-bold text-text-on-accent transition-colors hover:bg-accent-green-hover disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
