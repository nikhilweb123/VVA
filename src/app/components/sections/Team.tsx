"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "../../hooks/useInView";

export interface SocialLink {
  platform: string;
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  image: string;
  description?: string;
  socialLinks: SocialLink[];
  order: number;
}

const FALLBACK_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Vikram Varma",
    designation: "Principal Architect",
    image: "/team/member1.png",
    description: "With over 20 years of experience, Vikram leads the studio's architectural vision, bringing a meticulous eye for detail and context.",
    socialLinks: [],
    order: 0,
  },
  {
    id: "2",
    name: "Ananya Singh",
    designation: "Head of Interiors",
    image: "/team/member2.png",
    description: "Ananya transforms abstract concepts into tangible environments, focusing on materiality, light, and human experience.",
    socialLinks: [],
    order: 1,
  },
  {
    id: "3",
    name: "Rajesh Nair",
    designation: "Master Planning Lead",
    image: "/team/member3.png",
    description: "Rajesh specializes in large-scale urban strategies, ensuring our developments remain sustainable and community-centric.",
    socialLinks: [],
    order: 2,
  },
];

const PLATFORM_ICONS: Record<string, string> = {
  linkedin: "in",
  twitter: "𝕏",
  instagram: "ig",
  behance: "bē",
  dribbble: "db",
};

function getPlatformIcon(platform: string) {
  return PLATFORM_ICONS[platform.toLowerCase()] ?? platform.charAt(0).toUpperCase();
}

interface TeamProps {
  members?: TeamMember[];
}

export default function Team({ members }: TeamProps) {
  const { ref: headerRef, inView: headerInView } = useInView();
  const list = members && members.length > 0 ? members : FALLBACK_MEMBERS;

  return (
    <section className="bg-obsidian min-h-screen">
      {/* Cinematic Header */}
      <div className="relative h-[60vh] md:h-[70vh] flex items-center px-8 md:px-16 overflow-hidden">
        <Image
          src="/team/header-bg.png"
          alt="The Minds Behind The Craft"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

        <div className="relative z-10 max-w-5xl pt-20">
          <motion.p
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-sans text-ivory/60 text-[16px] tracking-ultra uppercase mb-6"
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
      </div>

      <div className="pt-24 pb-32">
        <hr className="hr-thin mx-8 md:mx-16 mb-16" />

        {/* Team Grid */}
        <div className="px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {list.map((member, index) => (
            <TeamCard key={member.id ?? index} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1 + 0.1 }}
      className="group flex flex-col items-start"
    >
      {/* Photo */}
      <div className="w-full aspect-[4/5] bg-white/5 mb-8 relative overflow-hidden transition-all duration-700 grayscale hover:grayscale-0">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-ivory/20 text-7xl font-light">
              {member.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Social links — appear on hover */}
        {member.socialLinks && member.socialLinks.length > 0 && (
          <div className="absolute bottom-6 left-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {member.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-8 h-8 border border-ivory/40 flex items-center justify-center text-ivory font-sans text-[10px] tracking-wider hover:bg-ivory hover:text-obsidian transition-colors duration-300"
                title={link.platform}
              >
                {getPlatformIcon(link.platform)}
              </a>
            ))}
          </div>
        )}
      </div>

      <p className="font-sans text-ash text-xs tracking-ultra uppercase mb-3 text-[#D87441]/80">
        {member.designation}
      </p>
      <h3 className="font-serif text-ivory text-3xl font-light mb-4">
        {member.name}
      </h3>
      {member.description && (
        <p className="font-sans text-bone/70 text-base leading-relaxed font-light">
          {member.description}
        </p>
      )}
    </motion.div>
  );
}
