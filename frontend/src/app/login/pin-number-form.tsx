"use client";

import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { loginWithPin } from "./actions";
import { StaffMember } from "./types";

const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export function PinNumberForm({
  selectedStaff,
  setSelectedStaff,
}: {
  selectedStaff: StaffMember;
  setSelectedStaff: Dispatch<SetStateAction<StaffMember | null>>;
}) {
  const [pinState, pinAction, pinPending] = useActionState(
    loginWithPin,
    undefined,
  );
  const [pin, setPin] = useState("");
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
  );
}
