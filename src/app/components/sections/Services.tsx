"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "../../hooks/useInView";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  order?: number;
}

interface ServiceCategory {
  id: string;
  name: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: "1", title: "Master Planning", description: "Comprehensive master planning strategies that integrate community needs, ecological balance, and long-term urban viability.", category: "Architecture" },
  { id: "2", title: "Architectural Design", description: "Creating visionary, functional, and sustainable structures that redefine spatial experiences and respond harmoniously to their contexts.", category: "Architecture" },
  { id: "3", title: "Infrastructure Design Development", description: "End-to-end infrastructure design and development ensuring seamless integration of technical systems with architectural vision.", category: "Architecture" },
  { id: "4", title: "Landscape and Hardscape Design", description: "Designing outdoor environments that harmoniously blend soft landscaping with hardscape elements to create cohesive, liveable spaces.", category: "Urban Design" },
  { id: "5", title: "Urban Spaces and Master Planning", description: "Forward-looking urban design strategies that activate public spaces and shape thriving, connected communities.", category: "Urban Design" },
  { id: "6", title: "Workspace Interior", description: "Crafting productive and inspiring workplace environments that balance aesthetic elegance with intuitive flow and functional efficiency.", category: "Interior Design" },
  { id: "7", title: "Hospitality Interior", description: "Designing immersive hospitality spaces that create memorable guest experiences through thoughtful detailing and refined aesthetics.", category: "Interior Design" },
  { id: "8", title: "Retail & Public Space Interior", description: "Creating engaging retail and public interiors that draw people in, elevate brand presence, and encourage meaningful interaction.", category: "Interior Design" },
];

interface ServicesProps {
  isPage?: boolean;
  heading?: string;
  subheading?: string;
}

export default function Services({
  isPage = true,
  heading = "Elevating spaces through thoughtful design.",
  subheading = "Our Expertise",
}: ServicesProps) {
  const { ref: headerRef, inView: headerInView } = useInView();

  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [svcRes, catRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/service-categories"),
        ]);
        const svcData = await svcRes.json();
        const catData = await catRes.json();

        const services = Array.isArray(svcData) && svcData.length > 0 ? svcData : DEFAULT_SERVICES;
        const cats = Array.isArray(catData) ? catData : [];

        setAllServices(services);
        setCategories([{ id: "all", name: "All" }, ...cats]);
      } catch {
        setAllServices(DEFAULT_SERVICES);
        setCategories([{ id: "all", name: "All" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered =
    activeCategory === "All"
      ? allServices
      : allServices.filter(s => s.category === activeCategory);

  return (
    <section id="services" className={`bg-obsidian ${isPage ? "pt-40" : "pt-24"} pb-32 min-h-screen`}>
      {/* Section Header */}
      <div className="px-8 md:px-16 mb-16 max-w-5xl">
        <motion.p
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-sans text-ash text-[16px] tracking-ultra uppercase mb-6"
        >
          {subheading}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-ivory text-5xl md:text-7xl lg:text-8xl font-light leading-tight"
        >
          {heading}
        </motion.h1>
      </div>

      <hr className="hr-thin mx-8 md:mx-16 mb-0" />

      {/* Category Filter — same pattern as ProjectShowcase */}
      {categories.length > 1 && (
        <div className="px-8 md:px-16 py-8 flex flex-wrap gap-x-8 gap-y-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`font-sans text-[10px] tracking-ultra uppercase transition-all duration-300 relative py-2 ${
                activeCategory === cat.name ? "text-ivory" : "text-ash hover:text-ivory"
              }`}
            >
              {cat.name}
              {activeCategory === cat.name && (
                <motion.div
                  layoutId="activeSvcCategory"
                  className="absolute bottom-0 left-0 right-0 h-px bg-ivory"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Services List */}
      <div className="border-b hr-thin min-h-[30vh]">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="font-sans text-ash text-xs tracking-ultra uppercase animate-pulse">Loading services...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((service, index) => (
                <ServiceRow
                  key={service.id}
                  id={String(index + 1).padStart(2, "0")}
                  service={service}
                  index={index}
                />
              ))}
              {filtered.length === 0 && (
                <div className="px-8 md:px-16 py-24 text-center">
                  <p className="font-sans text-ash text-xs tracking-ultra uppercase">No services in this category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

function ServiceRow({ id, service }: { id: string; service: ServiceItem; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="group relative px-8 md:px-16 py-16 md:py-24 hover:bg-white/5 transition-colors duration-500 hr-thin border-t-0 border-r-0 border-l-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 relative z-10 items-center">
        {/* ID */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="col-span-2"
        >
          <span className="font-sans text-ash text-sm tracking-ultra uppercase">{id}</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="col-span-5 pr-8 md:pr-16"
        >
          <h2 className="font-serif text-ivory text-3xl md:text-4xl font-light group-hover:px-4 transition-all duration-500">
            {service.title}
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="col-span-5"
        >
          <p className="font-sans text-bone/70 text-sm md:text-base leading-relaxed font-light">
            {service.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
