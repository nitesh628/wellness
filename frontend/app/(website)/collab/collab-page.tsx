"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchProducts as fetchProductsApi } from "../../lib/apiProducts";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import CollabFeatured from "./collab-featured";
import Image1 from "../../../public/1.jpg";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice } from "@/lib/formatters";
import Swal from 'sweetalert2';

interface Product {
  _id: string;
  slug: string;
  name: string;
  images: string[];
  price?: {
    amount: number;
    mrp?: number;
  };
  shortDescription?: string;
  category?: string;
  createdAt: string;
}

// Hero Section Component
const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Left */}
          <div className="flex-1 text-center lg:text-left z-10 w-full lg:w-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-900 tracking-tight leading-tight mb-6">
              Built by <br />
              <span className="text-blue-600">Science.</span> <br />
              Tested by <br />
              <span className="text-blue-600">.</span>
            </h1>
          </div>

          {/* Image Center */}
          <div className="flex-1 relative flex justify-center z-0 w-full lg:w-auto">
            <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] lg:w-[500px] lg:h-[600px]">
              <Image
                src={Image1}
                alt="Wellness Fuel product display"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Text Right */}
          <div className="flex-1 text-center lg:text-left z-10 flex flex-col items-center lg:items-start w-full lg:w-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 max-w-md leading-snug">
              From cellular repair to gut balance. The 4-step foundation of
              daily longevity.
            </h2>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-full shadow-lg">
              Explore Our Products
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full bg-blue-600 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              "Longevity Pro",
              "ForeverGut",
              "Superfoods Blend",
              "Complete Gut Fibre",
            ].map((item) => (
              <div
                key={item}
                className="text-white font-bold text-lg md:text-xl"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter & Grid Section

const ProductGrid = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, cartItems } = useCart();
  const router = useRouter();

  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProductsApi();
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.message || "Failed to fetch products");
        }
      } catch (err) {
        setError("Failed to fetch products");
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Best selling", value: "best-selling" },
    { label: "Alphabetically, A-Z", value: "title-ascending" },
    { label: "Alphabetically, Z-A", value: "title-descending" },
    { label: "Price, low to high", value: "price-ascending" },
    { label: "Price, high to low", value: "price-descending" },
    { label: "Date, old to new", value: "created-ascending" },
    { label: "Date, new to old", value: "created-descending" },
  ];

  const categoryNames: { [key: string]: string } = {
    antioxidant: "Advanced Antioxidant Formulations",
    glutathione: "Glutathione-Based Wellness",
    brightening: "Skin Brightening & Pigmentation",
    "anti-aging": "Anti-Aging & Radiance",
    "liver-detox": "Liver Detox Support",
    immunity: "Immunity-Boosting Nutraceuticals",
    vitality: "Heart, Brain & Eye Health",
    cellular: "Cellular Defense Protection",
    fssai: "FSSAI-Compliant Products",
    premium: "Premium Ingredient Sourcing",
    gut: "Gut Health Solutions",
    nutraceutical: "Nutraceutical Development",
  };

  const displayTitle = categoryFilter
    ? categoryNames[categoryFilter] ||
      categoryFilter
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "All Products";

  const sortedProducts = useMemo(() => {
    let filtered = [...products];
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }
    // Return a new sorted array to avoid mutation
    switch (sortBy) {
      case "title-ascending":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "title-descending":
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      case "price-ascending":
        return [...filtered].sort(
          (a, b) => (a.price?.amount || 0) - (b.price?.amount || 0),
        );
      case "price-descending":
        return [...filtered].sort(
          (a, b) => (b.price?.amount || 0) - (a.price?.amount || 0),
        );
      case "created-ascending":
        return [...filtered].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "created-descending":
        return [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      default:
        return filtered;
    }
  }, [products, categoryFilter, sortBy]);
  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label;

  if (loading) {
    return (
      <div className="py-20 text-center text-blue-600 font-bold text-xl">
        Loading products...
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-20 text-center text-red-600 font-bold text-xl">
        {error}
      </div>
    );
  }
  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
      {/* Category Title */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          {displayTitle}
        </h2>
        <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
      </div>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-slate-500">
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">Filters</span>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">Sort by:</span>
            <span className="text-sm text-slate-600">{currentSortLabel}</span>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
          {/* Dropdown Menu */}
          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSortOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50
                                            ${sortBy === option.value ? "font-bold text-blue-600" : "text-slate-600"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          {/* In Stock Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="font-medium text-slate-700">In stock only</span>
            <Switch />
          </div>
          {/* Price Filter Accordion Mock */}
          <div className="pb-4 border-b border-slate-100">
            <button className="flex items-center justify-between w-full py-2 font-medium text-slate-700">
              <span>Price</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product._id} className="group relative flex flex-col h-full">
                <Link
                  href={`/product/${product.slug}`}
                  className="block flex-1 cursor-pointer"
                >
                <div className="relative aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden mb-4 border border-transparent group-hover:border-blue-100 transition-colors">
                  {/* Use the first image or a placeholder */}
                  <Image
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "/placeholder.png"
                    }
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-bold text-blue-900 text-center mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 px-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center gap-2 text-sm mb-2">
                  <span className="text-blue-600 font-semibold">
                    {formatPrice(product.price?.amount || 0)}
                  </span>
                  {product.price?.mrp && (
                    <span className="text-slate-400 line-through text-xs">
                      {formatPrice(product.price.mrp)}
                    </span>
                  )}
                </div>
                {product.shortDescription && (
                  <p className="text-[10px] text-slate-500 text-center px-4 line-clamp-2 italic mb-2">
                    {product.shortDescription}
                  </p>
                )}
                </Link>
                <div className="mt-3 px-2">
                  <Button
                    onClick={() => {
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price?.amount || 0,
                        image: product.images?.[0] || "/placeholder.png"
                      });
                      Swal.fire({
                        title: "Added to Cart!",
                        text: `${product.name} has been added to your cart.`,
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#2563eb",
                        cancelButtonColor: "#64748b",
                        confirmButtonText: "Go to Cart",
                        cancelButtonText: "Continue Shopping"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          router.push('/cart');
                        }
                      });
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cartItems.find(item => item.id === product._id) ? `Add Another (${cartItems.find(item => item.id === product._id)?.quantity})` : "Add to Cart"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const CollabPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProductGrid />
      <div className="pb-20">
        <CollabFeatured />
      </div>
    </div>
  );
};

export default CollabPage;
