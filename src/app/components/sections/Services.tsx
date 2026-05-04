"use client";

import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";

const servicesList = [
  {
    id: "01",
    title: "Master Planning",
    description: "Comprehensive master planning strategies that integrate community needs, ecological balance, and long-term urban viability."
  },
  {
    id: "02",
    title: "Architectural Design",
    description: "Creating visionary, functional, and sustainable structures that redefine spatial experiences and respond harmoniously to their contexts."
  },
  {
    id: "03",
    title: "Infrastructure Design Development",
    description: "End-to-end infrastructure design and development ensuring seamless integration of technical systems with architectural vision."
  },
  {
    id: "04",
    title: "Landscape and Hardscape Design",
    description: "Designing outdoor environments that harmoniously blend soft landscaping with hardscape elements to create cohesive, liveable spaces."
  },
  {
    id: "05",
    title: "Urban Spaces and Master Planning",
    description: "Forward-looking urban design strategies that activate public spaces and shape thriving, connected communities."
  },
  {
    id: "06",
    title: "Workspace Interior",
    description: "Crafting productive and inspiring workplace environments that balance aesthetic elegance with intuitive flow and functional efficiency."
  },
  {
    id: "07",
    title: "Hospitality Interior",
    description: "Designing immersive hospitality spaces that create memorable guest experiences through thoughtful detailing and refined aesthetics."
  },
  {
    id: "08",
    title: "Retail & Public Space Interior",
    description: "Creating engaging retail and public interiors that draw people in, elevate brand presence, and encourage meaningful interaction."
  }
];

export default function Services({ isPage = true }: { isPage?: boolean }) {
  const { ref: headerRef, inView: headerInView } = useInView();

  return (
    <section id="services" className={`bg-obsidian ${isPage ? "pt-40" : "pt-24"} pb-32 min-h-screen`}>
      {/* Section Header */}
      <div className="px-8 md:px-16 mb-24 max-w-5xl">
        <motion.p
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-sans text-ash text-[16px] tracking-ultra uppercase mb-6"
        >
          Our Expertise
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-ivory text-5xl md:text-7xl lg:text-8xl font-light leading-tight"
        >
          Elevating spaces through thoughtful design.
        </motion.h1>
      </div>

      <hr className="hr-thin mx-8 md:mx-16 mb-0" />

      {/* Services List */}
      <div className="border-b hr-thin">
        {servicesList.map((service, index) => (
          <ServiceRow key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

function ServiceRow({ service, index }: { service: any; index: number }) {
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
          <span className="font-sans text-ash text-sm tracking-ultra uppercase">
            {service.id}
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="col-span-5"
        >
          <h2 className="font-serif text-ivory text-3xl md:text-5xl font-light group-hover:px-4 transition-all duration-500">
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
          <p className="font-sans text-bone/70 text-base md:text-xl leading-relaxed font-light">
            {service.description}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
