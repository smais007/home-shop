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
    <div className="w-full text-center">
      {countdown.title && (
        <h2 className="text-foreground sr-only mb-6 text-xl font-bold tracking-tight sm:text-3xl">{countdown.title}</h2>
      )}

      <div className="flex justify-center gap-3 sm:gap-5">
        <div className="flex flex-col items-center">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span
              style={{ "--value": timeLeft.days } as React.CSSProperties}
              aria-live="polite"
              aria-label={`${timeLeft.days} days`}
            >
              {timeLeft.days}
            </span>
          </span>
          <span className="text-muted-foreground mt-2 text-sm tracking-wide uppercase">days</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span
              style={{ "--value": timeLeft.hours } as React.CSSProperties}
              aria-live="polite"
              aria-label={`${timeLeft.hours} hours`}
            >
              {timeLeft.hours}
            </span>
          </span>
          <span className="text-muted-foreground mt-2 text-sm tracking-wide uppercase">hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span
              style={{ "--value": timeLeft.minutes } as React.CSSProperties}
              aria-live="polite"
              aria-label={`${timeLeft.minutes} minutes`}
            >
              {timeLeft.minutes}
            </span>
          </span>
          <span className="text-muted-foreground mt-2 text-sm tracking-wide uppercase">min</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="countdown font-mono text-4xl sm:text-5xl">
            <span
              style={{ "--value": timeLeft.seconds } as React.CSSProperties}
              aria-live="polite"
              aria-label={`${timeLeft.seconds} seconds`}
            >
              {timeLeft.seconds}
            </span>
          </span>
          <span className="text-muted-foreground mt-2 text-sm tracking-wide uppercase">sec</span>
        </div>
      </div>
    </div>
  );
}
