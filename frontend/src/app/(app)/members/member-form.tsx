"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { MemberFormState } from "./actions";

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  member_number: string;
  active: boolean;
};

type FormAction = (
  prevState: MemberFormState,
  formData: FormData,
) => Promise<MemberFormState>;

const inputClass =
  "rounded-lg border border-border-input bg-bg-input px-3 py-2.5 text-[15px] text-text-primary outline-none focus:border-accent-green";
const labelClass =
  "flex flex-col gap-1.5 text-sm font-medium text-text-secondary";

export function MemberForm({
  action,
  member,
}: {
  action: FormAction;
  member?: Member;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const reassignRef = useRef<HTMLInputElement>(null);
  const [conflictDismissed, setConflictDismissed] = useState(false);
  const [firstName, setFirstName] = useState(member?.first_name ?? "");
  const [lastName, setLastName] = useState(member?.last_name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [numberValue, setNumberValue] = useState(member?.member_number ?? "");

  const conflict = state && "conflict" in state ? state.conflict : undefined;
  const errorMessage = state && "error" in state ? state.error : undefined;

  useEffect(() => {
    if (conflict) setConflictDismissed(false);
  }, [conflict]);

  function confirmReassign() {
    if (reassignRef.current) reassignRef.current.value = "true";
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <input
        ref={reassignRef}
        type="hidden"
        name="reassign_number"
        defaultValue=""
      />

      <div className="grid grid-cols-2 gap-4">
        <label className={labelClass}>
          First Name
          <input
            name="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Last Name
          <input
            name="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Email
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </label>

      <div className="flex items-end gap-6">
        <label className={`flex-1 ${labelClass}`}>
          Member Number
          <input
            name="member_number"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <ActiveToggle defaultChecked={member?.active ?? true} />
      </div>

      {conflict && !conflictDismissed && (
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-accent-blue/60 bg-bg-input p-4">
          <p className="text-sm text-text-primary">
            Badge #{numberValue} was previously used by{" "}
            <span className="font-semibold">{conflict.memberName}</span>, who is
            now inactive. Reassign it to this member?
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={confirmReassign}
              className="px-4 py-2 text-sm"
            >
              Reassign Number
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-4 py-2 text-sm"
              onClick={() => setConflictDismissed(true)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

      <div className="mt-2 flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save Member"}
        </Button>
        <Link href="/members">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}

function ActiveToggle({ defaultChecked }: { defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="flex cursor-pointer items-center gap-2 pb-2.5">
      <span className="relative inline-block h-6 w-11 shrink-0">
        <input
          type="checkbox"
          name="active"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-bg-input transition-colors peer-checked:bg-accent-green" />
        <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-text-primary transition-transform peer-checked:translate-x-5" />
      </span>
      <span className="text-sm font-medium text-text-secondary">
        {checked ? "Active" : "Inactive"}
      </span>
    </label>
  );
}
