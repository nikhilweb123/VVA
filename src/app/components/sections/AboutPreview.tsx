"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "../../hooks/useInView";

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

export default function AboutPreview() {
  const { ref: quoteRef, inView: quoteInView } = useInView({ threshold: 0.3 });
  const { ref: wordsRef, inView: wordsInView } = useInView({ threshold: 0.15 });
  const { ref: cardsRef, inView: cardsInView } = useInView({ threshold: 0.1 });

  return (
    <section id="about" className="bg-obsidian overflow-hidden">
      {/* Big Quote */}
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

        <div className="max-w-5xl">
          {"Creating timeless architecture that transforms everyday living and working environments."
            .split(" ")
            .map((word, i) => (
              <motion.span
                key={i}
                ref={i === 0 ? wordsRef : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={quoteInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.04 + 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block font-sans text-black text-3xl md:text-5xl lg:text-6xl font-light leading-snug mr-3 md:mr-4"
              >
                {word}
              </motion.span>
            ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={quoteInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid md:grid-cols-2 gap-10 md:gap-20"
        >
          <div>
            <p className="font-sans text-gray-600 text-lg leading-relaxed">
              Established in 2024 in Faridabad, our architecture firm is driven by a commitment to transform lives through thoughtful and exceptional design. We specialize in creating distinguished residential and workplace environments, along with meaningful public spaces that respond to evolving urban needs.
            </p>
          </div>
          <div>
            <p className="font-sans text-gray-600 text-lg leading-relaxed">
              Every project is carefully conceived to reflect our clients’ aspirations, balancing functionality with timeless aesthetics. From concept to execution, we focus on delivering cohesive spaces that enhance everyday experiences and create lasting value across every scale of development.
            </p>
          </div>
        </motion.div>

        <motion.a
          href="#"
          initial={{ opacity: 0, y: 15 }}
          animate={quoteInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="nav-link mt-12 inline-flex items-center gap-3 font-sans text-black text-xs tracking-ultra uppercase group"
        >
          Our Philosophy
          <span className="block w-8 h-px bg-black transition-all duration-500 group-hover:w-14" />
        </motion.a>
      </div>


      {/* Image + Philosophy cards */}
      <div className="grid md:grid-cols-5 border-t border-bone/10">
        {/* Full-bleed image */}
        <div className="md:col-span-2 relative min-h-[50vh]">
          <Image
            src="https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1000&q=80"
            alt="Studio at work"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-obsidian/30" />
          <div className="absolute bottom-8 left-8">
            <p className="font-sans text-bone text-[10px] tracking-ultra uppercase">↑ Model study, Pine Hill Lodge</p>
          </div>
        </div>

        {/* Philosophy */}
        <div ref={cardsRef} className="md:col-span-3 px-10 md:px-16 py-16">
          <p className="font-sans text-black/40 text-[14px] tracking-ultra uppercase mb-10">How We Work</p>
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
                  <span className="font-sans text-black/40 text-[10px] tracking-ultra pt-1 flex-shrink-0">{item.num}</span>
                  <div>
                    <h3 className="font-serif text-black text-2xl font-light mb-3 group-hover:translate-x-1 transition-transform duration-300">
                      {item.title}
                    </h3>
                    <p className="font-sans text-black/60 md:text-lg leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
