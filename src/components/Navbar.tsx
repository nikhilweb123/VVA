import { useState, useEffect } from "react";
import { useScrollProgress } from "@/hooks/useScrollReveal";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[60]">
        <div
          className="h-full bg-primary origin-left transition-transform duration-100"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          scrolled ? "bg-background/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="section-padding flex items-center justify-between h-20 md:h-24">
          <a href="#" className="heading-serif text-2xl md:text-3xl text-foreground tracking-tight">
            Enso<span className="text-primary">.</span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {["Projects", "Studio", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-foreground">
                {item}
              </a>
            ))}
          </div>

          <button className="md:hidden text-foreground" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
