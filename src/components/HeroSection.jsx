"use client";
import React from "react";
import { Boxes } from "./ui/background-boxes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export function BackgroundBoxesDemo() {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      {/* Radial light effect mask */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      {/* Animated background boxes */}
      <Boxes />

      {/* SVG Globe background */}
      <motion.img
        src="/globe2.svg"
        alt="Globe Connection Map"
        className="absolute z-10 w-full max-w-5xl opacity-10 pointer-events-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Main Content */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="flex-1 text-center">
          {/* Project Name */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm uppercase tracking-widest text-pink-400 mb-2"
          >
            Welcome to EventEase
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={cn(
              "md:text-6xl p-6 text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            )}
          >
            Bringing People Together, Seamlessly
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-neutral-300 text-lg md:text-xl max-w-xl mx-auto"
          >
            Connect with people worldwide through events that matter. Join the EventEase community and create unforgettable moments.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
          >
            <Link href="/sign-up">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </Link>
            <Link href="/features">
              <button className="px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                Explore Features
              </button>
            </Link>
          </motion.div>

          {/* Active Users Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 text-sm text-neutral-400"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            <span>1,234 people connecting right now</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BackgroundBoxesDemo;
