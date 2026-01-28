"use client";
import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
    {
        id: 1,
        text: "I feel so much better after using GlycoGuard! My sugar levels are steady, and I have more energy to get through the day.",
        author: "Neha Patel",
        rating: 5,
    },
    {
        id: 2,
        text: "Since starting Longevity Pro, my focus has improved and I just feel sharper overall. Highly recommended!",
        author: "Rahul Sharma",
        rating: 5,
    },
    {
        id: 3,
        text: "The Complete Gut Fibre is a game changer. No more bloating and I feel lighter than ever.",
        author: "Priya Singh",
        rating: 5,
    },
    {
        id: 4,
        text: "Amazing products. The science behind them feels real and the results speak for themselves.",
        author: "Vikram Malhotra",
        rating: 5,
    },
    {
        id: 5,
        text: "Wellness has completely transformed my daily wellness routine. Simple, effective, and reliable.",
        author: "Anjali Gupta",
        rating: 5,
    },
];

const TestimonialsCarouselSection = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <section className="py-20 bg-blue-50/50 dark:bg-slate-950 overflow-hidden text-center relative">
            {/* Background decorative quote mark */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none">
                <Quote className="w-48 h-48 rotate-180 text-blue-900" />
            </div>

            <div className="max-w-4xl mx-auto px-4">

                {/* Carousel Container */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center space-y-8 px-4">
                                {/* Stars */}
                                <div className="flex gap-1.5">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-blue-500 fill-current" />
                                    ))}
                                </div>

                                {/* Quote Text */}
                                <blockquote className="text-xl md:text-3xl font-bold text-blue-900 leading-snug md:leading-normal max-w-3xl">
                                    &ldquo;{testimonial.text}&rdquo;
                                </blockquote>

                                {/* Author */}
                                <cite className="not-italic text-base md:text-lg text-slate-500 font-medium">
                                    {testimonial.author}
                                </cite>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation & Pagination */}
                <div className="flex items-center justify-center gap-8 mt-12">
                    {/* Prev Button */}
                    <Button
                        onClick={scrollPrev}
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 rounded-full border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-blue-600 hover:border-blue-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    {/* Dots */}
                    <div className="flex gap-2.5">
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                    ? 'bg-blue-900 w-2.5 h-2.5'
                                    : 'bg-slate-300 hover:bg-slate-400'
                                    }`}
                                onClick={() => scrollTo(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Next Button */}
                    <Button
                        onClick={scrollNext}
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 rounded-full border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-blue-600 hover:border-blue-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default TestimonialsCarouselSection;
