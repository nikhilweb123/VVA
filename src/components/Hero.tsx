import { useState, useEffect, useCallback } from "react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    title: "Designing to Make an Inspiring\n& Transformative Reality",
    subtitle: "Norbu Retreat, Dharamshala",
  },
  {
    image: hero2,
    title: "Making Physical & Emotional\nConnections Through Design",
    subtitle: "Azure Villa, Goa",
  },
  {
    image: hero3,
    title: "Creating Spaces That\nTranscend Boundaries",
    subtitle: "Art Pavilion, New Delhi",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 1200);
    },
    [animating]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [current, goTo]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1.5s] ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image.src}
            alt={slide.subtitle}
            className={`w-full h-full object-cover transition-transform duration-[8s] ease-out ${
              i === current ? "scale-105" : "scale-100"
            }`}
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-[hsl(var(--hero-overlay))]" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end section-padding pb-16 md:pb-24">
        <div
          key={current}
          className="animate-slide-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <h1 className="heading-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[hsl(var(--text-hero))] max-w-4xl whitespace-pre-line mb-4">
            {slides[current].title}
          </h1>
          <p className="text-label text-[hsl(var(--text-subtle))]">
            {slides[current].subtitle}
          </p>
        </div>

        {/* Navigation dots + arrows */}
        <div className="absolute bottom-8 right-6 md:right-12 lg:right-20 xl:right-28 flex items-center gap-6">
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i === current ? "bg-foreground w-6" : "bg-foreground/30"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo((current + 1) % slides.length)}
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-label text-[hsl(var(--text-subtle))] text-[10px]">Scroll</span>
        <div className="w-px h-8 relative overflow-hidden">
          <div className="w-full h-full bg-foreground/20" />
          <div className="absolute top-0 left-0 w-full h-3 bg-foreground/60 animate-scroll-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
