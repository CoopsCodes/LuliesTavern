"use client";

import { useActionState, useEffect, useState } from "react";
import { createStaffAccount } from "./actions";

const inputClass =
  "rounded-md border border-border-input bg-bg-input px-2.5 py-2 text-sm text-text-primary outline-none focus:border-accent-green";
const labelClass =
  "flex flex-col gap-1 text-xs font-medium text-text-secondary";

export function AddStaffForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createStaffAccount,
    undefined,
  );

  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-accent-green hover:underline"
      >
        + Add User
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="flex w-full max-w-[320px] flex-col gap-3 rounded-lg border border-dashed border-border-input p-4"
    >
      <label className={labelClass}>
        Full Name
        <input name="name" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Email
        <input name="email" type="email" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Password
        <input
          name="password"
          type="password"
          required
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        4-Digit PIN
        <input
          name="pin"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          required
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Role
        <select name="role" defaultValue="user" className={inputClass}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent-green px-4 py-2 text-sm font-bold text-text-on-accent disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create Account"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm font-semibold text-text-secondary hover:text-text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
