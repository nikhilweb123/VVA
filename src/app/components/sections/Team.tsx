"use client";

import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";

const teamMembers = [
  {
    name: "Vikram Varma",
    role: "Principal Architect",
    description: "With over 20 years of experience, Vikram leads the studio's architectural vision, bringing a meticulous eye for detail and context."
  },
  {
    name: "Ananya Singh",
    role: "Head of Interiors",
    description: "Ananya transforms abstract concepts into tangible environments, focusing on materiality, light, and human experience."
  },
  {
    name: "Rajesh Nair",
    role: "Master Planning Lead",
    description: "Rajesh specializes in large-scale urban strategies, ensuring our developments remain sustainable and community-centric."
  },
  {
    name: "Priya Sharma",
    role: "Senior Designer",
    description: "Priya brings fresh perspectives and innovative parametric design techniques to the studio's most complex geometries."
  },
  {
    name: "Amit Desai",
    role: "Project Manager",
    description: "Amit ensures every design is executed flawlessly on-site, balancing schedules, budgets, and uncompromised quality."
  },
  {
    name: "Neha Gupta",
    role: "Sustainability Consultant",
    description: "Neha integrates passive cooling, ecological materials, and energy efficiency into every phase of our designs."
  }
];

export default function Team() {
  const { ref: headerRef, inView: headerInView } = useInView();

  return (
    <section className="bg-obsidian pt-40 pb-32 min-h-screen">
      {/* Section Header */}
      <div className="px-8 md:px-16 mb-24 max-w-5xl">
        <motion.p
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-sans text-ash text-[16px] tracking-ultra uppercase mb-6"
        >
          Leadership & Team
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-ivory text-5xl md:text-7xl lg:text-8xl font-light leading-tight"
        >
          The minds behind the craft.
        </motion.h1>
      </div>

      <hr className="hr-thin mx-8 md:mx-16 mb-16" />

      {/* Team Grid */}
      <div className="px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {teamMembers.map((member, index) => (
          <TeamCard key={member.name} member={member} index={index} />
        ))}
      </div>
    </section>
  );
}

function TeamCard({ member, index }: { member: any; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1 + 0.1 }}
      className="group flex flex-col items-start"
    >
      <div className="w-full aspect-[4/5] bg-white/5 mb-8 relative overflow-hidden transition-all duration-700 hover:bg-white/10 grayscale hover:grayscale-0">
        {/* Placeholder styling to look elegant even without a real photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-105 transition-transform duration-700">
            <span className="font-sans text-ash text-xs tracking-ultra uppercase">Portrait</span>
        </div>
      </div>
      
      <p className="font-sans text-ash text-xs tracking-ultra uppercase mb-3 text-[#D87441]/80">
        {member.role}
      </p>
      <h3 className="font-serif text-ivory text-3xl font-light mb-4">
        {member.name}
      </h3>
      <p className="font-sans text-bone/70 text-base leading-relaxed font-light">
        {member.description}
      </p>
    </motion.div>
  );
}
