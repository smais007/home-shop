"use client";

import { Megaphone } from "lucide-react";

import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types/database";

interface AnnouncementMarqueeProps {
  announcements: Announcement[];
}

export function AnnouncementMarquee({ announcements }: AnnouncementMarqueeProps) {
  if (announcements.length === 0) return null;

  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground sticky top-0 z-50 w-full",
        "border-primary/20 overflow-hidden border-b shadow-sm",
      )}
    >
      <div className="relative flex items-center justify-center py-2">
        {/* Left Gradient Fade */}
        <div className="from-primary pointer-events-none absolute inset-y-0 left-0 w-16" />
        {/* Right Gradient Fade */}
        <div className="from-primary pointer-events-none absolute inset-y-0 right-0 w-16" />

        {/* Marquee */}
        <Marquee pauseOnHover className="[--duration:25s]">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="mx-6 flex items-center space-x-2 text-sm font-medium tracking-wide">
              <Megaphone className="h-4 w-4 opacity-80" />
              <span>{announcement.message}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
