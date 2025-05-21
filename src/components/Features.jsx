"use client";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ColourfulText } from "@/components/ui/colourful-text";
import { useEffect, useState } from "react";

export default function Features() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="min-h-screen w-full py-20 bg-gradient-to-b from-black to-gray-900 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-2xl mt-10 md:text-3xl lg:text-5xl font-bold text-center text-white relative z-2 font-sans">
            <ColourfulText text="Explore Features" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-6"
          >
            Discover the powerful features that make our platform stand out
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
      <HoverEffect items={features} />
        </motion.div>
    </div>
    </section>
  );
}

export const features = [
    {
      title: "User Authentication",
      description:
        "Secure and seamless user sign-up and login using Clerk, with session management and profile syncing.",
      link: "/docs/authentication",
    },
    {
      title: "Event Creation & Management",
      description:
        "Create, update, and delete events with detailed information such as title, description, date, location, and images.",
      link: "/docs/events",
    },
    {
      title: "Image Upload with Cloudinary",
      description:
        "Upload event images efficiently to Cloudinary for optimized storage and fast delivery.",
      link: "/docs/image-upload",
    },
    {
      title: "Tag-based Search & Filtering",
      description:
        "Search events and filter them based on tags, date, or location for better user experience.",
      link: "/docs/search-filter",
    },
    {
      title: "Responsive UI with ShadCN",
      description:
        "Beautiful, modern, and accessible UI components built with ShadCN and Tailwind CSS for a seamless frontend experience.",
      link: "/docs/ui",
    },
    {
      title: "MongoDB Backend",
      description:
        "Robust backend powered by MongoDB for storing user data, events, and media references securely.",
      link: "/docs/backend",
    },
  ];