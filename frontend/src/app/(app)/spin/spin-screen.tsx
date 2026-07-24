"use client";

import { useRef, useState } from "react";
import { spin as spinAction } from "./actions";

type Winner = { member_name: string; member_number: string };

const SPIN_DURATION_MS = 4200;
const TICKER_INTERVAL_MS = 65;

export function SpinScreen({ eligibleNumbers }: { eligibleNumbers: string[] }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [tickerValue, setTickerValue] = useState<string | null>(null);
  const [tickerCaption, setTickerCaption] = useState<
    "ready" | "drawing" | "result"
  >("ready");
  const [winner, setWinner] = useState<Winner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tickerTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function handleSpin() {
    if (spinning || eligibleNumbers.length === 0) return;
    setError(null);
    setSpinning(true);
    setTickerCaption("drawing");
    setRotation((r) => r + 360 * 5 + Math.floor(Math.random() * 360));

    tickerTimer.current = setInterval(() => {
      const random =
        eligibleNumbers[Math.floor(Math.random() * eligibleNumbers.length)];
      setTickerValue(random);
    }, TICKER_INTERVAL_MS);

    const [result] = await Promise.all([
      spinAction(),
      new Promise((resolve) => setTimeout(resolve, SPIN_DURATION_MS)),
    ]);

    if (tickerTimer.current) clearInterval(tickerTimer.current);

    if (!result.ok) {
      setError(result.error);
      setSpinning(false);
      setTickerCaption("ready");
      setTickerValue(null);
      return;
    }

    setTickerValue(result.winner.member_number);
    setTickerCaption("result");
    setWinner(result.winner);
    setSpinning(false);
  }

  return (
    <div className="mx-auto flex max-w-[520px] flex-col items-center gap-6 text-center">
      <div>
        <h1 className="font-heading text-[28px] font-bold text-text-primary">
          Weekly Draw
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {eligibleNumbers.length} active member
          {eligibleNumbers.length === 1 ? "" : "s"} eligible this week
        </p>
      </div>

      <Wheel rotation={rotation} />

      <div className="w-full max-w-[320px] rounded-xl bg-black/40 px-6 py-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
        <p className="text-xs font-semibold tracking-[1.5px] text-text-muted uppercase">
          {tickerCaption === "ready" && "Ready"}
          {tickerCaption === "drawing" && "Drawing…"}
          {tickerCaption === "result" && "Last Result"}
        </p>
        <p className="mt-1 font-mono text-4xl font-bold text-accent-blue tabular-nums">
          {tickerValue ? `#${tickerValue}` : "----"}
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleSpin}
        disabled={spinning || eligibleNumbers.length === 0}
        className="w-full max-w-[320px] rounded-lg bg-accent-green py-3 text-[16px] font-bold text-text-on-accent transition-colors hover:bg-accent-green-hover disabled:opacity-60"
      >
        {spinning ? "Spinning…" : "Spin the Wheel"}
      </button>

      {winner && (
        <WinnerModal winner={winner} onClose={() => setWinner(null)} />
      )}
    </div>
  );
}

function Wheel({ rotation }: { rotation: number }) {
  const segments = Array.from({ length: 24 }, (_, i) => {
    const color =
      i % 2 === 0 ? "var(--color-accent-green)" : "var(--color-bg-input)";
    return `${color} ${(i / 24) * 360}deg ${((i + 1) / 24) * 360}deg`;
  });
  const gradient = `conic-gradient(${segments.join(", ")})`;

  return (
    <div className="relative h-[380px] w-[380px]">
      <div className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[20px] border-x-transparent border-t-accent-blue" />
      <div
        className="h-full w-full rounded-full border-4 border-border-default ease-[cubic-bezier(0.15,0.6,0.15,1)]"
        style={{
          background: gradient,
          transform: `rotate(${rotation}deg)`,
          transitionProperty: "transform",
          transitionDuration: `${SPIN_DURATION_MS}ms`,
        }}
      />
      <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg-card font-heading text-lg font-bold text-accent-blue shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        LT
      </div>
    </div>
  );
}

function WinnerModal({
  winner,
  onClose,
}: {
  winner: Winner;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[400px] rounded-2xl bg-bg-card p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <p className="text-sm font-semibold tracking-[1.5px] text-text-secondary uppercase">
          This Week&apos;s Winner
        </p>
        <p className="mt-3 font-heading text-3xl font-bold text-text-primary">
          {winner.member_name}
        </p>
        <p className="mt-2 text-lg font-bold text-accent-blue">
          Badge #{winner.member_number}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-accent-green py-3 text-[16px] font-bold text-text-on-accent hover:bg-accent-green-hover"
        >
          Done — Added to Winners
        </button>
      </div>
    </div>
  );
}
