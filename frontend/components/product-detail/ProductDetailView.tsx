"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, ShieldCheck, Truck, RefreshCcw, Star, ChevronRight, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/context/CartContext';

interface ProductImageZoomProps {
    src: string;
    alt: string;
}

const ProductImageZoom = ({ src, alt }: ProductImageZoomProps) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setMousePos({ x, y });
    };

    return (
        <div
            ref={containerRef}
            className="relative aspect-square overflow-hidden rounded-2xl bg-[#f5f5f5] cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <motion.div
                className="w-full h-full"
                animate={{
                    scale: isHovering ? 2 : 1,
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain p-12"
                    priority
                />
            </motion.div>
        </div>
    );
};

export default function ProductDetailView({ product }: { product: any }) {
    const [selectedImage, setSelectedImage] = useState(product.image);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useCart();

    if (!product) return null;

    const handleIncreaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        // Parse price to number (remove commas and currency symbols)
        const priceString = product.price?.toString().replace(/[^0-9.]/g, '') || '0';
        const priceNumber = parseFloat(priceString);

        addToCart({
            id: product.id?.toString() || product._id || product.slug,
            name: product.name,
            price: priceNumber,
            image: product.image || product.imageUrl || '/placeholder.png',
        }, quantity);

        // Reset quantity after adding
        setQuantity(1);
    };

    const handleToggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-900 font-medium capitalize">{product.category}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-400 truncate">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left: Images */}
                <div className="space-y-6">
                    <ProductImageZoom src={selectedImage} alt={product.name} />

                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-[#f5f5f5]
                                        ${selectedImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-100 hover:border-slate-300'}`}
                                >
                                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain p-2" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">{product.category}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="text-sm text-slate-500">(128 Reviews)</span>
                    </div>

                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="text-3xl font-bold text-blue-600">₹{product.price}</span>
                        {product.original && (
                            <span className="text-xl text-slate-400 line-through">₹{product.original}</span>
                        )}
                        {product.original && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                SAVE {Math.round((1 - parseFloat(product.price.replace(/,/g, '')) / parseFloat(product.original.replace(/,/g, ''))) * 100)}%
                            </span>
                        )}
                    </div>

                    <p className="text-slate-600 text-lg leading-relaxed mb-8">
                        {product.description || "Scientifically formulated to support your wellness journey with premium ingredients and advanced bioavailability."}
                    </p>

                    <div className="space-y-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-12">
                                <button
                                    onClick={handleDecreaseQuantity}
                                    className="px-4 py-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button
                                    onClick={handleIncreaseQuantity}
                                    className="px-4 py-2 hover:bg-slate-50 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </Button>
                            <button
                                onClick={handleToggleWishlist}
                                className={`h-12 w-12 flex items-center justify-center border rounded-lg transition-colors ${isWishlisted
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8 mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Quality Assured</h4>
                                <p className="text-xs text-slate-500">FSSAI Certified</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Fast Delivery</h4>
                                <p className="text-xs text-slate-500">3-5 Business Days</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                <RefreshCcw className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Return Policy</h4>
                                <p className="text-xs text-slate-500">7-Day Easy Returns</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Tabs / Details */}
            <div className="mt-20 border-t border-slate-100 pt-12">
                <div className="max-w-4xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Product Information</h2>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Our {product.name} is meticulously crafted to provide the highest quality nutraceutical support.
                            Each batch undergoes rigorous testing to ensure purity and potency.
                        </p>

                        {product.details && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-blue-900">{product.details.positioning}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.details.categories.map((cat: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="text-sm text-slate-700">{cat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
