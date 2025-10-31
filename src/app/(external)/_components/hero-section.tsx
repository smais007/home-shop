import Image from "next/image";
import Link from "next/link";

import { Phone } from "lucide-react";

import heroProduct from "@/assets/hero-product.png";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Video } from "@/types/database";

import { VideoSection } from "./video-section";

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

const HeroSection = async () => {
  const [video] = await Promise.all([getVideo()]);
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#1a3d2e] to-[#2d5a45] py-12 text-white md:py-16 lg:py-24">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-[60px]">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="animated fadeInUp flex flex-col items-center gap-y-6 text-center lg:items-start lg:text-left">
            <p className="text-sm font-semibold tracking-[0.08em] text-[#d4a74a] uppercase">
              প্রিমিয়ামের শক্তি অনুভব করুন
            </p>

            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.2] font-black tracking-[0.1em] text-white lg:tracking-[0.15em]">
              বিশুদ্ধ ফোঁটা, নিখুঁত যত্ন{" "}
              <span className="font-lora font-normal italic">যেটির উপর আপনি ভরসা করতে পারেন।</span>
            </h1>

            <p className="mx-auto max-w-[500px] text-lg leading-relaxed text-[#e5e5e5] lg:mx-0">
              আমাদের প্রিমিয়াম ন্যাচারাল হেয়ার অয়েল দিয়ে উপভোগ করুন বিশুদ্ধতা ও নিখুঁততার নিখুঁত ভারসাম্য। সহজ
              ব্যবহারযোগ্য ডিজাইন ও উন্নত মানের বোতল প্রতিটি ফোঁটা দেয় সঠিক পরিমাণে — কোনো অপচয় নয়, শুধু চুলের জন্য
              সর্বোচ্চ পুষ্টি ও যত্ন।
            </p>

            <div className="flex flex-col items-center gap-x-6 gap-y-4 pt-4 sm:flex-row">
              <Button
                asChild
                className="h-auto transform rounded-full bg-[#d4a74a] px-8 py-4 text-base font-semibold text-white shadow-[0_4px_12px_rgba(212,168,83,0.3)] transition-all duration-300 hover:scale-105 hover:bg-[#c9953b]"
              >
                <Link href="/">Purchase Now</Link>
              </Button>
              <Link href="/" className="group flex items-center gap-3 text-white">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d4a74a] transition-transform duration-300 group-hover:scale-110">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm">Call Us</span>
                  <p className="text-lg font-semibold whitespace-nowrap">01994250885</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Image
              src={heroProduct}
              alt="Three CBD oil dropper bottles with a 'Premium Quality' badge"
              width={725}
              height={714}
              className="h-auto w-auto max-w-full"
              priority
            />
          </div>
        </div>
      </div>

      <div>
        {/* Hero video */}
        {video && (
          <section className="py-12 sm:py-16 lg:py-20">
            <VideoSection video={video} />
          </section>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
