"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "../../hooks/useInView";

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  review: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.3 });

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-obsidian py-28 md:py-40 px-8 md:px-16 lg:px-24 border-t border-black/10">
      <motion.p
        ref={headerRef}
        initial={{ opacity: 0, y: 15 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="font-sans text-black/40 text-[10px] tracking-ultra uppercase mb-12"
      >
        Client Words
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-black text-3xl md:text-5xl font-light leading-snug max-w-3xl mb-20"
      >
        What our clients say.
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10">
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} index={i} />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="bg-obsidian p-10 md:p-12 flex flex-col gap-8"
    >
      <p className="font-serif text-black text-xl md:text-2xl font-light leading-relaxed flex-1">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      <div className="flex items-center gap-4 border-t border-black/10 pt-8">
        {testimonial.image ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              sizes="48px"
              className="object-cover grayscale"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-black/60 text-lg font-light">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-serif text-black text-base font-light">{testimonial.name}</p>
          {testimonial.role && (
            <p className="font-sans text-black/50 text-[10px] tracking-ultra uppercase mt-0.5">
              {testimonial.role}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
