"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ─── Types ─────────────────────────────────────────────── */
interface TimelineEvent {
  year: string;
  event: string;
}

interface AboutContent {
  id?: string;
  pageTitle: string;
  bannerImage: string;
  description: string;
  mission: string;
  vision: string;
  timeline: TimelineEvent[];
}

const EMPTY_FORM: AboutContent = {
  pageTitle: "",
  bannerImage: "",
  description: "",
  mission: "",
  vision: "",
  timeline: [],
};

/* ─── Rich Text Editor ───────────────────────────────────── */
const TOOLBAR_ACTIONS = [
  { cmd: "bold", label: "B", style: "font-bold" },
  { cmd: "italic", label: "I", style: "italic" },
  { cmd: "underline", label: "U", style: "underline" },
  { cmd: "insertUnorderedList", label: "•", style: "" },
  { cmd: "insertOrderedList", label: "1.", style: "" },
];

function RichTextEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  /* Sync incoming value → DOM (only when value differs from current HTML) */
  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      isSyncing.current = true;
      editorRef.current.innerHTML = value;
      isSyncing.current = false;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (isSyncing.current || !editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const execCmd = (cmd: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">{label}</span>
      <div className="border border-ivory/20 focus-within:border-ivory/50 transition-colors">
        {/* Toolbar */}
        <div className="flex gap-1 px-2 py-1.5 border-b border-ivory/10 bg-ivory/5">
          {TOOLBAR_ACTIONS.map(({ cmd, label: lbl, style }) => (
            <button
              key={cmd}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
              className={`${style} font-sans text-ivory/60 hover:text-ivory text-xs px-2 py-1 hover:bg-ivory/10 transition-colors`}
            >
              {lbl}
            </button>
          ))}
        </div>
        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="min-h-[120px] px-4 py-3 font-sans text-sm text-ivory placeholder-ivory/30 focus:outline-none prose-invert [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
        />
      </div>
      <p className="font-sans text-ivory/25 text-[10px]">
        Select text then click toolbar buttons to format. Use two paragraphs to populate both columns on the page.
      </p>
    </div>
  );
}

/* ─── Plain Text Input ───────────────────────────────────── */
function TextInput({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
}) {
  const cls =
    "w-full bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">{label}</span>
      {textarea ? (
        <textarea
          rows={4}
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
    </label>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function AdminAbout() {
  const [about, setAbout] = useState<AboutContent>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setAbout(data || EMPTY_FORM);
    } catch {
      showToast("Failed to load about content", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  /* image upload */
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setAbout((a) => ({ ...a, bannerImage: json.url }));
      showToast("Image uploaded successfully");
    } catch {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  /* timeline helpers */
  const updateTimeline = (i: number, k: keyof TimelineEvent, v: string) =>
    setAbout((a) => ({
      ...a,
      timeline: a.timeline.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)),
    }));

  const addTimeline = () =>
    setAbout((a) => ({ ...a, timeline: [...a.timeline, { year: new Date().getFullYear().toString(), event: "" }] }));

  const removeTimeline = (i: number) =>
    setAbout((a) => ({ ...a, timeline: a.timeline.filter((_, idx) => idx !== i) }));

  /* save */
  const save = async () => {
    if (!about.pageTitle) {
      showToast("Page Title is required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("About content updated successfully");
      await fetchAbout();
    } catch {
      showToast("Failed to save about content", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-serif text-ivory">About Page Content</h1>
        <button
          onClick={save}
          disabled={saving || loading}
          className="px-8 py-3 bg-ivory text-obsidian font-sans text-xs tracking-ultra uppercase hover:bg-ivory/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="font-sans text-ivory/40 text-sm">Loading…</p>
      ) : (
        <div className="border border-ivory/15 p-8 space-y-8">
          {/* Page Title */}
          <TextInput
            label="Page Title"
            value={about.pageTitle}
            onChange={(v) => setAbout((a) => ({ ...a, pageTitle: v }))}
            placeholder="e.g., Designing spaces that blend creativity..."
          />

          {/* Banner Image */}
          <div className="flex flex-col gap-1.5">
            <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">Banner Image</span>
            <div className="flex gap-3">
              <input
                value={about.bannerImage}
                onChange={(e) => setAbout((a) => ({ ...a, bannerImage: e.target.value }))}
                placeholder="Paste image URL or upload…"
                className="flex-1 bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2.5 border border-ivory/20 text-ivory/70 font-sans text-xs tracking-wider hover:bg-ivory/10 transition-colors whitespace-nowrap disabled:opacity-40"
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                  e.target.value = "";
                }}
              />
            </div>
            {about.bannerImage && (
              <div className="relative mt-4 h-40 w-full overflow-hidden rounded border border-ivory/20">
                <Image src={about.bannerImage} alt="Banner Preview" fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Description — rich text */}
          <RichTextEditor
            label="Description"
            value={about.description}
            onChange={(v) => setAbout((a) => ({ ...a, description: v }))}
          />

          {/* Mission & Vision */}
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Mission"
              value={about.mission}
              onChange={(v) => setAbout((a) => ({ ...a, mission: v }))}
              textarea
              placeholder="Our mission statement…"
            />
            <TextInput
              label="Vision"
              value={about.vision}
              onChange={(v) => setAbout((a) => ({ ...a, vision: v }))}
              textarea
              placeholder="Our vision statement…"
            />
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">Timeline Events</span>
              <button
                type="button"
                onClick={addTimeline}
                className="font-sans text-[10px] tracking-ultra uppercase text-ivory/40 border border-dashed border-ivory/20 px-4 py-2 hover:border-ivory/40 hover:text-ivory/60 transition-colors"
              >
                + Add Event
              </button>
            </div>
            <div className="space-y-4">
              {about.timeline.map((event, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-end p-4 border border-ivory/10 rounded">
                  <div className="col-span-3">
                    <label className="flex flex-col gap-1.5">
                      <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">Year</span>
                      <input
                        value={event.year}
                        onChange={(e) => updateTimeline(i, "year", e.target.value)}
                        placeholder="e.g., 2020"
                        className="w-full bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors"
                      />
                    </label>
                  </div>
                  <div className="col-span-8">
                    <label className="flex flex-col gap-1.5">
                      <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">Event</span>
                      <input
                        value={event.event}
                        onChange={(e) => updateTimeline(i, "event", e.target.value)}
                        placeholder="Describe the event…"
                        className="w-full bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors"
                      />
                    </label>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeTimeline(i)}
                      className="text-red-400/60 hover:text-red-400 transition-colors text-lg leading-none"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {about.timeline.length === 0 && (
                <p className="font-sans text-ivory/30 text-sm text-center py-4">No timeline events. Add one to get started.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
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
