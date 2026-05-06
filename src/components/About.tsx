"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface TimelineEvent {
  year: string;
  event: string;
}

export interface AboutContent {
  pageTitle?: string;
  bannerImage?: string;
  description?: string;
  mission?: string;
  vision?: string;
  timeline?: TimelineEvent[];
  // Legacy fields
  title?: string;
  description1?: string;
  description2?: string;
  image?: string;
}

const DEFAULT_ABOUT: AboutContent = {
  pageTitle: "Designing spaces that blend creativity, functionality, and timeless appeal.",
  description1:
    "Headed by Mr. Vaibhav Vashisht, Architect, Registered under Council of Architecture (CoA), with Design & Execution experience of 18+ years, supported by a strong team of 6 Architects & Interior Designers.",
  description2:
    "Based in Faridabad NCR, executing projects PAN India across Residential — High-Rise & Low-Rise buildings, Industrial, Warehousing, Retail, Multiplexes & Hotels.",
  image: "",
};

interface AboutProps {
  about?: AboutContent;
}

const About = ({ about }: AboutProps) => {
  const { ref: ref1, isRevealed: r1 } = useScrollReveal();
  const { ref: ref2, isRevealed: r2 } = useScrollReveal();

  // Merge with defaults and handle both old and new field names
  const merged = { ...DEFAULT_ABOUT, ...about };

  // Split HTML description into two columns at the first block-level boundary
  function splitDescription(raw: string): [string, string] {
    if (!raw) return ['', ''];
    const isHtml = /<[a-z][\s\S]*>/i.test(raw);
    if (isHtml) {
      const match = raw.match(/^(<(?:p|div|ul|ol|h\d)[^>]*>[\s\S]*?<\/(?:p|div|ul|ol|h\d)>)([\s\S]*)$/i);
      if (match) return [match[1].trim(), match[2].trim()];
      return [raw, ''];
    }
    const lines = raw.split('\n');
    return [lines[0] || '', lines.slice(1).join('\n')];
  }

  const [desc1, desc2] = splitDescription(merged.description || merged.description1 || '');
  const isHtml = /<[a-z][\s\S]*>/i.test(merged.description || '');

  const content = {
    title: merged.pageTitle || merged.title || DEFAULT_ABOUT.pageTitle,
    description1: isHtml ? desc1 : (desc1 || merged.description1 || ''),
    description2: isHtml ? desc2 : (desc2 || merged.description2 || ''),
    isHtml,
    mission: merged.mission || '',
    vision: merged.vision || '',
    timeline: merged.timeline || [],
  };

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
            {content.title}
          </h2>
        </div>

        {/* Content */}
        <div
          ref={ref2}
          className={`reveal-up ${r2 ? "in-view" : ""}`}
          style={{ transitionDelay: "0.2s" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {content.isHtml ? (
              <>
                <div
                  className="font-sans text-white text-sm sm:text-base md:text-lg leading-relaxed [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_strong]:font-semibold [&_em]:italic [&_u]:underline"
                  dangerouslySetInnerHTML={{ __html: content.description1 }}
                />
                {content.description2 && (
                  <div
                    className="font-sans text-white text-sm sm:text-base md:text-lg leading-relaxed [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_strong]:font-semibold [&_em]:italic [&_u]:underline"
                    dangerouslySetInnerHTML={{ __html: content.description2 }}
                  />
                )}
              </>
            ) : (
              <>
                <p className="font-sans text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  {content.description1}
                </p>
                <p className="font-sans text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  {content.description2}
                </p>
              </>
            )}
          </div>

          {/* Mission & Vision */}
          {(content.mission || content.vision) && (
            <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-gray-300 grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.mission && (
                <div>
                  <h4 className="font-sans text-white text-sm font-semibold mb-2 tracking-wide uppercase">
                    Our Mission
                  </h4>
                  <p className="font-sans text-gray-200 text-sm sm:text-base leading-relaxed">
                    {content.mission}
                  </p>
                </div>
              )}
              {content.vision && (
                <div>
                  <h4 className="font-sans text-white text-sm font-semibold mb-2 tracking-wide uppercase">
                    Our Vision
                  </h4>
                  <p className="font-sans text-gray-200 text-sm sm:text-base leading-relaxed">
                    {content.vision}
                  </p>
                </div>
              )}
            </div>
          )}

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

          {/* Timeline */}
          {content.timeline && content.timeline.length > 0 && (
            <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-gray-300">
              <h3 className="font-sans text-white text-lg sm:text-xl font-semibold mb-8 tracking-wide uppercase">
                Our Journey
              </h3>
              <div className="space-y-6">
                {content.timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-6 md:gap-10">
                    <div className="flex-shrink-0">
                      <span className="inline-block px-4 py-2 bg-white/10 rounded font-sans text-white font-semibold text-sm md:text-base">
                        {item.year}
                      </span>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="font-sans text-gray-200 text-sm sm:text-base leading-relaxed">
                        {item.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
