import React from "react";

import Image from "next/image";

import { Check } from "lucide-react";

import iconImage from "@/assets/image copy 3.png";
import aboutImage from "@/assets/singel-product.png";
// Assuming you have an about image

export default function AboutSection() {
  const checkListItems = [
    "প্রতিটি ফোঁটায় নিখুঁততা — সঠিকভাবে প্রয়োগের জন্য বিশেষভাবে ডিজাইন করা।",
    "লিক-প্রুফ ও টেকসই বোতল — আপনার মূল্যবান তেলকে রাখে নিরাপদ ও সুরক্ষিত।",
  ];

  return (
    <section className="bg-background text-foreground relative">
      <div className="container mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
          <div className="relative w-full lg:w-1/2">
            {/* <PremiumQualityBadge /> */}
            <Image src={aboutImage} alt="CBD Oil Dropper Bottle" width={636} height={646} className="h-auto w-full" />
          </div>
          <div className="flex w-full flex-col gap-6 lg:w-1/2">
            <div className="flex items-center gap-3">
              <span className="bg-primary h-2 w-2 rounded-full"></span>
              <span className="text-primary text-sm font-medium tracking-[0.08em] uppercase">আমাদের সম্পর্কে</span>
            </div>
            {/* <SpacedHeading text="Pure essence precise drops ultimate care always" /> */}
            <h1 className="text-5xl font-bold">বিশুদ্ধ সত্তা, নিখুঁত ফোঁটা, চূড়ান্ত যত্ন — সবসময় আপনার জন্য।</h1>
            <p className="text-muted-foreground leading-[1.7]">
              আমরা বিশ্বাস করি, প্রতিটি ফোঁটাই গুরুত্বপূর্ণ। আমাদের প্রিমিয়াম ন্যাচারাল হেয়ার অয়েল এমনভাবে তৈরি, যা
              প্রতিবার ব্যবহারে দেয় বিশুদ্ধতা, নিখুঁততা ও যত্নের অভিজ্ঞতা।
            </p>
            <ul className="my-4 space-y-4">
              {checkListItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="bg-primary mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <Image
                  src={iconImage}
                  alt="Organic & Pure Icon"
                  width={48}
                  height={48}
                  className="bg-primary rounded-full p-2"
                />
                <div>
                  <h3 className="text-xl font-semibold">১০০% অর্গানিক ও বিশুদ্ধ</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    প্রকৃতির উপহার যা চুলে ফিরিয়ে আনে ভারসাম্য, পুষ্টি ও প্রাকৃতিক সৌন্দর্য।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
