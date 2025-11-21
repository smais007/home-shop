import { supabase } from "@/lib/supabase";
import type { Announcement, Countdown, Product } from "@/types/database";

import AboutSection from "./_components/about-section";
import { AnnouncementMarquee } from "./_components/announcement-marquee";
import { CountdownTimer } from "./_components/countdown-timer";
import Footer from "./_components/footer";
import HeroSection from "./_components/hero-section";
import KeyPointsSection from "./_components/key-points-section";
import { ProductShowcase } from "./_components/product-showcase";
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
  const [announcements, countdown, products] = await Promise.all([getAnnouncements(), getCountdown(), getProducts()]);

  return (
    <div className="min-h-screen">
      {/* Announcement Marquee */}
      {announcements.length > 0 && <AnnouncementMarquee announcements={announcements} />}

      {/* Countdown Timer - Sticky below announcement */}
      {countdown && (
        <div className="supports-backdrop-filter:bg-background/80 bg-background/95 sticky top-11 z-40 w-full py-4 shadow-md backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <CountdownTimer countdown={countdown} />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
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
