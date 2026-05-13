"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ─── Types ─────────────────────────────────────────────── */
interface SocialLink {
  platform: string;
  url: string;
}

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  image: string;
  description: string;
  socialLinks: SocialLink[];
  order: number;
}

const EMPTY_FORM: Omit<TeamMember, "id"> = {
  name: "",
  designation: "",
  image: "",
  description: "",
  socialLinks: [],
  order: 0,
};

const SOCIAL_PLATFORMS = ["LinkedIn", "Twitter", "Instagram", "Behance", "Dribbble", "Website"];

/* ─── Helpers ────────────────────────────────────────────── */
function Input({
  label,
  value,
  onChange,
  textarea,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
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
          rows={3}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls + " resize-y"}
        />
      ) : (
        <input
          type={type}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </label>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Omit<TeamMember, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load team members", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: members.length });
    setIsModalOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({
      name: m.name,
      designation: m.designation,
      image: m.image,
      description: m.description,
      socialLinks: m.socialLinks.map((s) => ({ ...s })),
      order: m.order,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  /* image upload */
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setForm((f) => ({ ...f, image: json.url }));
    } catch {
      showToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  /* social link helpers */
  const updateSocial = (i: number, k: keyof SocialLink, v: string) =>
    setForm((f) => ({
      ...f,
      socialLinks: f.socialLinks.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)),
    }));

  const addSocial = () =>
    setForm((f) => ({ ...f, socialLinks: [...f.socialLinks, { platform: "LinkedIn", url: "" }] }));

  const removeSocial = (i: number) =>
    setForm((f) => ({ ...f, socialLinks: f.socialLinks.filter((_, idx) => idx !== i) }));

  /* save */
  const save = async () => {
    if (!form.name || !form.designation || !form.image) {
      showToast("Name, Designation, and Image are required", "error");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/team/${editing.id}` : "/api/team";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast(editing ? "Member updated" : "Member added");
      closeModal();
      await fetchMembers();
    } catch {
      showToast("Failed to save member", "error");
    } finally {
      setSaving(false);
    }
  };

  /* delete */
  const deleteMember = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Member deleted");
      await fetchMembers();
    } catch {
      showToast("Failed to delete member", "error");
    } finally {
      setDeleting(null);
    }
  };

  /* reorder — move up / down */
  const move = async (id: string, direction: "up" | "down") => {
    const idx = members.findIndex((m) => m.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === members.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const a = members[idx];
    const b = members[swapIdx];

    // Swap order values and persist both
    await Promise.all([
      fetch(`/api/team/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, order: b.order }),
      }),
      fetch(`/api/team/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...b, order: a.order }),
      }),
    ]);
    await fetchMembers();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-serif text-ivory">Team Members</h1>
        <button
          onClick={openAdd}
          className="px-8 py-3 bg-ivory text-obsidian font-sans text-xs tracking-ultra uppercase hover:bg-ivory/90 transition-colors"
        >
          + Add Member
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="font-sans text-ivory/40 text-sm">Loading…</p>
      ) : members.length === 0 ? (
        <div className="border border-dashed border-ivory/20 p-16 text-center">
          <p className="font-sans text-ivory/40 text-sm mb-4">No team members yet.</p>
          <button
            onClick={openAdd}
            className="font-sans text-ivory/60 text-xs tracking-ultra uppercase border border-ivory/20 px-6 py-3 hover:bg-ivory/10 transition-colors"
          >
            Add your first member
          </button>
        </div>
      ) : (
        <div className="border border-ivory/15">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-ivory/10 bg-ivory/5">
            <span className="col-span-1 font-sans text-ivory/40 text-[10px] tracking-ultra uppercase">Order</span>
            <span className="col-span-2 font-sans text-ivory/40 text-[10px] tracking-ultra uppercase">Photo</span>
            <span className="col-span-3 font-sans text-ivory/40 text-[10px] tracking-ultra uppercase">Name</span>
            <span className="col-span-3 font-sans text-ivory/40 text-[10px] tracking-ultra uppercase">Designation</span>
            <span className="col-span-3 font-sans text-ivory/40 text-[10px] tracking-ultra uppercase text-right">Actions</span>
          </div>

          {members.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-ivory/10 last:border-b-0 items-center hover:bg-ivory/5 transition-colors"
            >
              {/* Order controls */}
              <div className="col-span-1 flex flex-col gap-1">
                <button
                  onClick={() => move(member.id, "up")}
                  className="text-ivory/40 hover:text-ivory text-xs transition-colors leading-none"
                  title="Move up"
                >
                  ↑
                </button>
                <span className="font-sans text-ivory/30 text-[10px] text-center">{member.order}</span>
                <button
                  onClick={() => move(member.id, "down")}
                  className="text-ivory/40 hover:text-ivory text-xs transition-colors leading-none"
                  title="Move down"
                >
                  ↓
                </button>
              </div>

              {/* Photo */}
              <div className="col-span-2">
                {member.image ? (
                  <div className="relative w-14 h-14 overflow-hidden grayscale">
                    <Image src={member.image} alt={member.name} fill sizes="56px" className="object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-ivory/10 flex items-center justify-center">
                    <span className="font-serif text-ivory/40 text-xl">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="col-span-3">
                <p className="font-serif text-ivory text-lg font-light">{member.name}</p>
                {member.socialLinks.length > 0 && (
                  <p className="font-sans text-ivory/30 text-[10px] mt-1">
                    {member.socialLinks.map((s) => s.platform).join(" · ")}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div className="col-span-3">
                <p className="font-sans text-ivory/60 text-sm">{member.designation}</p>
              </div>

              {/* Actions */}
              <div className="col-span-3 flex items-center justify-end gap-4">
                <button
                  onClick={() => openEdit(member)}
                  className="font-sans text-[10px] tracking-ultra uppercase text-ivory/50 hover:text-ivory transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  disabled={deleting === member.id}
                  className="font-sans text-[10px] tracking-ultra uppercase text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-40"
                >
                  {deleting === member.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-obsidian/80 backdrop-blur-sm overflow-y-auto py-12 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl .bg-obsidian border border-ivory p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-ivory text-2xl font-light">
                  {editing ? "Edit Member" : "Add Member"}
                </h2>
                <button onClick={closeModal} className="text-ivory/40 hover:text-ivory text-xl transition-colors">
                  ×
                </button>
              </div>

              <div className="space-y-5">
                {/* Image */}
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">Profile Image</span>
                  <div className="flex gap-3">
                    <input
                      value={form.image}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
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
                  {form.image && (
                    <div className="relative mt-2 h-32 w-24 overflow-hidden grayscale">
                      <Image src={form.image} alt="Preview" fill sizes="96px" className="object-cover" />
                    </div>
                  )}
                </div>

                {/* Name & Designation */}
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="e.g. Vikram Varma" />
                  <Input label="Designation *" value={form.designation} onChange={(v) => setForm((f) => ({ ...f, designation: v }))} placeholder="e.g. Principal Architect" />
                </div>

                {/* Description */}
                <Input
                  label="Description (optional)"
                  value={form.description}
                  onChange={(v) => setForm((f) => ({ ...f, description: v }))}
                  textarea
                  placeholder="Brief bio…"
                />

                {/* Sort Order */}
                <Input
                  label="Sort Order"
                  value={form.order}
                  onChange={(v) => setForm((f) => ({ ...f, order: parseInt(v) || 0 }))}
                  type="number"
                  placeholder="0"
                />

                {/* Social Links */}
                <div>
                  <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase block mb-3">
                    Social Links
                  </span>
                  <div className="space-y-3">
                    {form.socialLinks.map((link, i) => (
                      <div key={i} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-4">
                          <select
                            value={link.platform}
                            onChange={(e) => updateSocial(i, "platform", e.target.value)}
                            className="w-full bg-ivory/5 border border-ivory/20 text-ivory font-sans text-sm px-3 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors"
                          >
                            {SOCIAL_PLATFORMS.map((p) => (
                              <option key={p} value={p} className="bg-obsidian">
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-7">
                          <input
                            value={link.url}
                            onChange={(e) => updateSocial(i, "url", e.target.value)}
                            placeholder="https://…"
                            className="w-full bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeSocial(i)}
                            className="text-red-400/60 hover:text-red-400 transition-colors text-lg leading-none"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSocial}
                      className="font-sans text-[10px] tracking-ultra uppercase text-ivory/40 border border-dashed border-ivory/20 px-4 py-2 hover:border-ivory/40 hover:text-ivory/60 transition-colors"
                    >
                      + Add Social Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-8 border-t border-ivory/10">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 font-sans text-xs tracking-ultra uppercase text-ivory/50 hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-8 py-2.5 bg-ivory text-obsidian font-sans text-xs tracking-ultra uppercase hover:bg-ivory/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : editing ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
