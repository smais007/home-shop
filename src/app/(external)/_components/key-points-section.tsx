"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { Award, Briefcase, Droplets, Leaf, ShieldCheck } from "lucide-react";

import bottolWithBox from "@/assets/bottol-with-box.png";
import aboutImage from "@/assets/singel-product.png";

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
  <div className="space-y-8">
    {featuresLeft.map((feature) => (
      <motion.div
        key={feature.title}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center md:flex-row-reverse md:text-right"
      >
        <div className="bg-primary/10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full">
          <feature.icon className="text-primary h-7 w-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-foreground mb-2 text-lg font-bold sm:text-xl">{feature.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">{feature.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

const RightColumn = () => (
  <div className="space-y-8">
    {featuresRight.map((feature) => (
      <motion.div
        key={feature.title}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <div className="bg-primary/10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full">
          <feature.icon className="text-primary h-7 w-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-foreground mb-2 text-lg font-bold sm:text-xl">{feature.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">{feature.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

const KeyPointsSection = () => {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 text-center lg:mb-24">
          <p className="text-primary mb-4 text-sm font-semibold tracking-wider uppercase">Our Key Points</p>
          <h2 className="text-foreground mb-6 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Superior design, precision{" "}
            <span className="text-primary block font-serif italic sm:inline">drop lasting quality</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-base leading-relaxed sm:text-lg">
            Crafted with superior design, engineered with precision, and built with dedication — every detail reflects
            our commitment to purity, performance, and perfection.
          </p>
        </div>

        {/* Features + Image */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <LeftColumn />

          {/* Center image for large screen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:hidden lg:block"
          >
            <div className="relative aspect-[446/552] w-full max-w-md overflow-hidden rounded-2xl">
              <Image
                src={aboutImage}
                alt="Oil dropper bottle with golden packaging box"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 0vw, 33vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          <RightColumn />

          {/* Secondary image only visible for medium screens */}
        </div>

        {/* Footer CTA */}
        <div className="text-muted-foreground mt-16 text-center text-sm sm:text-base lg:mt-20">
          Lets make something great work together.{" "}
          <a href="#" className="text-primary transition-colors hover:underline">
            Get Free Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default KeyPointsSection;
