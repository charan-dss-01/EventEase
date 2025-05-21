"use client";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Testimonials2() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const testimonials = [
    {
      quote:
        "EventEase has revolutionized how we organize and manage our community events. The intuitive interface and seamless image uploads make everything effortless!",
      name: "Anita Patel",
      designation: "Community Organizer",
      src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop",
    },
    {
      quote:
        "Thanks to EventEase, coordinating large conferences is now a breeze. The tag-based search and filtering saved us countless hours.",
      name: "Rajesh Kumar",
      designation: "Conference Manager",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    },
    {
      quote:
        "The user authentication with Clerk was flawless and made signing in quick and secure. Our attendees love the smooth experience!",
      name: "Maria Gomez",
      designation: "Event Marketing Specialist",
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    },
    {
      quote:
        "Cloudinary integration for image uploads keeps our event galleries fast and visually stunning. EventEase truly has every detail covered.",
      name: "John Lee",
      designation: "Creative Director",
      src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop",
    },
    {
      quote:
        "The responsive UI powered by ShadCN makes managing events on the go so convenient. I can handle everything right from my phone!",
      name: "Nina Shah",
      designation: "Freelance Event Planner",
      src: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=400&auto=format&fit=crop",
    },
  ];
  
  if (!mounted) {
    return null;
  }
      
  return (
    <section className="min-h-screen bg-black flex items-center justify-center flex-col mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-20 md:mt-0 mb-12"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            What Our Users Say
          </span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-300 max-w-2xl mx-auto"
        >
          Join thousands of users who stay ahead of the weather with real-time forecasts and accurate updates from Weather Masters.
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <AnimatedTestimonials testimonials={testimonials} />
      </motion.div>
    </section>
  );
}
