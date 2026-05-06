"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch("/api/enquiries");
        const data = await res.json();
        setEnquiries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch enquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-ivory/60 font-sans tracking-widest uppercase text-xs">Loading Enquiries...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-serif text-ivory mb-2">Enquiries</h1>
        <p className="text-ivory/60 font-sans text-sm">Messages received from the contact form</p>
      </header>

      {!Array.isArray(enquiries) || enquiries.length === 0 ? (
        <div className="p-12 border border-ivory/10 bg-ivory/5 text-center">
          <p className="text-ivory/60 font-sans">No enquiries found yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {enquiries?.map((enquiry) => (
            <motion.div
              key={enquiry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 border border-ivory/20 bg-ivory/5 group hover:border-ivory/40 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-serif text-ivory mb-1">{enquiry.subject || "No Subject"}</h2>
                  <div className="flex flex-wrap gap-4 text-xs font-sans tracking-widest uppercase">
                    <span className="text-primary">{enquiry.name}</span>
                    <span className="text-ivory/40">|</span>
                    <span className="text-ash">{enquiry.email}</span>
                  </div>
                </div>
                <div className="text-[10px] font-sans tracking-ultra uppercase text-ivory/40">
                  {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="bg-obsidian/50 p-6 rounded-sm border border-ivory/5">
                <p className="text-ivory/80 font-sans whitespace-pre-wrap leading-relaxed">
                  {enquiry.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
