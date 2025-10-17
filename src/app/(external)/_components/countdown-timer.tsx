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
    <div className="bg-muted rounded-lg p-8 text-center">
      {countdown.title && <h2 className="mb-6 text-3xl font-bold">{countdown.title}</h2>}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-4">
          <div className="text-4xl font-bold">{timeLeft.days}</div>
          <div className="text-muted-foreground text-sm">Days</div>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="text-4xl font-bold">{timeLeft.hours}</div>
          <div className="text-muted-foreground text-sm">Hours</div>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="text-4xl font-bold">{timeLeft.minutes}</div>
          <div className="text-muted-foreground text-sm">Minutes</div>
        </div>
        <div className="bg-background rounded-lg p-4">
          <div className="text-4xl font-bold">{timeLeft.seconds}</div>
          <div className="text-muted-foreground text-sm">Seconds</div>
        </div>
      </div>
    </div>
  );
}
