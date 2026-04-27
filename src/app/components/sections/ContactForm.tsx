"use client";

import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import { useState } from "react";

export default function ContactForm() {
  const { ref, inView } = useInView({ threshold: 0.15 });
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 border border-ivory/20 bg-ivory/5 text-ivory font-sans rounded-sm"
          >
            <p className="text-xl mb-2">Thank you for your message.</p>
            <p className="text-ivory/60 text-sm">We will get back to you as soon as possible.</p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-6 text-xs tracking-ultra uppercase border-b border-ivory pb-1"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="space-y-12"
            onSubmit={handleSubmit}
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex flex-col relative group">
                <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-3 text-ivory font-sans text-lg outline-none transition-colors" 
                  required 
                />
              </div>
              <div className="flex flex-col relative group">
                <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-3 text-ivory font-sans text-lg outline-none transition-colors" 
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col relative group">
              <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Subject</label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-3 text-ivory font-sans text-lg outline-none transition-colors" 
              />
            </div>

            <div className="flex flex-col relative group flex-grow">
              <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Message</label>
              <textarea 
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-3 text-ivory font-sans text-lg outline-none transition-colors resize-none" 
                required 
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 font-sans text-sm">Failed to send message. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="font-sans text-ivory text-xs tracking-ultra uppercase inline-flex items-center gap-3 group w-fit mt-8 cursor-pointer bg-transparent border-none p-0 disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
              <span className="block w-12 h-[1px] bg-ivory transition-all duration-500 group-hover:w-20" />
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
