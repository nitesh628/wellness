"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import ProductBottle from "../../../public/supplement-bottle-blue.png";
import ProductJar from "../../../public/supplement-jar-blue.png";

// Data for Featured Collection
const featuredProducts = [
  {
    id: 1,
    name: "Bone Essentials",
    slug: "bone-essentials",
    price: "675.00",
    originalPrice: "900.00",
    image: ProductBottle,
    hoverImage: ProductBottle,
  },
  {
    id: 2,
    name: "Complete Gut Fibre",
    slug: "complete-gut-fibre",
    price: "974.00",
    originalPrice: "1,299.00",
    image: ProductJar,
    hoverImage: ProductJar,
  },
  {
    id: 3,
    name: "Fat Metabolism Boost",
    slug: "fat-metabolism-boost",
    price: "2,016.00",
    originalPrice: "2,689.00",
    image: ProductBottle,
    hoverImage: ProductBottle,
  },
  {
    id: 4,
    name: "Fatty Liver Revive",
    slug: "fatty-liver-revive",
    price: "1,874.00",
    originalPrice: "2,499.00",
    image: ProductBottle,
    hoverImage: ProductBottle,
  },
  {
    id: 5,
    name: "Fertility Boost",
    slug: "fertility-boost",
    price: "2,340.00",
    originalPrice: null,
    image: ProductBottle,
    hoverImage: ProductBottle,
  },
];

const CollabFeatured = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900">
            Featured collection
          </h2>
          <Link
            href="/products"
            className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">View all</span>
            <div className="bg-slate-100 rounded-full p-1">
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="flex flex-col items-center group cursor-pointer block"
            >
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
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg flex items-center gap-2 h-10">
                    <Plus className="w-4 h-4" />
                    Quick add
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <h3 className="text-blue-900 font-bold text-lg mb-1 text-center line-clamp-1 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-600 font-semibold">
                  Rs. {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-slate-400 line-through text-xs">
                    Rs. {product.originalPrice}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollabFeatured;
