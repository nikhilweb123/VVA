"use client";

import { useEffect, useRef } from "react";

export function useGSAPParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    let gsap: any;
    let scrollTrigger: any;
    let ctx: any;

    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap = gsapModule.gsap;
      scrollTrigger = ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { yPercent: -10 * speed * 10 },
          {
            yPercent: 10 * speed * 10,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, [speed]);

  return ref;
}
