"use client";

import Image from "next/image";
import React from "react";
import ScienceFeatured from "./science-featured";
import EcosystemSection from "@/components/home/ecosystem-section";

type ScienceSection = {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const sections: ScienceSection[] = [
  {
    number: "01",
    title: "Addressing\nModern\nNutritional\nChallenges",
    description:
      "Today's fast-paced world makes it challenging for many to maintain proper nutrition due to nutrient-depleted soils reducing the quality of fruits and vegetables. Alongside the demands of work and life, irregular eating habits, processed foods, and preservative-heavy diets lead to serious micronutrient deficiencies. These nutritional gaps, intensified by chronic stress, hasten aging and compromise gut health, increasing risks for metabolic disorders.",
    imageSrc:
      "/science-lab.png",
    imageAlt: "Modern nutritional challenges",
  },
  {
    number: "02",
    title: "Wellness’s\nHealth-\nFocused\nCommitment",
    description:
      "Wellness aims to solve these health challenges with scientifically formulated, plant-based supplements. Our Fatty Liver Revive supports liver detoxification, reduces fat accumulation, and improves metabolic function—key for those with fatty liver concerns. GlycoGuard enhances insulin sensitivity, regulates glucose metabolism, and guards against oxidative stress, ideal for managing metabolic syndrome.",
    imageSrc:
      "/supplement-bottle-blue.png",
    imageAlt: "Health focused commitment",
  },
  {
    number: "03",
    title: "Gut Health and\nLongevity\nSupport",
    description:
      "For gut health, Forever Gut provides an advanced prebiotic and probiotic blend with Akkermansia muciniphila, a key strain for gut barrier integrity and longevity. Complete Gut Fibre supports digestion, regularity, and inflammation reduction, improving overall gut health. Our Longevity Pro aids cellular repair and energy throughout the day, while NMN Pro boosts NAD+ levels, combating age-related decline and enhancing physical and cognitive performance.",
    imageSrc:
      "/supplement-jar-blue.png",
    imageAlt: "Gut health and longevity",
  },
  {
    number: "04",
    title: "Solutions for\nSkin, Growth,\nand\nReproductive\nHealth",
    description:
      "NutriRevive nourishes skin and hair from within, increasing hydration, reducing fine lines, and strengthening hair and nails. Height Boost aids in healthy growth for children by supporting bone development and nutrient absorption. Fertility Boost and Fertility Pro enhance sperm and egg quality, benefiting reproductive health.",
    imageSrc:
      "/natural-science.png",
    imageAlt: "Skin, growth and reproductive health",
  },
  {
    number: "05",
    title: "Science-\nBased, Plant-\nBased\nWellness",
    description:
      "Every Wellness product is plant-based, scientifically developed, and crafted to address the nutritional gaps of modern lifestyles. Wellness provides solutions to empower individuals in overcoming today’s nutritional challenges for a healthier tomorrow.",
    imageSrc:
      "/natural-science.png",
    imageAlt: "Science based wellness",
  },
];

const Science = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeSection = sections[activeIndex];

  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Tab Navigation */}
        <div className="flex items-center gap-3 mb-12 sm:mb-16">
          <div className="w-10 h-[2px] bg-blue-900" />
          <div className="flex items-center gap-3">
            {sections.map((section, idx) => (
              <button
                key={section.number}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-xs font-semibold tracking-[0.2em] px-2 py-1 transition-colors ${idx === activeIndex
                  ? "text-blue-900"
                  : "text-slate-400 hover:text-blue-900"
                  }`}
                aria-pressed={idx === activeIndex}
              >
                {section.number}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center animate-in fade-in slide-in-from-bottom-4 duration-500 key={activeIndex}">
          <div className="max-w-xl order-2 lg:order-1">
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] text-blue-900 whitespace-pre-line">
              {activeSection.title}
            </h2>

            <p className="mt-6 text-[13px] sm:text-sm leading-relaxed text-slate-600">
              {activeSection.description}
            </p>
          </div>

          <div className="w-full order-1 lg:order-2">
            <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden bg-slate-100">
              <Image
                src={activeSection.imageSrc}
                alt={activeSection.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 520px, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      {/* <ScienceFeatured /> */}
      <EcosystemSection />
    </main>
  );
};


export default Science;
