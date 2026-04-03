"use client";

import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";

const social = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn",  href: "#" },
  { label: "Behance",   href: "#" },
];

const navCols = [
  {
    heading: "Studio",
    links: ["Projects", "About", "Journal", "Contact"],
  },
  {
    heading: "Services",
    links: ["Architecture", "Interiors", "Masterplanning", "Consultancy"],
  },
];

export default function Footer() {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <footer id="contact" ref={ref} className="bg-obsidian border-t border-bone/10">
      {/* CTA */}
      <div className="px-8 md:px-16 py-24 md:py-32 border-b border-bone/10">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-sans text-ash text-[10px] tracking-ultra uppercase mb-8"
        >
          Let's Work Together
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-ivory text-5xl md:text-7xl lg:text-8xl font-light italic leading-tight mb-12 max-w-3xl"
        >
          Tell us about your project.
        </motion.h2>
        <motion.a
          href="mailto:studio@forma.in"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="nav-link font-sans text-ivory text-sm tracking-ultra uppercase inline-flex items-center gap-4 group"
        >
          studio@forma.in
          <span className="block w-10 h-px bg-ivory transition-all duration-500 group-hover:w-16" />
        </motion.a>
      </div>

      {/* Links grid */}
      <div className="px-8 md:px-16 py-16 grid grid-cols-2 md:grid-cols-4 gap-12 border-b border-bone/10">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="col-span-2 md:col-span-1"
        >
          <p className="font-serif text-ivory text-2xl tracking-ultra font-light mb-4">FORMA</p>
          <p className="font-sans text-ash text-xs leading-relaxed max-w-xs">
            Architecture &amp; Interiors<br />New Delhi, India
          </p>
        </motion.div>

        {navCols.map((col, ci) => (
          <motion.div
            key={col.heading}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 + ci * 0.1 }}
          >
            <p className="font-sans text-ash text-[10px] tracking-ultra uppercase mb-5">{col.heading}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="nav-link font-sans text-bone text-xs hover:text-ivory transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="font-sans text-ash text-[10px] tracking-ultra uppercase mb-5">Follow</p>
          <ul className="space-y-3">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="nav-link font-sans text-bone text-xs hover:text-ivory transition-colors duration-300"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 md:px-16 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <p className="font-sans text-ash text-[10px] tracking-wider">
          © {new Date().getFullYear()} FORMA Design Studio. All rights reserved.
        </p>
        <p className="font-sans text-ash text-[10px] tracking-wider">
          Architecture &amp; Interiors — New Delhi
        </p>
      </div>
    </footer>
  );
}
