"use client";
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import HERO_IMAGE from '../../public/Hero.png'; // Using placeholder for scientist image

const IngredientScienceSection = () => {
    return (
        <section className="relative py-16 lg:py-24 bg-gradient-to-r from-blue-50 via-white to-indigo-50 overflow-hidden">

            {/* Background/Overlay Logic */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-transparent to-indigo-50/80 pointer-events-none" />

            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Text */}
                    <div className="w-full lg:w-1/3 space-y-4 text-center lg:text-left">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 leading-tight">
                            Why Each <br />
                            Ingredient <br />
                            Matters
                        </h2>
                    </div>

                    {/* Center Image (Scientist) */}
                    <div className="w-full lg:w-1/3 flex justify-center">
                        <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl mix-blend-multiply">
                            {/* 
                     Placeholder: Scientist looking into microscope.
                     Using CSS filters to blend it to look more like the provided design 
                 */}
                            <Image
                                src={HERO_IMAGE}
                                alt="Scientist researching ingredients"
                                fill
                                className="object-cover"
                            />
                            {/* Overlay to give it that bluish tint */}
                            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"></div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="w-full lg:w-1/3 space-y-8 lg:pl-12 text-center lg:text-left">
                        <div className="space-y-6">
                            <p className="text-lg font-medium text-slate-900 leading-relaxed">
                                Each ingredient in our formulas is rigorously researched and selected for proven, visible benefits.
                            </p>
                            <p className="text-lg font-medium text-slate-900 leading-relaxed">
                                Discover the science and experience the age-defying power of our products for lasting health and vitality.
                            </p>
                        </div>

                        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-10 py-6 rounded-full shadow-lg transition-all duration-300">
                            Explore Now
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default IngredientScienceSection;
