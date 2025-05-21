import Image from "next/image";
import BackgroundBoxesDemo from "@/components/HeroSection";
import Features from "@/components/Features";
import Testimonials2 from "@/components/Testimonials2";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <section id="home">
        <BackgroundBoxesDemo />
      </section>
      
      <section id="features">
        <Features/>
      </section>
      
      <section id="testimonials">
        <Testimonials2/>
      </section>
      
      <section id="contact">
        <Contact/>
      </section>


    </main>
  );
}
