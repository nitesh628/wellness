"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
// ...existing code...
import Product1 from "../../public/supplement-bottle-blue.png";
import Product2 from "../../public/1.jpg";
import Product4 from "../../public/4.jpg";

const BenchmarkSection = () => {
  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 leading-[1.1] tracking-tight">
              He’s not our ambassador. <br />
              <span className="text-blue-700">He’s our benchmark.</span>
            </h2>

            <div className="space-y-4">
              <p className="text-xl font-bold text-slate-800">for Wellness.</p>
              <p className="text-lg text-slate-600">
                Because longevity isn’t a trend, it’s a standard.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Explore Our Products
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Image & Floating Cards */}
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end mt-12 lg:mt-0">
            {/* Main Image Container */}
            <div className="relative w-full max-w-[600px] h-[600px] rounded-3xl overflow-visible">
              {/* Big circular/organic bg shape behind  */}
              {/* <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-3xl scale-90 -z-10 translate-y-12"></div> */}

              {/* Placeholder for  holding products */}
              <div className="relative w-full h-full mix-blend-multiply dark:mix-blend-normal">
                <Image
                  src="/Hero.png"
                  alt="Benchmark"
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>

              {/* Floating Product Cards */}
              {/* Card 1: Top Left */}
              <div className="absolute top-0 -left-4 md:-left-12 w-40 bg-white p-3 rounded-2xl shadow-xl border border-blue-100 animate-float-delayed hidden md:block">
                <div className="relative w-full aspect-square mb-2">
                  <Image
                    src={Product1}
                    alt="Longevity Pro"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  Longevity Pro
                </p>
                <div className="flex gap-0.5 mt-1">
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                </div>
              </div>

              {/* Card 2: Top Right */}
              <div className="absolute top-10 -right-4 md:-right-8 w-44 bg-white p-3 rounded-2xl shadow-xl border border-blue-100 animate-float hidden md:block">
                <div className="relative w-full aspect-square mb-2">
                  <Image
                    src={Product2}
                    alt="Superfoods"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  Complete Superfoods Blend
                </p>
                <div className="flex gap-0.5 mt-1">
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                </div>
              </div>

              {/* Card 3: Bottom Left */}
              <div className="absolute bottom-20 -left-6 md:-left-16 w-40 bg-white p-3 rounded-2xl shadow-xl border border-blue-100 animate-float hidden md:block">
                <div className="relative w-full aspect-square mb-2">
                  <Image
                    src={Product1}
                    alt="Gut Fibre"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  Complete Gut Fibre
                </p>
                <div className="flex gap-0.5 mt-1">
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                </div>
              </div>

              {/* Card 4: Bottom Right */}
              <div className="absolute bottom-40 -right-4 md:-right-10 w-36 bg-white p-3 rounded-2xl shadow-xl border border-blue-100 animate-float-delayed hidden md:block">
                <div className="relative w-full aspect-square mb-2">
                  <Image
                    src={Product4}
                    alt="Forever Gut"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  Forever Gut
                </p>
                <div className="flex gap-0.5 mt-1">
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                  <Star className="w-2 h-2 text-yellow-500 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenchmarkSection;
