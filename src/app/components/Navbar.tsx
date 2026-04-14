"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/#")) {
      const targetId = href.substring(1);
      if (pathname === "/") {
        const el = document.querySelector(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 2.2 }}
        className={`fixed top-0 left-0 right-0 z-50 px-8 md:px-16 py-6 flex items-center justify-between transition-all duration-700 ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-black/10" : "bg-transparent"
          }`}
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 font-serif text-black text-xl tracking-ultra font-light"
          onClick={(e) => {
            e.preventDefault();
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              router.push("/");
            }
          }}
        >
          <img
            src="/logo_transparent.png"
            alt="VVA Design Studio"
            className="h-[1.80rem] w-auto" /* Invert logo if it was white, or just ensure it looks good */
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="nav-link font-sans text-xs tracking-ultra text-black/60 hover:text-black transition-colors duration-300 uppercase"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
          <span className={`block w-6 h-px bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
        </button>

      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-white/98 flex flex-col items-center justify-center gap-12"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.1, duration: 0.6 }}
                onClick={() => handleNav(link.href)}
                className="font-serif text-black text-5xl font-light hover:text-black/60 transition-colors"
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>

        )}
      </AnimatePresence>
    </>
  );
}
