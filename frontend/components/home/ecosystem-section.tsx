"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import Product1 from "../../public/supplement-bottle-blue.png"
import Product2 from "../../public/1.jpg"
import Product4 from "../../public/4.jpg"
import { motion } from 'framer-motion';


// Placeholder data for the ecosystem categories
const ecosystemCategories = [
    {
        title: "Gut Longevity",
        image: Product2, // Replace with relevant image
        bg: "bg-blue-600"
    },
    {
        title: "General Longevity",
        image: Product1,
        bg: "bg-blue-600"
    },
    {
        title: "Reproductive Longevity",
        image: Product4,
        bg: "bg-blue-600"
    },
    {
        title: "General Longevity",
        image: Product1,
        bg: "bg-blue-600"
    },
    {
        title: "Metabolic Longevity",
        image: Product1,
        bg: "bg-blue-600"
    },
    {
        title: "Brain Health",
        image: Product2,
        bg: "bg-blue-600"
    }
];

const EcosystemSection = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true
    });

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="py-16 bg-white/0 dark:bg-slate-950/0 overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 dark:text-blue-400">
                        The Wellness Ecosystem
                    </h2>
                    <div className="flex items-center gap-4">
                        <Link href="/products" className="text-blue-600 font-semibold text-sm md:text-base hidden md:block hover:text-blue-800 transition-colors">
                            View all &gt;
                        </Link>
                        <div className="flex gap-2">
                            <Button onClick={scrollPrev} variant="outline" size="icon" className="rounded-full w-8 h-8 md:w-10 md:h-10 border-slate-200">
                                <ChevronLeft className="w-4 h-4 text-slate-600" />
                            </Button>
                            <Button onClick={scrollNext} variant="outline" size="icon" className="rounded-full w-8 h-8 md:w-10 md:h-10 border-transparent bg-blue-600 hover:bg-blue-700 text-white">
                                <ChevronRight className="w-4 h-4 text-white" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Categories Slider */}
                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-6">
                            {ecosystemCategories.map((category, index) => (
                                <motion.div
                                    key={index}
                                    className="flex-[0_0_280px] sm:flex-[0_0_320px] lg:flex-[0_0_350px] min-w-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link href={`/products?category=${category.title.toLowerCase().replace(/ /g, '-')}`} className="group block w-full">
                                        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-100 transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-100 group-hover:-translate-y-2">
                                            <div className="absolute inset-0 flex items-center justify-center p-6">
                                                <div className="w-full h-full relative">
                                                    <Image
                                                        src={category.image}
                                                        alt={category.title}
                                                        fill
                                                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-400 text-center group-hover:text-blue-600 transition-colors">
                                            {category.title}
                                        </h3>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EcosystemSection;
