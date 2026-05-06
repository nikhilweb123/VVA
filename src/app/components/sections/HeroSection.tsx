"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface HeroSlide {
  src: string;
  title: string;
  subtitle: string;
  location: string;
  ctaText?: string;
  ctaLink?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=85",
    title: "A Sleek Vision of\nModern Commerce",
    subtitle: "Golden Square, Manesar",
    location: "Haryana",
  },
  {
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85",
    title: "Merging Modernity with\nCultural Heritage",
    subtitle: "Mall Extension, Amritsar",
    location: "Punjab",
  },
  {
    src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1920&q=85",
    title: "Industrial Design \nwith Precision",
    subtitle: "Lal Sweets, Greater Noida",
    location: "Uttar Pradesh",
  },
  {
    src: "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?w=1920&q=85",
    title: "Strategic Planning for\nSustainable Living",
    subtitle: "Village Wave Group, Bengaluru",
    location: "Karnataka",
  },
];

interface HeroSectionProps {
  slides?: HeroSlide[];
}

export default function HeroSection({ slides = DEFAULT_SLIDES }: HeroSectionProps) {
  const activeSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(intervalRef.current);
  }, [activeSlides.length]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
  };

  const slide = activeSlides[current] ?? activeSlides[0];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-obsidian">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.src}
            alt={slide.subtitle}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${current}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 40 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: loaded ? 0 : 0.3 }}
          >
            <p className="font-sans text-black/60 text-xs tracking-ultra uppercase mb-6">
              {String(current + 1).padStart(2, "0")} / {String(activeSlides.length).padStart(2, "0")} &nbsp;—&nbsp; {slide.location}
            </p>
            <h1 className="font-serif text-black text-4xl md:text-7xl lg:text-8xl font-light leading-[1.05] tracking-tight whitespace-pre-line mb-6 max-w-5xl">
              {slide.title}
            </h1>
            <p className="font-sans text-black/80 text-sm tracking-wide mb-6">
              {slide.subtitle}
            </p>
            {slide.ctaText && slide.ctaLink && (
              <Link
                href={slide.ctaLink}
                className="nav-link inline-flex items-center gap-3 font-sans text-black text-xs tracking-ultra uppercase group"
              >
                {slide.ctaText}
                <span className="block w-8 h-px bg-black transition-all duration-500 group-hover:w-14" />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 right-8 md:right-16 flex gap-3">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-6 h-px transition-all duration-500 ${i === current ? "bg-black w-12" : "bg-black/20"}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-black/60 text-[10px] tracking-ultra uppercase">Scroll</span>
        <div className="scroll-bounce w-px h-8 bg-gradient-to-b from-black/80 to-transparent" />
      </motion.div>
    </section>
  );
}
