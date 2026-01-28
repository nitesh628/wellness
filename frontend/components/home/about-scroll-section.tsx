"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import Image1 from "../../public/about-anatomy.png";
import Image2 from "../../public/about-doctors.png";
import Image3 from "../../public/natural-science.png";

type AboutStep = {
  number: string;
  title: string;
  description: string;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  panelBgClassName?: string;
  imageBgClassName?: string;
};

const AboutScrollSection = () => {
  const steps: AboutStep[] = useMemo(
    () => [
      {
        number: "01",
        title: "A Vision to Transform Health",
        description:
          "Wellness was founded by a team of visionary doctors who aimed to enhance their patients' quality of life with natural, science-backed supplements. After extensive research, they developed plant-based solutions addressing widespread nutritional deficiencies that affect health and wellness. These supplements target conditions like diabetes, metabolic syndrome, fatty liver disease, and fertility challenges, providing holistic, health-oriented solutions.",
        imageSrc: Image1,
        imageAlt: "A vision to transform health",
        panelBgClassName: "bg-white",
        imageBgClassName: "bg-white",
      },
      {
        number: "02",
        title: "Expertise in Specialized Health Needs",
        description:
          "One of Wellness's founders, a renowned metabolic health expert, centered on creating supplements for patients with diabetes, prediabetes, and metabolic conditions. The other founder, a reproductive specialist, focused on enhancing fertility through natural products. Together, they combined their expertise to offer a unique range of supplements crafted for specific health needs, supporting better patient outcomes through targeted, nature-driven solutions.",
        imageSrc: Image2,
        imageAlt: "Expertise in specialized health needs",
        panelBgClassName: "bg-white",
        imageBgClassName: "bg-slate-100",
      },
      {
        number: "03",
        title: "Pure, Plant-Based Formulations",
        description:
          "Wellness's products are not only rooted in rigorous scientific research but are also entirely plant-based, free from artificial colors and preservatives. Educated at prestigious Indian universities, the founders are dedicated to ensuring that each product undergoes comprehensive testing to confirm safety and efficacy. This careful attention to purity and quality reflects Wellness's mission to prioritize natural, health-first solutions.",
        imageSrc: Image3,
        imageAlt: "Pure, plant-based formulations",
        panelBgClassName: "bg-white",
        imageBgClassName: "bg-blue-50",
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const active = steps[activeIndex];

  return (
    <section className="bg-white dark:bg-slate-950 overflow-hidden">
      <div ref={scrollRef} className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-[2px] bg-blue-900" />
          <div className="flex items-center gap-3">
            {steps.map((step, idx) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-xs font-semibold tracking-[0.2em] px-2 py-1 transition-colors ${idx === activeIndex
                  ? "text-blue-900"
                  : "text-slate-400 hover:text-blue-900"
                  }`}
                aria-pressed={idx === activeIndex}
              >
                {step.number}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${active.panelBgClassName || ""}`}>
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 leading-[1.05] mb-6">
              {active.title}
            </h2>

            <p className="text-sm sm:text-base md:text-[15px] text-slate-600 leading-relaxed max-w-xl">
              {active.description}
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <div
              className={`relative w-full aspect-[16/10] overflow-hidden ${active.imageBgClassName || "bg-slate-100"
                }`}
            >
              {!imageError[activeIndex] ? (
                <Image
                  src={active.imageSrc}
                  alt={active.imageAlt}
                  fill
                  className="object-contain"
                  onError={() =>
                    setImageError((prev) => ({ ...prev, [activeIndex]: true }))
                  }
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-semibold">
                  {active.title}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold tracking-[0.2em] text-blue-900 mb-4">
              Plant-Based and Free from Artificial Additives
            </div>

            <h3 className="text-4xl md:text-5xl font-extrabold text-blue-900 leading-[1.05] mb-6">
              Commitment to Quality
            </h3>

            <p className="text-sm sm:text-base md:text-[15px] text-slate-600 leading-relaxed">
              Wellness remains steadfast in its commitment to enhancing lives by delivering the best of what nature and science can offer. Their meticulous approach guarantees products that meet the highest standards of safety, efficacy, and quality. Wellness's dedication to excellence underscores its mission to use natural ingredients to empower and support the health journeys of all who seek their products.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutScrollSection;