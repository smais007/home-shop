"use client";

import type { Announcement } from "@/types/database";

interface AnnouncementMarqueeProps {
  announcements: Announcement[];
}

export function AnnouncementMarquee({ announcements }: AnnouncementMarqueeProps) {
  if (announcements.length === 0) return null;

  const messages = announcements.map((a) => a.message).join(" • ");

  return (
    <div className="bg-primary text-primary-foreground relative overflow-hidden py-3">
      <div className="animate-marquee inline-block whitespace-nowrap">
        <span className="mx-8 text-sm font-medium">{messages}</span>
        <span className="mx-8 text-sm font-medium">{messages}</span>
      </div>
    </div>
  );
}
