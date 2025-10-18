import React from "react";

import Image from "next/image";

import img1 from "@/assets/3.png";
import img2 from "@/assets/hero-product.png";
import whyChooseImage from "@/assets/why-choose-image.jpg";

const WhyChooseSection = () => {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
          {/* Left Column - Content */}
          <div className="w-full lg:w-1/2">
            {/* Section Tag */}
            <div className="mb-6 flex items-center gap-3">
              <span className="bg-primary h-2.5 w-2.5 rounded-full"></span>
              <p className="text-primary text-sm font-semibold tracking-wider uppercase">কেন আমাদের বেছে নেবেন</p>
            </div>

            {/* Main Heading */}
            <h2 className="text-foreground mb-6 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
              নিখুঁত ফোঁটা, প্রিমিয়াম মান,{" "}
              <span className="text-primary font-serif italic">যার উপর আপনি ভরসা করতে পারেন।</span>
            </h2>

            {/* Description */}
            <p className="text-muted-foreground mb-8 text-base leading-relaxed sm:text-lg">
              আমাদের ন্যাচারাল হেয়ার অয়েল তৈরি হয়েছে নিখুঁত প্রয়োগ নিশ্চিত করতে — যাতে প্রতিটি ফোঁটা পৌঁছে যায় সঠিক
              জায়গায়, কোনো অপচয় ছাড়াই। টেকসই ও উচ্চমানের উপাদানে তৈরি আমাদের প্যাকেজিং রক্ষা করে তেলের বিশুদ্ধতা ও
              কার্যকারিতা।
            </p>

            {/* Feature Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
                  <Image src={img1} alt="Premium Quality" width={32} height={32} />
                </div>
                <div>
                  <h3 className="text-foreground mb-2 text-lg font-bold sm:text-xl">প্রিমিয়াম মান</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                    সতর্কভাবে নির্বাচিত প্রাকৃতিক উপাদান, ১০০% বিশুদ্ধ ও গুণগতভাবে পরীক্ষিত — সর্বোচ্চ মানের নিশ্চয়তা
                    দিতে।
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-full">
                  <Image src={img1} alt="Sustainability" width={32} height={32} />
                </div>
                <div>
                  <h3 className="text-foreground mb-2 text-lg font-bold sm:text-xl">টেকসইতা ও যত্ন</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                    প্রকৃতি ও গ্রাহকের প্রতি অঙ্গীকারবদ্ধ — আমরা দিই নির্ভরযোগ্য, আড়ম্বরপূর্ণ ও পরিবেশবান্ধব সমাধান।
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight Card */}
            <div className="border-primary/20 bg-primary/5 flex flex-col items-start gap-6 rounded-2xl border p-6 sm:flex-row sm:items-center">
              <div className="bg-primary flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full">
                <Image src={img1} alt="Trust" width={36} height={36} />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                With a commitment to sustainability and customer satisfaction, we provide reliable, stylish, and
                eco-friendly solutions you can trust. Experience the balance of function and care—one drop at a time.
              </p>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="relative mt-8 w-full lg:mt-0 lg:w-1/2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl lg:aspect-auto lg:h-[600px]">
              <Image
                src={whyChooseImage}
                alt="Lifestyle image of CBD oil with a candle and plants"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Floating Product Image */}
            <div className="absolute -right-6 -bottom-12 h-[300px] w-[170px] sm:-right-8 sm:-bottom-16 sm:h-[380px] sm:w-[210px]">
              <Image
                src={img2}
                alt="CBD oil product bottle"
                fill
                sizes="(max-width: 768px) 50vw, 15vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
