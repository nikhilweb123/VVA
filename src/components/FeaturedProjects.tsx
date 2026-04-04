import { useScrollReveal, useParallax } from "@/hooks/useScrollReveal";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const projects = [
  {
    image: project1,
    title: "Responding to Contexts\nand Culture",
    location: "Heritage Hotel, Agra",
    category: "Hospitality",
  },
  {
    image: project2,
    title: "Creating a Better World\nto Live, Work and Play",
    location: "Innovation Hub, Bangalore",
    category: "Commercial",
  },
  {
    image: project3,
    title: "Transcending the Boundaries\nBetween Nature & Design",
    location: "Mountain Retreat, Dharamshala",
    category: "Residential",
  },
  {
    image: project4,
    title: "Where Wellness Meets\nArchitectural Excellence",
    location: "Wellness Center, Noida",
    category: "Healthcare",
  },
];

const FeaturedProjects = () => {
  return (
    <section id="projects" className="py-24 md:py-40">
      <div className="section-padding mb-16 md:mb-24">
        <SectionHeader />
      </div>

      <div className="space-y-0">
        {projects.map((project, i) => (
          <ProjectCard key={i} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};

const SectionHeader = () => {
  const { ref, isRevealed } = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-up ${isRevealed ? "revealed" : ""}`}>
      <span className="text-label text-muted-foreground mb-4 block">Featured Work</span>
      <h2 className="heading-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
        Selected Projects
      </h2>
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const { ref, isRevealed } = useScrollReveal(0.1);
  const parallaxRef = useParallax(0.08);

  return (
    <div
      ref={ref}
      className={`relative h-[70vh] md:h-screen overflow-hidden cursor-pointer group reveal-scale ${
        isRevealed ? "revealed" : ""
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div ref={parallaxRef} className="absolute inset-[-10%] w-[120%] h-[120%]">
        <img
          src={project.image.src}
          alt={project.location}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
          width={1920}
          height={1200}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end section-padding pb-12 md:pb-20">
        <span className="text-label text-primary mb-3">{project.category}</span>
        <h3 className="heading-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground whitespace-pre-line mb-3">
          {project.title}
        </h3>
        <p className="text-body text-muted-foreground text-sm">{project.location}</p>
      </div>
    </div>
  );
};

export default FeaturedProjects;
