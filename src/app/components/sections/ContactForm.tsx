"use client";

import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";

export default function ContactForm() {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <section className="bg-obsidian py-24 md:py-32 px-8 md:px-16 lg:px-24">
      <div ref={ref} className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-sans text-ash text-[16px] tracking-ultra uppercase mb-6"
        >
          Inquiries
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-ivory text-5xl md:text-7xl font-light mb-16"
        >
          Get in Touch
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="space-y-12"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col relative group">
              <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Name</label>
              <input 
                type="text" 
                className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-3 text-ivory font-sans text-lg outline-none transition-colors" 
                required 
              />
            </div>
            <div className="flex flex-col relative group">
              <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Email</label>
              <input 
                type="email" 
                className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-3 text-ivory font-sans text-lg outline-none transition-colors" 
                required 
              />
            </div>
          </div>

          <div className="flex flex-col relative group">
            <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Subject</label>
            <input 
              type="text" 
              className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-3 text-ivory font-sans text-lg outline-none transition-colors" 
            />
          </div>

          <div className="flex flex-col relative group flex-grow">
            <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Message</label>
            <textarea 
              rows={4}
              className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-3 text-ivory font-sans text-lg outline-none transition-colors resize-none" 
              required 
            />
          </div>

          <button
            type="submit"
            className="font-sans text-ivory text-xs tracking-ultra uppercase inline-flex items-center gap-3 group w-fit mt-8 cursor-pointer bg-transparent border-none p-0"
          >
            Send Message
            <span className="block w-12 h-[1px] bg-ivory transition-all duration-500 group-hover:w-20" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
