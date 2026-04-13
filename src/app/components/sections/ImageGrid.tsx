"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "../../hooks/useInView";

const images = [
  {
    src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    alt: "Architectural detail — concrete facade",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    alt: "Interior — living space",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    alt: "Exterior — evening light",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    alt: "Residence — dusk",
    span: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
    alt: "Interior — minimal bathroom",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80",
    alt: "Staircase — steel and concrete",
    span: "",
  },
];

export default function ImageGrid() {
  const { ref: headRef, inView: headInView } = useInView();

  return (
    <section className="bg-white py-24 px-8 md:px-16">
      {/* Header */}
      <div ref={headRef} className="mb-14">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-sans text-black/40 text-[16px] tracking-ultra uppercase mb-3"
        >
          Studio Imagery
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-black text-5xl md:text-6xl font-light"
        >
          Craft &amp; Detail
        </motion.h2>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-[auto] gap-3 md:gap-4">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            className={`img-grayscale relative overflow-hidden cursor-pointer group ${img.span}`}
            style={{ aspectRatio: img.span === "row-span-2" ? "3/4" : "4/3" }}
            data-cursor-hover
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-all duration-700"
              loading="lazy"
            />
            {/* Caption overlay */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 transition-all duration-500 flex items-end p-4">
              <p className="font-sans text-black text-[10px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0 transition-transform">
                {img.alt}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
