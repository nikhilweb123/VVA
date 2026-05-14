"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import Link from "next/link";

export interface Project {
  id: string;
  title: string;
  location: string;
  category: string;
  year: string;
  src: string;
  description: string;
  subtitle?: string;
  featured?: boolean;
  isMiscellaneous?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

interface MiscProjectCardProps {
  project: Project;
}

function MiscProjectCard({ project }: MiscProjectCardProps) {
  const { ref, inView } = useInView({ threshold: 0.15 });
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
          { scale: 1.12, y: "-6%" },
          {
            scale: 1,
            y: "6%",
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

  return (
  <div ref={ref} className="bg-[#f3f3f3] py-16 px-6 md:px-16">
    
    {/* Title + Description */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mb-10"
    >
      <h2 className="text-black font-serif text-4xl md:text-6xl font-light mb-6">
        {project.title}
      </h2>

      {project.subtitle && (
        <p className="text-black/80 text-base md:text-lg leading-relaxed max-w-5xl">
          {project.subtitle}
        </p>
      )}
    </motion.div>

    {/* Large Image Section */}
    <motion.div
      ref={imgRef}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1 }}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "55vh" }}
    >
      <Image
        src={project.src}
        alt={project.title}
        fill
        sizes="100vw"
        className="object-cover"
        loading="lazy"
      />
    </motion.div>

  </div>
);
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
          {project.category} — {project.year}
        </p>
        <h2 className="font-serif text-black text-4xl md:text-6xl font-light leading-tight mb-4">
          {project.title}
        </h2>
        <p className="font-sans text-black/60 text-xs tracking-wide mb-6">{project.location}</p>
        <hr className="border-black/10 mb-6" />
        <p className="font-sans text-black/60 text-sm leading-relaxed mb-10 md:text-2xl">{project.description}</p>
        <Link
          href={`/projects/${project.id}`}
          className="nav-link font-sans text-black text-xs tracking-ultra uppercase inline-flex items-center gap-3 group w-fit"
        >
          View Project
          <span className="block w-8 h-px bg-black transition-all duration-500 group-hover:w-14" />
        </Link>
      </motion.div>

    </div>
  );
}

export default function ProjectShowcase({ allProjects = false }: { allProjects?: boolean }) {
  const { ref: titleRef, inView: titleInView } = useInView();
  const [allData, setAllData] = useState<Project[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, catRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/categories')
        ]);

        const projData = await projRes.json();
        const catData = await catRes.json();

        const safeProjData = Array.isArray(projData) ? projData : [];
        const safeCatData = Array.isArray(catData) ? catData : [];

        setAllData(safeProjData);
        setCategories([{ id: "all", name: "All" }, ...safeCatData]);

        let initial = safeProjData;
        if (!allProjects) {
          initial = safeProjData.filter((p: Project) => p.featured === true);
        }
        setProjects(initial);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [allProjects]);

  useEffect(() => {
    let filtered = allData;
    if (!allProjects) {
      filtered = filtered.filter((p: Project) => p.featured === true);
    }

    if (activeCategory !== "All") {
      filtered = filtered.filter((p: Project) => p.category === activeCategory);
    }

    setProjects(filtered);
  }, [activeCategory, allData, allProjects]);

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

      {/* Category Filter */}
      {allProjects && (
        <div className="px-8 md:px-16 py-8 flex flex-wrap gap-x-8 gap-y-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`font-sans text-[10px] tracking-ultra uppercase transition-all duration-300 relative py-2 ${activeCategory === cat.name ? "text-ivory" : "text-ash hover:text-ivory"
                }`}
            >
              {cat.name}
              {activeCategory === cat.name && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-px bg-ivory"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Projects */}
      <div className="divide-y divide-bone/10 min-h-[50vh]">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="font-sans text-ash text-xs tracking-ultra uppercase animate-pulse">Loading projects...</p>
          </div>
        ) : (
          projects.map((project, i) =>
            project.isMiscellaneous ? (
              <MiscProjectCard key={project.id} project={project} />
            ) : (
              <ProjectCard key={project.id} project={project} index={i} />
            )
          )
        )}
      </div>
    </section>
  );
}
