"use client";
import React, { useEffect, use } from 'react';
import Link from 'next/link';
import ProductDetailView from '@/components/product-detail/ProductDetailView';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
    fetchProductBySlug,
    selectSelectedProduct,
    selectProductsLoading,
    clearSelectedProduct
} from '@/lib/redux/features/productSlice';
import Loader from '@/components/common/dashboard/Loader';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const dispatch = useAppDispatch();
    const product = useAppSelector(selectSelectedProduct);
    const isLoading = useAppSelector(selectProductsLoading);

    useEffect(() => {
        if (slug) {
            dispatch(fetchProductBySlug(slug));
        }
        return () => {
            dispatch(clearSelectedProduct());
        }
    }, [dispatch, slug]);


    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader variant="spinner" message="Loading product details..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-slate-800">Product Not Found</h1>
                <p className="text-slate-500">The product you are looking for does not exist.</p>
                <Link href="/shop" className="mt-4 text-blue-600 hover:underline">Back to Shop</Link>
            </div>
        );
    }

    return <ProductDetailView product={product} />;
}
