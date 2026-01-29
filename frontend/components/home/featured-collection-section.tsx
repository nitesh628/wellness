"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import Product1 from "../../public/supplement-bottle-blue.png"
import Product2 from "../../public/1.jpg"
import Product4 from "../../public/4.jpg"
import { motion } from "framer-motion";

// Sample data for Featured Collection
const featuredProducts = [
    // Row 1 ( Images)
    {
        id: 1,
        name: "Forever Gut",
        price: "1,477.00",
        originalPrice: "1,970.00",
        image: Product1, // Replace with  image
        hoverImage: Product1,
    },
    {
        id: 2,
        name: "Complete Gut Fibre",
        price: "974.00",
        originalPrice: "1,299.00",
        image: Product2,
        hoverImage: Product2,
    },
    {
        id: 3,
        name: "Longevity Pro",
        price: "2,774.00",
        originalPrice: "3,699.00",
        image: Product1,
        hoverImage: Product1,
    },
    {
        id: 4,
        name: "Complete Superfoods Blend",
        price: "1,499.00",
        originalPrice: "1,999.00",
        image: Product4,
        hoverImage: Product4,
    },
    // Row 2 (Bottle Images)
    {
        id: 5,
        name: "Bone Essentials",
        price: "1,200.00",
        originalPrice: "1,500.00",
        image: Product1, // Replace with bottle image
        hoverImage: Product1,
    },
    {
        id: 6,
        name: "Fat Metabolism Boost",
        price: "1,800.00",
        originalPrice: "2,400.00",
        image: Product2,
        hoverImage: Product2,
    },
    {
        id: 7,
        name: "Fatty Liver Revive",
        price: "1,600.00",
        originalPrice: "2,100.00",
        image: Product1,
        hoverImage: Product1,
    },
    {
        id: 8,
        name: "Fertility Boost",
        price: "2,000.00",
        originalPrice: "2,800.00",
        image: Product4,
        hoverImage: Product4,
    },
];

import { useRouter } from "next/navigation";

const FeaturedCollectionSection = () => {
    const router = useRouter();
    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">

                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 dark:text-blue-400 mb-2">
                            Featured Collection
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">Handpicked wellness essentials designed to elevate your daily routine.</p>
                    </div>
                    <Link href="/products" className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                        <span className="text-sm md:text-base">View all</span>
                        <div className="bg-blue-50 group-hover:bg-blue-100 rounded-full p-1.5 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {featuredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="flex flex-col group cursor-pointer"
                            onClick={() => router.push(`/product/${product.name.toLowerCase().replace(/ /g, '-')}`)}
                        >

                            {/* Image Container */}
                            <div className="relative w-full aspect-[4/5] mb-5 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:shadow-xl group-hover:border-blue-100 transition-all duration-500 group-hover:-translate-y-2">
                                <div className="absolute inset-0 flex items-center justify-center p-6">
                                    <div className="relative w-full h-full">
                                        {/* Default Image */}
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"
                                        />
                                        {/* Hover Image */}
                                        <Image
                                            src={product.hoverImage}
                                            alt={product.name}
                                            fill
                                            className="object-contain absolute inset-0 opacity-0 scale-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                                        />
                                    </div>
                                </div>

                                {/* Quick Add Button showing on hover */}
                                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/product/${product.name.toLowerCase().replace(/ /g, '-')}`);
                                        }}
                                        className="w-full bg-white/90 hover:bg-blue-600 hover:text-white text-slate-900 backdrop-blur-sm border border-slate-200 hover:border-blue-600 rounded-xl shadow-lg flex items-center justify-center gap-2 h-11 font-semibold transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-blue-600 font-bold text-lg">Rs. {product.price}</span>
                                    <span className="text-slate-400 line-through text-sm">Rs. {product.originalPrice}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturedCollectionSection;
