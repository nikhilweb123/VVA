"use client";

import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";

const stats = [
  { value: "18+", label: "Years of Practice" },
  { value: "120+", label: "Projects Completed" },
  { value: "14", label: "Design Awards" },
  { value: "8", label: "States Across India" },
];

export default function StatsBanner() {
  const { ref, inView } = useInView({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="border-y border-black/10 grid grid-cols-2 md:grid-cols-4 bg-[#7f7f7f]"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: i * 0.1 + 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`flex flex-col items-start justify-center py-12 px-10 md:px-14 border-r border-black/10 last:border-r-0 ${i % 2 === 0 ? "border-b md:border-b-0" : ""
            }`}
        >
          <span className="font-serif text-white text-5xl md:text-6xl font-light mb-2">
            {stat.value}
          </span>
          <span className="font-sans text-white text-[10px] tracking-ultra uppercase">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </section>

  );
}
