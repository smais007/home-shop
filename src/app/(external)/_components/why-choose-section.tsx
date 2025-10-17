import React from "react";

import Image from "next/image";

import img1 from "@/assets/3.png";
import img2 from "@/assets/hero-product.png";
import whyChooseImage from "@/assets/why-choose-image.jpg";

const WhyChooseSection = () => {
  return (
    // bg-[#F7F3EE]
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-12 lg:flex-row">
          {/* Left Column */}
          <div className="w-full lg:w-[48%]">
            <div className="flex items-center">
              <p className="text-tagline text-primary">কেন আমাদের বেছে নেবেন</p>
            </div>

            <h2 className="mb-6 text-3xl leading-[1.2] font-bold tracking-[0.08em] text-[#1F2E1A] md:text-4xl lg:text-[48px]">
              নিখুঁত ফোঁটা, প্রিমিয়াম মান,{" "}
              <span className="font-lora font-normal italic">যার উপর আপনি ভরসা করতে পারেন।</span>
            </h2>

            <p className="text-muted-foreground mb-8 text-lg">
              আমাদের ন্যাচারাল হেয়ার অয়েল তৈরি হয়েছে নিখুঁত প্রয়োগ নিশ্চিত করতে — যাতে প্রতিটি ফোঁটা পৌঁছে যায় সঠিক
              জায়গায়, কোনো অপচয় ছাড়াই। টেকসই ও উচ্চমানের উপাদানে তৈরি আমাদের প্যাকেজিং রক্ষা করে তেলের বিশুদ্ধতা ও
              কার্যকারিতা।
            </p>

            <div className="mb-8 flex flex-col gap-6 sm:flex-row">
              <div>
                <Image
                  src={img1}
                  alt="Premium Quality"
                  width={48}
                  height={48}
                  className="bg-primary rounded-full p-2"
                />
                <div className="pt-5">
                  <h3 className="text-[18px] font-bold">প্রিমিয়াম মান</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    সতর্কভাবে নির্বাচিত প্রাকৃতিক উপাদান, ১০০% বিশুদ্ধ ও গুণগতভাবে পরীক্ষিত — সর্বোচ্চ মানের নিশ্চয়তা
                    দিতে।{" "}
                  </p>
                </div>
              </div>
              <div>
                <Image
                  src={img1}
                  alt="Premium Quality"
                  width={48}
                  height={48}
                  className="bg-primary rounded-full p-2"
                />
                <div className="pt-5">
                  <h3 className="text-[18px] font-bold">টেকসইতা ও যত্ন</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    প্রকৃতি ও গ্রাহকের প্রতি অঙ্গীকারবদ্ধ — আমরা দিই নির্ভরযোগ্য, আড়ম্বরপূর্ণ ও পরিবেশবান্ধব সমাধান।
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-primary/10 flex flex-col items-start gap-6 rounded-4xl p-3 md:flex-row md:items-center">
              <Image
                src={img1}
                alt="Premium Quality"
                width={72}
                height={72}
                className="bg-primary mb-4 rounded-full p-2"
              />
              <p className="text-muted-foreground">
                With a commitment to sustainability and customer satisfaction, we provide reliable, stylish, and
                -friendly solutions you can trust. Experience the balance of function and care—one drop at a time.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative mt-8 h-[500px] w-full lg:mt-0 lg:h-[665px] lg:w-[52%]">
            <Image
              src={whyChooseImage}
              alt="Lifestyle image of CBD oil with a candle and plants"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-2xl object-cover"
            />
            <div className="absolute -right-4 -bottom-10 h-[320px] w-[180px] sm:-right-8 sm:-bottom-16 sm:h-[390px] sm:w-[220px]">
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
