"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactSettings {
  id?: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  recipientEmail: string;
}

const EMPTY: ContactSettings = {
  address: "",
  phone: "",
  email: "",
  mapEmbedUrl: "",
  recipientEmail: "",
};

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  const cls =
    "w-full bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls + " resize-y"}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
      {hint && <p className="font-sans text-ivory/25 text-[10px]">{hint}</p>}
    </label>
  );
}

export default function AdminContact() {
  const [settings, setSettings] = useState<ContactSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact-settings");
      const data = await res.json();
      setSettings({ ...EMPTY, ...data });
    } catch {
      showToast("Failed to load contact settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/contact-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("Contact settings saved");
      await fetchSettings();
    } catch {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-serif text-ivory">Contact Settings</h1>
        <button
          onClick={save}
          disabled={saving || loading}
          className="px-8 py-3 bg-ivory text-obsidian font-sans text-xs tracking-ultra uppercase hover:bg-ivory/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {loading ? (
        <p className="font-sans text-ivory/40 text-sm">Loading…</p>
      ) : (
        <div className="border border-ivory/15 p-8 space-y-8">
          {/* Contact details */}
          <div>
            <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase mb-6">Contact Details</p>
            <div className="space-y-6">
              <Field
                label="Address"
                value={settings.address}
                onChange={(v) => setSettings((s) => ({ ...s, address: v }))}
                textarea
                placeholder="e.g., 123 Studio Lane, Faridabad, Haryana 121001"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Phone"
                  value={settings.phone}
                  onChange={(v) => setSettings((s) => ({ ...s, phone: v }))}
                  placeholder="+91 98765 43210"
                  type="tel"
                />
                <Field
                  label="Email"
                  value={settings.email}
                  onChange={(v) => setSettings((s) => ({ ...s, email: v }))}
                  placeholder="studio@vvadesign.com"
                  type="email"
                />
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase mb-6">Map</p>
            <Field
              label="Google Maps Embed URL"
              value={settings.mapEmbedUrl}
              onChange={(v) => setSettings((s) => ({ ...s, mapEmbedUrl: v }))}
              placeholder="https://www.google.com/maps/embed?pb=..."
              hint="In Google Maps → Share → Embed a map → copy the src URL from the iframe code."
            />
            {settings.mapEmbedUrl && (
              <div className="mt-4 overflow-hidden border border-ivory/20" style={{ height: 200 }}>
                <iframe
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map preview"
                />
              </div>
            )}
          </div>

          {/* Notifications */}
          <div>
            <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase mb-6">Form Notifications</p>
            <Field
              label="Recipient Email"
              value={settings.recipientEmail}
              onChange={(v) => setSettings((s) => ({ ...s, recipientEmail: v }))}
              placeholder="owner@vvadesign.com"
              type="email"
              hint="Submissions will be forwarded here once an email provider (Resend / Nodemailer) is wired up."
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 px-6 py-4 font-sans text-sm z-50 ${
              toast.type === "success" ? "bg-ivory text-obsidian" : "bg-red-500 text-white"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
