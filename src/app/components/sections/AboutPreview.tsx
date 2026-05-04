"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "../../hooks/useInView";

const services = [
  "Master planning and Architectural Design services.",
  "Landscape Design Services.",
  "Interior Design Services.",
  "BIM Modelling for Precise & Fast track deliveries.",
  "Single Point responsibility of the project ensuring Cost control, Quality and Schedule.",
  "Technical Due Diligence Services.",
];

const philosophy = [
  {
    num: "01",
    title: "Approach",
    body: "Every project is guided by a deep understanding of client aspirations, ensuring designs that are both functional and meaningful.",
  },
  {
    num: "02",
    title: "Design",
    body: "We focus on creating residential, commercial, and public spaces that balance modern aesthetics with practical efficiency.",
  },
  {
    num: "03",
    title: "Execution",
    body: "From concept to completion, we deliver cohesive architectural solutions that enhance user experience and create lasting value.",
  },
];

interface AboutPreviewProps {
  isPreview?: boolean;
}

export default function AboutPreview({ isPreview = false }: AboutPreviewProps) {
  const { ref: quoteRef, inView: quoteInView } = useInView({ threshold: 0.3 });
  const { ref: cardsRef, inView: cardsInView } = useInView({ threshold: 0.1 });

  return (
    <section id="about" className="bg-obsidian overflow-hidden">
      {/* Intro Block */}
      <div
        ref={quoteRef}
        className="py-28 md:py-40 px-8 md:px-16 lg:px-24 border-t border-black/10"
      >
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={quoteInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-sans text-black/40 text-[10px] tracking-ultra uppercase mb-12"
        >
          Our Studio
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={quoteInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-black text-3xl md:text-5xl lg:text-6xl font-light leading-snug max-w-5xl mb-16"
        >
          Vaibhav Vashisht Architects Design Studio Private Limited
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={quoteInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-10 md:gap-20"
        >
          <div>
            <p className="font-sans text-gray-600 text-lg leading-relaxed">
              Headed by Mr. Vaibhav Vashisht, Architect, Registered under Council of
              Architecture (CoA), with Design &amp; Execution experience of 18+ years,
              supported by a strong team of 6 Architects &amp; Interior Designers.
            </p>
          </div>
          <div>
            <p className="font-sans text-gray-600 text-lg leading-relaxed">
              Based in Faridabad NCR, executing projects PAN India. As creative
              thinkers and technology specialists, we have designed &amp; executed
              multiple projects with strengths in Residential — High-Rise &amp; Low-Rise
              buildings, Industrial, Warehousing, Retail, Multiplexes &amp; Hotels.
            </p>
          </div>
        </motion.div>

        {isPreview ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={quoteInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <Link
              href="/about"
              className="nav-link inline-flex items-center gap-3 font-sans text-black text-xs tracking-ultra uppercase group"
            >
              Learn More About Us
              <span className="block w-8 h-px bg-black transition-all duration-500 group-hover:w-14" />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={quoteInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 border-t border-black/10 pt-16"
          >
            <p className="font-sans text-black/40 text-[10px] tracking-ultra uppercase mb-10">
              Our In-House Design Services
            </p>
            <ul className="grid md:grid-cols-2 gap-x-16 gap-y-5">
              {services.map((service, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={quoteInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.08 }}
                  className="flex items-start gap-3 font-sans text-gray-600 text-base leading-relaxed"
                >
                  <span className="text-black/30 mt-1 flex-shrink-0">—</span>
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Image + Philosophy cards — only on full about page */}
      {!isPreview && (
        <div className="grid md:grid-cols-5 border-t border-bone/10">
          <div className="md:col-span-2 relative min-h-[50vh]">
            <Image
              src="https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1000&q=80"
              alt="VVA Design Studio at work"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover grayscale"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-obsidian/30" />
            <div className="absolute bottom-8 left-8">
              <p className="font-sans text-bone text-[10px] tracking-ultra uppercase">
                ↑ Studio — VVA Design
              </p>
            </div>
          </div>

          <div ref={cardsRef} className="md:col-span-3 px-10 md:px-16 py-16">
            <p className="font-sans text-black/40 text-[14px] tracking-ultra uppercase mb-10">
              How We Work
            </p>
            <div className="space-y-0 divide-y divide-black/10">
              {philosophy.map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, x: 30 }}
                  animate={cardsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.15 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="py-8 group"
                >
                  <div className="flex items-start gap-8">
                    <span className="font-sans text-black/40 text-[10px] tracking-ultra pt-1 flex-shrink-0">
                      {item.num}
                    </span>
                    <div>
                      <h3 className="font-serif text-black text-2xl font-light mb-3 group-hover:translate-x-1 transition-transform duration-300">
                        {item.title}
                      </h3>
                      <p className="font-sans text-black/60 md:text-lg leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
