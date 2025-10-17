"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { Award, Briefcase, Droplets, Leaf, ShieldCheck } from "lucide-react";

import bottolWithBox from "@/assets/bottol-with-box.png";

const featuresLeft = [
  {
    title: "Preserves Purity",
    description: "Protects natural essence — completely free from toxins, fillers, and additives.",
    icon: ShieldCheck,
  },
  {
    title: "Travel Friendly",
    description: "Compact, spill-proof design crafted for durability on every journey.",
    icon: Briefcase,
  },
  {
    title: "Long Shelf Life",
    description: "Engineered packaging ensures freshness and extended usability.",
    icon: ShieldCheck,
  },
];

const featuresRight = [
  {
    title: "100% Pure Oils",
    description: "Cold-pressed and unrefined to preserve the full therapeutic value.",
    icon: Droplets,
  },
  {
    title: "Eco Friendly",
    description: "Produced sustainably with a zero-waste approach for a greener planet.",
    icon: Leaf,
  },
  {
    title: "Trusted by Experts",
    description: "Endorsed by aromatherapists and wellness professionals worldwide.",
    icon: Award,
  },
];

const LeftColumn = () => (
  <div>
    {featuresLeft.map((feature, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="flex"
      >
        <div className="mb-8 flex items-center gap-4 md:text-right lg:flex-row-reverse">
          <feature.icon className="h-8 w-8 text-[#C18F2C]" />
          <div>
            <h3 className="mb-1 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const RightColumn = () => (
  <div>
    {featuresRight.map((feature, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div className="mb-8 flex items-center gap-4">
          <feature.icon className="h-8 w-8 text-[#C18F2C]" />
          <div>
            <h3 className="mb-1 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const KeyPointsSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 text-center lg:mb-20">
          <p className="mb-3 text-sm tracking-wide text-[#B88A2B] italic">Our Key Points</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight font-semibold">
            Superior design, precision <br className="hidden sm:block" />
            <span className="font-serif text-[#1B2A1F] italic">drop lasting quality</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600">
            Crafted with superior design, engineered with precision, and built with dedication — every detail reflects
            our commitment to purity, performance, and perfection.
          </p>
        </div>

        {/* Features + Image */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <LeftColumn />

          {/* Center image for large screen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:hidden lg:block"
          >
            <Image
              src={bottolWithBox}
              alt="Oil dropper bottle with golden packaging box"
              width={446}
              height={552}
              className="rounded-2xl"
            />
          </motion.div>

          <RightColumn />

          {/* Secondary image only visible for medium screens */}
        </div>

        {/* Footer */}
        <div className="text-primary mt-16 text-center text-sm">
          Let’s make something great work together.{" "}
          <a href="#" className="text-muted-foreground hover:text-primary">
            Get Free Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default KeyPointsSection;
