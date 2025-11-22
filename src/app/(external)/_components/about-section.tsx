"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";

import { Check } from "lucide-react";

// import bottleWithBox from "@/assets/bottol-with-box.png";
// import heroProduct from "@/assets/hero-product.png";
import iconImage from "@/assets/image copy 3.png";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.png";
import aboutImage from "@/assets/singel-product.png";

export default function AboutSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sliderImages = [
    { src: aboutImage, alt: "Premium Hair Oil Bottle" },
    // { src: bottleWithBox, alt: "Hair Oil with Premium Packaging" },
    // { src: heroProduct, alt: "Complete Product Range" },
    { src: product1, alt: "Natural Hair Oil Product" },
    { src: product2, alt: "Premium Quality Hair Care" },
  ];

  const checkListItems = [
    "প্রতিটি ফোঁটায় নিখুঁততা — সঠিকভাবে প্রয়োগের জন্য বিশেষভাবে ডিজাইন করা।",
    "লিক-প্রুফ ও টেকসই বোতল — আপনার মূল্যবান তেলকে রাখে নিরাপদ ও সুরক্ষিত।",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <section className="bg-background text-foreground relative py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16 xl:gap-20">
          {/* Image Column - Auto Slider */}
          <div className="relative w-full lg:w-1/2">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              {sliderImages.map((image, index) => (
                <div
                  key={`${image.alt}-${index}`}
                  className={`transition-opacity duration-1000 ${
                    index === currentImageIndex ? "opacity-100" : "absolute inset-0 opacity-0"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={636}
                    height={646}
                    className="h-auto w-full object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}

              {/* Slider Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {sliderImages.map((image, index) => (
                  <button
                    key={`dot-${image.alt}-${index}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "bg-primary w-6" : "bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2">
            {/* Section Tag */}
            <div className="flex items-center gap-3">
              <span className="bg-primary h-2.5 w-2.5 rounded-full"></span>
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">আমাদের সম্পর্কে</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]">
              বিশুদ্ধ সত্তা, নিখুঁত ফোঁটা, চূড়ান্ত যত্ন — <span className="text-primary">সবসময় আপনার জন্য।</span>
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              আমরা বিশ্বাস করি, প্রতিটি ফোঁটাই গুরুত্বপূর্ণ। আমাদের প্রিমিয়াম ন্যাচারাল হেয়ার অয়েল এমনভাবে তৈরি, যা
              প্রতিবার ব্যবহারে দেয় বিশুদ্ধতা, নিখুঁততা ও যত্নের অভিজ্ঞতা।
            </p>

            {/* Checklist */}
            <ul className="my-4 space-y-4 sm:my-6">
              {checkListItems.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="bg-primary mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <Check className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-muted-foreground flex-1 text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* Feature Card */}
            <div className="bg-primary/10 border-primary/20 mt-6 flex flex-col items-start gap-6 rounded-2xl border p-6 sm:flex-row sm:items-center">
              <div className="bg-primary shrink-0 rounded-full p-3">
                <Image src={iconImage} alt="Organic & Pure Icon" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-foreground mb-2 text-xl font-bold sm:text-2xl">১০০% অর্গানিক ও বিশুদ্ধ</h3>
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  প্রকৃতির উপহার যা চুলে ফিরিয়ে আনে ভারসাম্য, পুষ্টি ও প্রাকৃতিক সৌন্দর্য।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
