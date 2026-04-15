"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";

export interface Project {
  id: string;
  title: string;
  location: string;
  category: string;
  year: string;
  src: string;
  description: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el || typeof window === "undefined") return;

    let gsap: any;
    let ctx: any;

    const init = async () => {
      const g = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap = g.gsap;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          el.querySelector("img"),
          { scale: 1.15, y: "-8%" },
          {
            scale: 1,
            y: "8%",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });
    };

    init();
    return () => ctx?.revert();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-2 gap-0 items-center ${isEven ? "" : "md:flex-row-reverse"}`}
    >
      {/* Image */}
      <div
        ref={imgRef}
        className={`relative overflow-hidden ${isEven ? "order-1" : "order-1 md:order-2"}`}
        style={{ height: "70vh" }}
      >
        <Image
          src={project.src}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-obsidian/20" />
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className={`flex flex-col justify-center px-10 md:px-16 py-16 ${isEven ? "order-2" : "order-2 md:order-1"}`}
      >
        <p className="font-sans text-black/40 text-[14px] tracking-ultra uppercase mb-6">
          {project.id} — {project.category} — {project.year}
        </p>
        <h2 className="font-serif text-black text-4xl md:text-6xl font-light leading-tight mb-4">
          {project.title}
        </h2>
        <p className="font-sans text-black/60 text-xs tracking-wide mb-6">{project.location}</p>
        <hr className="border-black/10 mb-6" />
        <p className="font-sans text-black/60 text-sm leading-relaxed mb-10 md:text-2xl">{project.description}</p>
        <a
          href="#"
          className="nav-link font-sans text-black text-xs tracking-ultra uppercase inline-flex items-center gap-3 group w-fit"
        >
          View Project
          <span className="block w-8 h-px bg-black transition-all duration-500 group-hover:w-14" />
        </a>
      </motion.div>

    </div>
  );
}

export default function ProjectShowcase() {
  const { ref: titleRef, inView: titleInView } = useInView();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch projects', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="bg-obsidian py-24">
      {/* Section Header */}
      <div className="px-8 md:px-16 mb-16">
        <motion.p
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-sans text-ash text-[16px] tracking-ultra uppercase mb-4"
        >
          Selected Work
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-ivory text-7xl md:text-6xl font-light"
        >
          Projects
        </motion.h2>
      </div>

      <hr className="hr-thin mx-8 md:mx-16 mb-0" />

      {/* Projects */}
      <div className="divide-y divide-bone/10 min-h-[50vh]">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="font-sans text-ash text-xs tracking-ultra uppercase animate-pulse">Loading projects...</p>
          </div>
        ) : (
          projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))
        )}
      </div>
    </section>
  );
}
