"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const About = () => {
  const { ref: ref1, isRevealed: r1 } = useScrollReveal();
  const { ref: ref2, isRevealed: r2 } = useScrollReveal();

  return (
    <section id="studio" className="section-padding py-30 md:py-48 bg-[#686767] mt-30">
      <div className="max-w-7xl mx-auto">
        <div ref={ref1} className={`reveal-up ${r1 ? "in-view" : ""} mb-20`}>
          <span className="text-[16px] text-white mb-6 block">About the Studio</span>
          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            Creating timeless architecture that transforms everyday living and working environments.
          </h2>
        </div>

        <div ref={ref2} className={`reveal-up ${r2 ? "in-view" : ""}`} style={{ transitionDelay: "0.2s" }}>
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <p className="font-sans text-white text-base md:text-lg leading-relaxed">
              Established in 2024 in Faridabad, our firm is committed to delivering thoughtful and
              impactful architectural solutions. We specialize in residential, commercial, and public
              spaces, creating environments that respond to modern needs while maintaining timeless design values.
            </p>
            <p className="font-sans text-white text-base md:text-lg leading-relaxed">
              Every project is designed with a deep understanding of client aspirations, ensuring a
              balance between functionality, aesthetics, and long-term value. From concept to execution,
              we focus on creating cohesive spaces that enhance user experience across every scale.
            </p>
          </div>

          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "15+", label: "Projects" },
                { number: "2024", label: "Established" },
                { number: "5+", label: "Cities" },
                { number: "Multi", label: "Sectors" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="font-sans text-3xl md:text-4xl text-white">{stat.number}</span>
                  <p className="text-sm text-white mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
