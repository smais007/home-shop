import { supabase } from "@/lib/supabase";
import type { Announcement, Countdown, Product, Video } from "@/types/database";

import { AnnouncementMarquee } from "./_components/announcement-marquee";
import { CountdownTimer } from "./_components/countdown-timer";
import { ProductShowcase } from "./_components/product-showcase";
import { VideoSection } from "./_components/video-section";

async function getAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }

  return data;
}

async function getCountdown(): Promise<Countdown | null> {
  const { data, error } = await supabase
    .from("countdowns")
    .select("*")
    .gte("end_date", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching countdown:", error);
    return null;
  }

  return data;
}

async function getVideo(): Promise<Video | null> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching video:", error);
    return null;
  }

  return data;
}

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data;
}

export default async function Home() {
  const [announcements, countdown, video, products] = await Promise.all([
    getAnnouncements(),
    getCountdown(),
    getVideo(),
    getProducts(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Announcement Marquee */}
      {announcements.length > 0 && <AnnouncementMarquee announcements={announcements} />}

      {/* Main Content */}
      <main className="container mx-auto space-y-16 px-4 py-8">
        {/* Countdown Timer */}
        {countdown && <CountdownTimer countdown={countdown} />}

        {/* YouTube Video */}
        {video && <VideoSection video={video} />}

        {/* Product Showcase */}
        {products.length > 0 && <ProductShowcase products={products} />}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-8">
        <div className="text-muted-foreground container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Home Shopper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
