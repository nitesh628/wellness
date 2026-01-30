"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";

// Define the Product interface based on expected API response
interface Product {
  _id: string;
  slug: string;
  name: string;
  images: string[];
  price?: {
    amount: number;
    mrp?: number;
  };
}

const CollabFeatured = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // The API endpoint is /v1/products/public on the backend.
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/v1/products/public`);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        if (data.success) {
          // Take the first 5 products for the featured collection
          setProducts(data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    // Optional: Render a loading skeleton here
    return (
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-12 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't render the section if there are no products
  }

  return (
    <section className="py-16 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900">
            Featured collection
          </h2>
          <Link
            href="/collab"
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
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="flex flex-col items-center group cursor-pointer block"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl bg-slate-50 border border-transparent group-hover:border-blue-100 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
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
                  Rs. {product.price?.amount}
                </span>
                {product.price?.mrp && (
                  <span className="text-slate-400 line-through text-xs">
                    Rs. {product.price.mrp}
                  </span>
                )}
              </div>
            </Link>
          ))}
          ``
        </div>
      </div>
    </section>
  );
};

export default CollabFeatured;
