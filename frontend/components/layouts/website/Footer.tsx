"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, ArrowRight } from "lucide-react";

// Placeholder for  Image - reusing the one from public if available
// If using Next.js public folder, strings are best.
const TESTED_BY_IMAGE = "/Hero.png";

const Footer = () => {
  return (
    <footer className="w-full">

      {/* Tested By Section */}
      <div className="w-full bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 border-b border-transparent">
        {/* Adjusted to Blue/White gradient */}
        <div className="relative w-full h-[250px] md:h-[300px] bg-gradient-to-r from-blue-400 via-white to-sky-400 flex items-center justify-center overflow-hidden">

          <div className="max-w-7xl mx-auto w-full px-4 flex flex-col md:flex-row items-center justify-center md:gap-16 lg:gap-32 relative z-10">

            {/* Left Text */}
            <div className="text-blue-900 font-bold text-3xl md:text-5xl -translate-y-4 md:translate-y-0 text-center md:text-left">
              Tested by
            </div>

            {/*  Image */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 md:-mb-16 flex-shrink-0 mt-8 md:mt-0">
              <Image
                src={TESTED_BY_IMAGE}
                alt=" "
                fill
                className="object-cover object-top rounded-full md:rounded-none md:bg-transparent mix-blend-multiply"
              />
            </div>

            {/* Right Text */}
            <div className="text-center md:text-left text-blue-900">
              <div className="font-bold text-3xl md:text-5xl"> </div>
              <div className="text-xl md:text-2xl font-normal mt-1 text-white md:text-blue-900">
                for longevity & vitality
              </div>
            </div>

          </div>

          {/* Gradient Overlays for better text contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 pointer-events-none md:hidden" />
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white pt-16 pb-8 px-6 md:px-12 lg:px-20 relative">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Column 1: Info */}
          <div className="lg:col-span-4 space-y-6">
            <p className="text-sm md:text-base leading-relaxed text-blue-50 max-w-sm">
              Wellness offers plant based supplements crafted by leading doctors to support health in areas like diabetes, metabolic wellness, and fertility. Rooted in rigorous research, their natural formulations are free from artificial additives, prioritizing safe, effective solutions for better living.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:opacity-80 transition-opacity"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="hover:opacity-80 transition-opacity"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="hover:opacity-80 transition-opacity"><Youtube className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="lg:col-span-2 space-y-4 text-sm font-medium">
            <Link href="/privacy-policy" className="block hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="block hover:underline">Terms and Conditions</Link>
            <Link href="/orders" className="block hover:underline">Orders & Shipping</Link>
            <Link href="/refunds" className="block hover:underline">Refunds & Cancellation</Link>
            <Link href="/science" className="block hover:underline">Science</Link>
            <Link href="/about" className="block hover:underline">About Us</Link>
            <Link href="/contact" className="block hover:underline">Contact</Link>
          </div>

          {/* Column 3: Connect */}
          <div className="lg:col-span-2 space-y-4 text-sm font-medium">
            <h4 className="font-bold text-lg mb-4">Connect</h4>
            <div>01140848448</div>
            <div>info@nutra-zen.com</div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-bold text-2xl md:text-3xl">
              Be the first to know<br />
              about new arrivals
            </h3>
            <div className="relative max-w-sm mt-4">
              <input
                type="email"
                placeholder="E-mail"
                className="w-full bg-blue-800/50 border border-blue-400/30 rounded-lg px-4 py-3 placeholder-blue-200/70 focus:outline-none focus:ring-1 focus:ring-blue-200 text-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-blue-700/50 rounded-full transition-colors">
                <ArrowRight className="w-4 h-4 text-blue-100" />
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-[1920px] mx-auto mt-16 pt-8 text-xs text-blue-100/80 font-light tracking-wide">
          © 2026, Wellness. Powered by Shopify
        </div>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 transition-transform hover:scale-110"
        >
          {/* Simple WhatsApp SVG */}
          <div className="bg-[#25D366] p-3 rounded-full shadow-lg">
            <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white">
              <path d="M16 2C8.3 2 2 8.3 2 16c0 2.5.6 4.8 1.8 6.8L2.5 29l6.4-1.7c1.9 1 4.1 1.6 6.4 1.6 7.7 0 14-6.3 14-14S23.7 2 16 2zm0 25.5c-2.1 0-4.1-.5-5.9-1.5l-.4-.2-4.4 1.1 1.2-4.2-.3-.4c-1.1-1.8-1.7-3.9-1.7-6.1 0-6.3 5.2-11.5 11.5-11.5s11.5 5.2 11.5 11.5-5.2 11.3-11.5 11.3z" />
              <path d="M22.5 19.3c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.1-.2.4-1.1 1.2-1.2 1.5-.2.2-.4.4-.7.1-2.9-1.3-4.8-3.9-5.1-4.3-.2-.4 0-.4.3-.8.2-.3.4-.6.6-.8.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6s-.7-1.8-1-2.4c-.3-.6-.6-.5-.9-.5h-.7c-.3 0-.7.1-1.1.5-.4.4-1.5 1.5-1.5 3.6s1.6 4.2 1.8 4.5c.2.3 3.1 4.7 7.5 6.6 2.8 1.2 3.9 1 5.3.9 1.2-.1 2.8-1.2 3.2-2.3.4-1.1.4-2.1.3-2.3-.1-.2-.4-.3-.7-.5z" />
            </svg>
          </div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
