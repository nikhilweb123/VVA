"use client";

import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView";
import { useState } from "react";

export interface ContactSettings {
  address?: string;
  phone?: string;
  email?: string;
  mapEmbedUrl?: string;
  recipientEmail?: string;
}

interface ContactFormProps {
  settings?: ContactSettings;
}

export default function ContactForm({ settings = {} }: ContactFormProps) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hasInfo = settings.address || settings.phone || settings.email;

  return (
    <section className="bg-obsidian py-24 md:py-32 px-8 md:px-16 lg:px-24">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Page heading */}
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

        <div className="grid md:grid-cols-5 gap-16 md:gap-24">
          {/* ── Left column: contact info + map ── */}
          {(hasInfo || settings.mapEmbedUrl) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="md:col-span-2 flex flex-col gap-10"
            >
              {hasInfo && (
                <div className="space-y-8">
                  {settings.address && (
                    <div>
                      <p className="font-sans text-ivory/40 text-[10px] tracking-ultra uppercase mb-2">Address</p>
                      <p className="font-sans text-ivory text-sm leading-relaxed whitespace-pre-line">
                        {settings.address}
                      </p>
                    </div>
                  )}
                  {settings.phone && (
                    <div>
                      <p className="font-sans text-ivory/40 text-[10px] tracking-ultra uppercase mb-2">Phone</p>
                      <a
                        href={`tel:${settings.phone.replace(/\s/g, "")}`}
                        className="font-sans text-ivory text-sm hover:text-ash transition-colors"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  )}
                  {settings.email && (
                    <div>
                      <p className="font-sans text-ivory/40 text-[10px] tracking-ultra uppercase mb-2">Email</p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="font-sans text-ivory text-sm hover:text-ash transition-colors"
                      >
                        {settings.email}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {settings.mapEmbedUrl && (
                <div className="w-full overflow-hidden border border-ivory/10" style={{ aspectRatio: "4/3" }}>
                  <iframe
                    src={settings.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "grayscale(1) invert(0.85) contrast(0.9)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location map"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* ── Right column: form ── */}
          <div className={hasInfo || settings.mapEmbedUrl ? "md:col-span-3" : "md:col-span-5 max-w-4xl"}>
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

                <div className="flex flex-col relative group">
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
        </div>
      </div>
    </section>
  );
}
