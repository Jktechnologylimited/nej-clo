"use client";

import { useEffect, useState } from "react";

function getRemaining(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function Countdown({ target }: { target: string }) {
  const targetDate = new Date(target);
  // Start as null so the very first client render matches the server
  // render exactly (both show the placeholder). Date.now() is only ever
  // evaluated after mount, never during SSR or hydration.
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing a clock to real time, not deriving state from props
    setRemaining(getRemaining(targetDate));
    const id = setInterval(() => setRemaining(getRemaining(targetDate)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const display = remaining ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <div className="flex gap-4 font-mono-data text-2xl font-bold tracking-tight text-paper sm:text-4xl">
      {[
        ["DAYS", display.days],
        ["HRS", display.hours],
        ["MIN", display.minutes],
        ["SEC", display.seconds],
      ].map(([label, value]) => (
        <div key={label as string} className="text-center">
          <div>{pad(value as number)}</div>
          <div className="mt-1 text-[10px] font-normal tracking-[0.2em] text-paper/40">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
