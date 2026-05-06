"use client";

import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const DEFAULTS = {
  ctaHeading: "Let's Build Something Exceptional.",
  ctaSubtext: "Let's Work Together",
  email: "connect@vvadesignstudio.in",
  phone: "+91 7042024600",
  address: "B-120 Ground Floor Level, Sector 43,\nFaridabad, Haryana — 121010. IN.",
  brandName: "VVA",
  tagline: "Design Studio",
  navColumns: [
    {
      heading: "Studio",
      links: [
        { label: "Projects", href: "/#projects" },
        { label: "About", href: "/#about" },
        { label: "Our Team", href: "/team" },
        { label: "Contact", href: "/#contact" },
      ],
    },
    {
      heading: "Services",
      links: [
        { label: "Master Planning", href: "/services" },
        { label: "Architectural Design", href: "/services" },
        { label: "Infrastructure Design", href: "/services" },
        { label: "Landscape Design", href: "/services" },
      ],
    },
  ],
  socialLinks: [
    { label: "Instagram", href: "https://www.instagram.com/vvarts.studio/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/vva-design-studio/" },
  ],
  copyright: "Architecture & Interiors — Faridabad, Haryana",
};

export default function Footer() {
  const { ref, inView } = useInView({ threshold: 0.15 });
  const siteSettings = useSiteSettings();
  const f = siteSettings?.footer ?? ({} as typeof DEFAULTS);

  const ctaHeading = f.ctaHeading || DEFAULTS.ctaHeading;
  const ctaSubtext = f.ctaSubtext || DEFAULTS.ctaSubtext;
  const email = f.email || DEFAULTS.email;
  const phone = f.phone || DEFAULTS.phone;
  const address = f.address || DEFAULTS.address;
  const brandName = f.brandName || DEFAULTS.brandName;
  const tagline = f.tagline || DEFAULTS.tagline;
  const navColumns = f.navColumns?.length ? f.navColumns : DEFAULTS.navColumns;
  const socialLinks = f.socialLinks?.length ? f.socialLinks : DEFAULTS.socialLinks;
  const copyright = f.copyright || DEFAULTS.copyright;

  return (
    <footer id="contact" ref={ref} className="bg-[#7f7f7f]">
      {/* CTA */}
      <div className="bg-[#D87441] px-8 md:px-16 py-24 md:py-20 border-b border-white/10">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-sans text-white/60 text-[16px] tracking-ultra uppercase mb-8"
        >
          {ctaSubtext}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-white text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-12 max-w-5xl"
        >
          {ctaHeading}
        </motion.h2>
        <motion.a
          href={`mailto:${email}`}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="nav-link font-sans text-white text-sm tracking-ultra uppercase inline-flex items-center gap-4 group"
        >
          Get in touch with us today.
          <span className="block w-10 h-px bg-white transition-all duration-500 group-hover:w-16" />
        </motion.a>
      </div>

      {/* Links grid */}
      <div className="px-8 md:px-16 py-16 grid grid-cols-2 md:grid-cols-4 gap-12 border-b border-white/10">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="col-span-2 md:col-span-1"
        >
          <p className="font-serif text-white text-2xl tracking-ultra font-light mb-4">
            {brandName}
          </p>
          <p className="font-sans text-white/60 text-xs leading-relaxed max-w-xs">
            {tagline}
            <br />
            {address.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
            <br />
            <br />
            M:{" "}
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="hover:text-white transition-colors duration-300"
            >
              {phone}
            </a>
            <br />
            <a
              href={`mailto:${email}`}
              className="hover:text-white transition-colors duration-300"
            >
              {email}
            </a>
          </p>
        </motion.div>

        {/* Dynamic nav columns */}
        {navColumns.map((col, ci) => (
          <motion.div
            key={col.heading}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 + ci * 0.1 }}
          >
            <p className="font-sans text-white/40 text-[14px] tracking-ultra uppercase mb-5">
              {col.heading}
            </p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="nav-link font-sans text-white/80 text-m hover:text-white transition-colors duration-300"
                  >
                    {link.label}
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
          <p className="font-sans text-white/40 text-[14px] tracking-ultra uppercase mb-5">
            Follow
          </p>
          <ul className="space-y-3">
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link font-sans text-white/80 text-m hover:text-white transition-colors duration-300"
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
        <p className="font-sans text-white/40 text-[14px] tracking-wider">
          © {new Date().getFullYear()} {brandName} Design Studio. All rights reserved.
        </p>
        <p className="font-sans text-white/40 text-[14px] tracking-wider">{copyright}</p>
      </div>
    </footer>
  );
}
