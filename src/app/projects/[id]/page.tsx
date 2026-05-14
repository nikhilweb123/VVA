"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/sections/Footer";
import PageLoader from "../../components/PageLoader";
import CustomCursor from "../../components/CustomCursor";
import ScrollProgressBar from "../../components/ScrollProgressBar";
import SmoothScrollProvider from "../../components/SmoothScrollProvider";

interface Project {
  id: string;
  title: string;
  location: string;
  category: string;
  year: string;
  src: string;
  description: string;
  subtitle?: string;
  isMiscellaneous?: boolean;
  client?: string;
  area?: string;
  challenge?: string;
  solution?: string;
  gallery?: string[];
}

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProject();
  }, [params.id]);

  if (loading) return <PageLoader />;
  if (!project) return <div>Project not found</div>;

  return (
    <SmoothScrollProvider>
      <PageLoader />
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar />

      <main className="min-h-screen">
        {project.isMiscellaneous ? (
          /* ── Miscellaneous project layout ── */
          <div className="bg-obsidian pt-28 pb-24">
            <div className="px-6 sm:px-10 md:px-16 lg:px-20 max-w-5xl">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-ivory text-4xl sm:text-5xl md:text-6xl font-light mb-5 leading-tight"
              >
                {project.title}
              </motion.h1>

              {/* Description — only if present */}
              {project.description && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="font-sans text-ash text-base sm:text-[17px] leading-relaxed mb-8 max-w-3xl"
                >
                  {project.description}
                </motion.p>
              )}
            </div>

            {/* Main image — full width of the viewport */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 sm:px-10 md:px-16 lg:px-20 max-w-5xl"
            >
              <img
                src={project.src}
                alt={project.title}
                className="w-full h-auto object-cover"
              />
            </motion.div>

            {/* Gallery — each image full-width stacked */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="px-6 sm:px-10 md:px-16 lg:px-20 max-w-5xl space-y-4 mt-4">
                {project.gallery.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="w-full overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`${project.title} ${idx + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Regular project layout ── */
          <div className="bg-obsidian pt-24">
            {/* Hero */}
            <section className="relative h-[80vh] w-full overflow-hidden">
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={project.src}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </motion.div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <span className="text-primary font-sans text-xs tracking-ultra uppercase mb-4 block">
                    {project.category} — {project.year}
                  </span>
                  <h1 className="text-ivory font-serif text-5xl md:text-8xl font-light mb-4">
                    {project.title}
                  </h1>
                  <p className="text-ivory/60 font-sans text-xl">{project.location}</p>
                </motion.div>
              </div>
            </section>

            {/* Content */}
            <section className="py-24 px-8 md:px-24 max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-16">
                <div className="lg:col-span-1 space-y-8">
                  <div>
                    <h3 className="text-ash font-sans text-[10px] tracking-ultra uppercase mb-2">Location</h3>
                    <p className="text-ivory font-sans">{project.location}</p>
                  </div>
                  {project.client && (
                    <div>
                      <h3 className="text-ash font-sans text-[10px] tracking-ultra uppercase mb-2">Client</h3>
                      <p className="text-ivory font-sans">{project.client}</p>
                    </div>
                  )}
                  {project.area && (
                    <div>
                      <h3 className="text-ash font-sans text-[10px] tracking-ultra uppercase mb-2">Area</h3>
                      <p className="text-ivory font-sans">{project.area}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-ash font-sans text-[10px] tracking-ultra uppercase mb-2">Category</h3>
                    <p className="text-ivory font-sans">{project.category}</p>
                  </div>
                  <div>
                    <h3 className="text-ash font-sans text-[10px] tracking-ultra uppercase mb-2">Year</h3>
                    <p className="text-ivory font-sans">{project.year}</p>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-ivory font-serif text-3xl mb-8">About the Project</h2>
                    <p className="text-ivory/70 font-sans text-lg leading-relaxed mb-16">
                      {project.description}
                    </p>

                    {(project.challenge || project.solution) && (
                      <div className="grid md:grid-cols-2 gap-12 mb-16">
                        {project.challenge && (
                          <div>
                            <h3 className="text-primary font-sans text-[10px] tracking-ultra uppercase mb-4">The Challenge</h3>
                            <p className="text-ivory/60 font-sans text-sm leading-relaxed">{project.challenge}</p>
                          </div>
                        )}
                        {project.solution && (
                          <div>
                            <h3 className="text-primary font-sans text-[10px] tracking-ultra uppercase mb-4">The Solution</h3>
                            <p className="text-ivory/60 font-sans text-sm leading-relaxed">{project.solution}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {project.gallery && project.gallery.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {project.gallery.map((img, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="aspect-square bg-ivory/5 overflow-hidden"
                          >
                            <img src={img} alt={`${project.title} - ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
