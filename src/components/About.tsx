import { useScrollReveal } from "@/hooks/useScrollReveal";

const About = () => {
  const { ref: ref1, isRevealed: r1 } = useScrollReveal();
  const { ref: ref2, isRevealed: r2 } = useScrollReveal();

  return (
    <section id="studio" className="section-padding py-32 md:py-48">
      <div className="max-w-5xl mx-auto">
        <div ref={ref1} className={`reveal-up ${r1 ? "revealed" : ""} mb-20`}>
          <span className="text-label text-muted-foreground mb-6 block">About the Studio</span>
          <h2 className="heading-serif text-4xl md:text-5xl lg:text-7xl text-foreground leading-tight">
            Enso symbolizes a moment when the mind is free to simply let the body & spirit create.
          </h2>
        </div>

        <div ref={ref2} className={`reveal-up ${r2 ? "revealed" : ""}`} style={{ transitionDelay: "0.2s" }}>
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <p className="text-body text-muted-foreground text-base md:text-lg">
              Enso Design is a consultancy firm transcending the boundaries between Architecture
              & Interior Design. We believe in creating spaces that inspire, transform, and
              connect with the human spirit.
            </p>
            <p className="text-body text-muted-foreground text-base md:text-lg">
              Our approach is rooted in context and culture, responding to each site's unique
              character while pushing the boundaries of contemporary design. Every project is
              an opportunity to create something extraordinary.
            </p>
          </div>

          <div className="mt-20 pt-12 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "50+", label: "Projects" },
                { number: "12", label: "Years" },
                { number: "8", label: "Awards" },
                { number: "15", label: "Team Members" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="heading-serif text-3xl md:text-4xl text-primary">{stat.number}</span>
                  <p className="text-label text-muted-foreground mt-2">{stat.label}</p>
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
