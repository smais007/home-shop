"use client";

import { useEffect, useState } from "react";

import type { Countdown } from "@/types/database";

interface CountdownTimerProps {
  countdown: Countdown;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ countdown }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = new Date(countdown.end_date).getTime() - new Date().getTime();

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.end_date]);

  if (!timeLeft) {
    return null;
  }

  return (
    <div className="bg-muted/40 border-border/50 w-full rounded-2xl border px-6 py-10 text-center shadow-sm backdrop-blur-sm">
      {countdown.title && <h2 className="text-foreground mb-8 text-3xl font-bold tracking-tight">{countdown.title}</h2>}

      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="bg-background/70 border-border/40 rounded-xl border p-5 shadow-sm">
          <div className="text-primary text-4xl font-bold sm:text-5xl">{timeLeft.days}</div>
          <div className="text-muted-foreground mt-1 text-sm tracking-wide uppercase">Days</div>
        </div>

        <div className="bg-background/70 border-border/40 rounded-xl border p-5 shadow-sm">
          <div className="text-primary text-4xl font-bold sm:text-5xl">{timeLeft.hours}</div>
          <div className="text-muted-foreground mt-1 text-sm tracking-wide uppercase">Hours</div>
        </div>

        <div className="bg-background/70 border-border/40 rounded-xl border p-5 shadow-sm">
          <div className="text-primary text-4xl font-bold sm:text-5xl">{timeLeft.minutes}</div>
          <div className="text-muted-foreground mt-1 text-sm tracking-wide uppercase">Minutes</div>
        </div>

        <div className="bg-background/70 border-border/40 rounded-xl border p-5 shadow-sm">
          <div className="text-primary text-4xl font-bold sm:text-5xl">{timeLeft.seconds}</div>
          <div className="text-muted-foreground mt-1 text-sm tracking-wide uppercase">Seconds</div>
        </div>
      </div>
    </div>
  );
}
