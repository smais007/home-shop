import { supabase } from "@/lib/supabase";
import type { Announcement, Countdown, Product, Video } from "@/types/database";

import AboutSection from "./_components/about-section";
import { AnnouncementMarquee } from "./_components/announcement-marquee";
import { CountdownTimer } from "./_components/countdown-timer";
import Footer from "./_components/footer";
import HeroSection from "./_components/hero-section";
import KeyPointsSection from "./_components/key-points-section";
import { ProductShowcase } from "./_components/product-showcase";
import { VideoSection } from "./_components/video-section";
import WhyChooseSection from "./_components/why-choose-section";

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

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Countdown Timer */}
        {countdown && (
          <section className="py-12 sm:py-16 lg:py-20">
            <CountdownTimer countdown={countdown} />
          </section>
        )}

        {/* YouTube Video */}
        {video && (
          <section className="py-12 sm:py-16 lg:py-20">
            <VideoSection video={video} />
          </section>
        )}

        {/* About Section */}
        <AboutSection />

        {/* Product Showcase */}
        {products.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-20">
            <ProductShowcase products={products} />
          </section>
        )}

        {/* Why Choose Section */}
        <WhyChooseSection />

        {/* Key Points Section */}
        <KeyPointsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
