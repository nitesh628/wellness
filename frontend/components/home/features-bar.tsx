"use client";
import React from 'react';
import { WheatOff, BoxSelect, FlaskConicalOff, Leaf } from 'lucide-react';

const FeaturesBar = () => {
    const features = [
        { icon: WheatOff, label: "No Gluten" },
        { icon: BoxSelect, label: "No Sugar" }, // Using BoxSelect as a proxy for cubes/sugar
        { icon: FlaskConicalOff, label: "No Preservatives" },
        { icon: Leaf, label: "100% Veg" },
    ];

    return (
        <section className="bg-blue-50/50 dark:bg-slate-900 border-y border-blue-100 dark:border-slate-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center md:justify-around items-center gap-8 md:gap-0">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center gap-3 group">
                            <div className="w-16 h-16 rounded-full border-2 border-slate-900 dark:border-slate-100 flex items-center justify-center bg-transparent transition-transform duration-300 group-hover:scale-110">
                                {/* Icon */}
                                <feature.icon className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                                {feature.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesBar;
