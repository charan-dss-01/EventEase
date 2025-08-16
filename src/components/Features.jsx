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
      title: "For Event Organizers",
      description:
        "Create and promote your events with ease. Manage registrations, track attendance, and engage with your audience through our comprehensive event management tools.",
      link: "/docs/organizers",
    },
    {
      title: "For Students & Participants",
      description:
        "Discover exciting events, register with a single click, and receive digital tickets. Stay updated with event notifications and manage your event calendar.",
      link: "/docs/participants",
    },
    {
      title: "Event Promotion",
      description:
        "Reach a wider audience with our powerful promotion tools. Share events on social media, send email notifications, and track engagement metrics.",
      link: "/docs/promotion",
    },
    {
      title: "Smart Registration",
      description:
        "Streamlined registration process with instant ticket generation. QR code-based check-in system for quick and secure event entry.",
      link: "/docs/registration",
    },
    {
      title: "Event Categories",
      description:
        "Browse events by categories like Academic, Cultural, Sports, Workshops, and more. Find events that match your interests and schedule.",
      link: "/docs/categories",
    },
    {
      title: "Interactive Dashboard",
      description:
        "Personalized dashboard for both organizers and participants. Track event statistics, manage registrations, and view upcoming events.",
      link: "/docs/dashboard",
    },
    {
      title: "Real-time Updates",
      description:
        "Stay informed with real-time notifications about event changes, registration confirmations, and important announcements.",
      link: "/docs/updates",
    },
    {
      title: "Community Building",
      description:
        "Connect with like-minded individuals, share experiences, and build a network of event enthusiasts and organizers.",
      link: "/docs/community",
    },
  ];