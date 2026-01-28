"use client";
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star } from "lucide-react";
import Image from 'next/image';
import HERO_IMAGE from '../../public/Hero.png';
import Product1 from "../../public/supplement-bottle-blue.png"
import Product2 from "../../public/1.jpg"
import Product4 from "../../public/4.jpg"

const HeroSection = () => {
  const products = [
    { name: "Longevity Pro", rating: 5, image: Product1 },
    { name: "Complete Superfoods Blend", rating: 5, image: Product2 },
    { name: "Complete Gut Fibre", rating: 5, image: Product1 },
    { name: "Forever Gut", rating: 5, image: Product4 },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-950 min-h-[650px] flex items-center">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-400/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 relative z-20 w-full">
        <div className="flex flex-col lg:flex-row items-center cursor-default">

          {/* Left Content:  Image */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-start relative mb-12 lg:mb-0">
            {/* Circular/Glow effect behind image if needed, for now just the image */}
            <div className="relative w-full max-w-[500px] lg:max-w-none h-[400px] sm:h-[500px] lg:h-[700px]">
              <Image
                src={HERO_IMAGE}
                alt=" "
                fill
                className="object-contain object-center lg:object-left-bottom drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Right Content: Text & Products */}
          <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start space-y-8 pl-0 lg:pl-10">

            {/* Heading */}
            <h1 className="relative z-30 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-blue-900 leading-[1.1] text-center lg:text-left">
              4 for <br />
              <span className="text-blue-600">Everyday Longevity</span>
            </h1>

            {/* Product Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
              {products.map((product, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-4 border-[1.5px] border-blue-400 shadow-lg flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300 hover:shadow-blue-200 hover:border-blue-600">
                  <div className="w-full aspect-square relative mb-3 bg-blue-50/50 rounded-xl overflow-hidden flex items-center justify-center">
                    <div className="w-20 h-20 relative">
                      <Image src={product.image} alt={product.name} fill className="object-contain" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight min-h-[40px] flex items-center justify-center">
                    {product.name}
                  </h3>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-6 w-full flex justify-center lg:justify-start">
              <Link href="/products">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-10 py-7 rounded-full shadow-lg shadow-blue-300/50 hover:shadow-xl transition-all duration-300">
                  Explore Our Products
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection
