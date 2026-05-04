"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const About = () => {
  const { ref: ref1, isRevealed: r1 } = useScrollReveal();
  const { ref: ref2, isRevealed: r2 } = useScrollReveal();

  return (
    <section
      id="studio"
      className="section-padding py-16 sm:py-20 md:py-32 bg-[#686767] mt-16 sm:mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div
          ref={ref1}
          className={`reveal-up ${r1 ? "in-view" : ""} mb-12 md:mb-16`}
        >
          <span className="text-sm sm:text-base text-white mb-4 block tracking-wide uppercase">
            About Our Studio
          </span>

          <h2 className="font-sans text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white leading-snug md:leading-tight">
            Designing spaces that blend creativity, functionality, and timeless appeal.
          </h2>
        </div>

        {/* Content */}
        <div
          ref={ref2}
          className={`reveal-up ${r2 ? "in-view" : ""}`}
          style={{ transitionDelay: "0.2s" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

            <p className="font-sans text-white text-sm sm:text-base md:text-lg leading-relaxed">
              Headed by Mr. Vaibhav Vashisht, Architect, Registered under Council of
              Architecture (CoA), with Design &amp; Execution experience of 18+ years,
              supported by a strong team of 6 Architects &amp; Interior Designers.
            </p>

            <p className="font-sans text-white text-sm sm:text-base md:text-lg leading-relaxed">
              Based in Faridabad NCR, executing projects PAN India across Residential —
              High-Rise &amp; Low-Rise buildings, Industrial, Warehousing, Retail,
              Multiplexes &amp; Hotels.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-gray-300">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center md:text-left">

              {[
                { number: "18+", label: "Years of Experience" },
                { number: "6+", label: "Architects & Designers" },
                { number: "PAN India", label: "Project Reach" },
                { number: "6", label: "In-House Services" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="font-sans text-2xl sm:text-3xl md:text-4xl text-white font-semibold">
                    {stat.number}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 mt-1">
                    {stat.label}
                  </p>
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