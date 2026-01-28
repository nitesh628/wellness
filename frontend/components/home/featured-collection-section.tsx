"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import Product1 from "../../public/supplement-bottle-blue.png"
import Product2 from "../../public/1.jpg"
import Product4 from "../../public/4.jpg"

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
        <section className="py-16 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900">
                        Featured Collection
                    </h2>
                    <Link href="/products" className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors">
                        <span className="text-sm font-medium">View all</span>
                        <div className="bg-slate-100 rounded-full p-1">
                            <ChevronRight className="w-3 h-3" />
                        </div>
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="flex flex-col items-center group cursor-pointer">

                            {/* Image Container */}
                            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl bg-slate-50 border border-transparent group-hover:border-blue-100 transition-colors">
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <div className="relative w-full h-full">
                                        {/* Default Image */}
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain transition-opacity duration-300 group-hover:opacity-0"
                                        />
                                        {/* Hover Image */}
                                        <Image
                                            src={product.hoverImage}
                                            alt={product.name}
                                            fill
                                            className="object-contain absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        />
                                    </div>
                                </div>

                                {/* Quick Add Button showing on hover */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 w-max">
                                    <Button
                                        onClick={() => router.push(`/product/${product.name.toLowerCase().replace(/ /g, '-')}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg flex items-center gap-2 h-10"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Quick add
                                    </Button>
                                </div>
                            </div>

                            {/* Product Info */}
                            <h3 className="text-blue-900 font-bold text-lg mb-1 text-center group-hover:text-blue-600 transition-colors">{product.name}</h3>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-blue-600 font-semibold">Rs. {product.price}</span>
                                <span className="text-slate-400 line-through text-xs">Rs. {product.originalPrice}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeaturedCollectionSection;
