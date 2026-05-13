"use client";

import { useEffect, useState, useRef } from "react";
import { Project } from "../../components/sections/ProjectShowcase";
import { motion, AnimatePresence, Reorder } from "framer-motion";

interface Category {
  id: string;
  name: string;
}

interface FullProject extends Project {
  subtitle?: string;
  isMiscellaneous?: boolean;
  order?: number;
  client?: string;
  area?: string;
  challenge?: string;
  solution?: string;
  gallery?: string[];
}

const emptyForm: Omit<FullProject, "id"> = {
  title: "",
  location: "",
  category: "",
  year: new Date().getFullYear().toString(),
  src: "",
  description: "",
  subtitle: "",
  featured: false,
  isMiscellaneous: false,
  client: "",
  area: "",
  challenge: "",
  solution: "",
  gallery: [],
};

type TabMode = "list" | "reorder";

export default function AdminProjects() {
  const [projects, setProjects] = useState<FullProject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<FullProject | null>(null);
  const [form, setForm] = useState<Omit<FullProject, "id">>(emptyForm);
  const [galleryInput, setGalleryInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [srcError, setSrcError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [tab, setTab] = useState<TabMode>("list");

  // Reorder state — separate lists for regular and miscellaneous
  const [regularOrder, setRegularOrder] = useState<FullProject[]>([]);
  const [miscOrder, setMiscOrder] = useState<FullProject[]>([]);
  const [reorderSaving, setReorderSaving] = useState(false);

  const srcDebounce = useRef<NodeJS.Timeout | null>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      const list: FullProject[] = Array.isArray(data) ? data : [];
      setProjects(list);
      setRegularOrder(list.filter(p => !p.isMiscellaneous));
      setMiscOrder(list.filter(p => p.isMiscellaneous));
    } catch {
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {}
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  // Sync reorder lists when switching to reorder tab
  const handleTabChange = (next: TabMode) => {
    if (next === "reorder") {
      setRegularOrder(projects.filter(p => !p.isMiscellaneous));
      setMiscOrder(projects.filter(p => p.isMiscellaneous));
    }
    setTab(next);
  };

  const handleSaveOrder = async () => {
    setReorderSaving(true);
    try {
      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: regularOrder.map(p => p.id),
          miscIds: miscOrder.map(p => p.id),
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Order saved");
      await fetchProjects();
    } catch {
      showToast("Failed to save order", "error");
    } finally {
      setReorderSaving(false);
    }
  };

  const openForm = (project?: FullProject) => {
    if (project) {
      setEditingProject(project);
      setForm({
        title: project.title,
        location: project.location,
        category: project.category,
        year: project.year,
        src: project.src,
        description: project.description,
        subtitle: project.subtitle ?? "",
        featured: project.featured ?? false,
        isMiscellaneous: project.isMiscellaneous ?? false,
        client: project.client ?? "",
        area: project.area ?? "",
        challenge: project.challenge ?? "",
        solution: project.solution ?? "",
        gallery: project.gallery ?? [],
      });
      setGalleryInput((project.gallery ?? []).join(", "));
    } else {
      setEditingProject(null);
      setForm(emptyForm);
      setGalleryInput("");
    }
    setSrcError(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setSrcError(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (name === "src") {
      setSrcError(false);
      if (srcDebounce.current) clearTimeout(srcDebounce.current);
      srcDebounce.current = setTimeout(() => {
        if (value) {
          const img = new Image();
          img.onload = () => setSrcError(false);
          img.onerror = () => setSrcError(true);
          img.src = value;
        }
      }, 600);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "vva-projects");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || "Cloudinary upload failed");
    }

    const data = await res.json();
    return data.secure_url as string;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSrcError(false);
    try {
      const url = await uploadFile(file);
      if (url) setForm(prev => ({ ...prev, src: url }));
    } catch (err: any) {
      showToast(err.message || "Image upload failed", "error");
    } finally {
      setUploading(false);
      if (mainImageInputRef.current) mainImageInputRef.current.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setGalleryUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      const validUrls = urls.filter(Boolean) as string[];
      setGalleryInput(prev => {
        const existing = prev.trim();
        return existing ? `${existing}, ${validUrls.join(", ")}` : validUrls.join(", ");
      });
    } catch (err: any) {
      showToast(err.message || "Gallery upload failed", "error");
    } finally {
      setGalleryUploading(false);
      if (galleryImageInputRef.current) galleryImageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.src) return;

    setSaving(true);
    const payload = {
      ...form,
      gallery: galleryInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      showToast(editingProject ? "Project updated" : "Project created");
      closeModal();
      fetchProjects();
    } catch {
      showToast("Failed to save project", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      showToast("Project deleted");
      fetchProjects();
    } catch {
      showToast("Failed to delete project", "error");
    }
  };

  const handleToggleFeatured = async (project: FullProject) => {
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, featured: !project.featured }),
      });
      fetchProjects();
    } catch {
      showToast("Failed to update project", "error");
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory py-20 px-6 md:px-12">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[100] px-6 py-3 text-xs font-sans tracking-ultra uppercase shadow-lg ${
              toast.type === "success" ? "bg-ivory text-obsidian" : "bg-red-600 text-white"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif text-5xl font-light mb-1">Project Manager</h1>
            <p className="font-sans text-ash text-xs tracking-ultra uppercase">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => openForm()}
            className="font-sans text-xs tracking-ultra uppercase border border-ivory px-6 py-3 hover:bg-ivory hover:text-obsidian transition-colors w-fit"
          >
            + Add New Project
          </button>
        </div>

        {/* Cloudinary setup banner */}
        {(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) && (
          <div className="mb-8 border border-yellow-500/30 bg-yellow-500/5 px-6 py-4">
            <p className="font-sans text-yellow-300 text-xs font-semibold tracking-wide mb-2">
              ⚠ Cloudinary not configured — direct upload is disabled
            </p>
            <ol className="font-sans text-ivory/60 text-[11px] tracking-wide space-y-1 list-decimal pl-4">
              <li>Create a free account at <span className="text-ivory">cloudinary.com</span></li>
              <li>Go to Settings → Upload → Add upload preset → set Signing Mode to <span className="text-ivory">Unsigned</span> → Save</li>
              <li>Add these two lines to your <span className="text-ivory">.env.local</span> file:</li>
            </ol>
            <pre className="mt-2 font-mono text-[11px] text-ivory/70 bg-white/5 px-4 py-3 rounded select-all">
{`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name`}
            </pre>
            <p className="font-sans text-ivory/40 text-[10px] tracking-wide mt-2">
              Then restart the dev server. Your cloud name is on the Cloudinary dashboard homepage.
            </p>
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-0 mb-8 border-b border-ivory/20">
          {(["list", "reorder"] as TabMode[]).map(t => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`font-sans text-[10px] tracking-ultra uppercase px-6 py-3 transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-ivory text-ivory"
                  : "border-transparent text-ash hover:text-ivory"
              }`}
            >
              {t === "list" ? "All Projects" : "Reorder"}
            </button>
          ))}
        </div>

        {/* ── LIST TAB ── */}
        {tab === "list" && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <p className="font-sans text-ash text-xs tracking-ultra uppercase animate-pulse">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="border border-dashed border-ivory/20 py-24 text-center">
                <p className="font-serif text-2xl text-ivory/40 mb-4">No projects yet</p>
                <p className="font-sans text-ash text-xs tracking-ultra uppercase mb-8">Add your first project to get started</p>
                <button
                  onClick={() => openForm()}
                  className="font-sans text-xs tracking-ultra uppercase border border-ivory px-8 py-3 hover:bg-ivory hover:text-obsidian transition-colors"
                >
                  + Add Project
                </button>
              </div>
            ) : (
              <div className="w-full overflow-x-auto border border-ivory/20">
                <table className="w-full text-left font-sans text-sm">
                  <thead className="border-b border-ivory/20">
                    <tr>
                      <th className="py-4 px-6 font-normal text-[10px] tracking-ultra uppercase text-ash w-28">Image</th>
                      <th className="py-4 px-6 font-normal text-[10px] tracking-ultra uppercase text-ash">Title</th>
                      <th className="py-4 px-6 font-normal text-[10px] tracking-ultra uppercase text-ash hidden md:table-cell">Category</th>
                      <th className="py-4 px-6 font-normal text-[10px] tracking-ultra uppercase text-ash hidden md:table-cell">Year</th>
                      <th className="py-4 px-6 font-normal text-[10px] tracking-ultra uppercase text-ash text-center">Featured</th>
                      <th className="py-4 px-6 font-normal text-[10px] tracking-ultra uppercase text-ash text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory/10">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          {p.src ? (
                            <img
                              src={p.src}
                              alt={p.title}
                              className="w-20 h-12 object-cover bg-ivory/10"
                              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-20 h-12 bg-ivory/10 flex items-center justify-center">
                              <span className="text-ivory/20 text-[10px]">No img</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-serif text-lg text-ivory">{p.title}</p>
                          <p className="text-ash text-[10px] tracking-wide mt-0.5 md:hidden">{p.category} · {p.year}</p>
                          {p.isMiscellaneous && (
                            <span className="inline-block mt-1 text-[9px] tracking-wider uppercase px-2 py-0.5 border border-ivory/20 text-ivory/40">Misc</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-ash hidden md:table-cell">{p.category}</td>
                        <td className="py-4 px-6 text-ash hidden md:table-cell">{p.year}</td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            title="Toggle featured on home page"
                            className={`px-4 py-1.5 text-[10px] uppercase tracking-wider transition-all ${
                              p.featured
                                ? "bg-ivory text-obsidian"
                                : "bg-transparent text-ivory/40 border border-ivory/20 hover:border-ivory/60"
                            }`}
                          >
                            {p.featured ? "Yes" : "No"}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => openForm(p)}
                            className="text-[10px] uppercase tracking-wider text-ivory hover:underline mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-[10px] uppercase tracking-wider text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── REORDER TAB ── */}
        {tab === "reorder" && (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <p className="font-sans text-ash text-[11px] tracking-ultra uppercase">
                Drag rows to reorder. Changes apply when you click Save Order.
              </p>
              <button
                onClick={handleSaveOrder}
                disabled={reorderSaving}
                className="font-sans text-xs tracking-ultra uppercase border border-ivory bg-ivory text-obsidian px-8 py-3 hover:bg-transparent hover:text-ivory transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {reorderSaving ? "Saving..." : "Save Order"}
              </button>
            </div>

            {/* Regular Projects */}
            <ReorderSection
              label="Projects"
              items={regularOrder}
              onReorder={setRegularOrder}
            />

            {/* Miscellaneous Projects */}
            <ReorderSection
              label="Miscellaneous Projects"
              items={miscOrder}
              onReorder={setMiscOrder}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-obsidian border border-ivory/20 w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-ivory/10 sticky top-0 bg-obsidian z-10">
                <h2 className="font-serif text-2xl font-light">
                  {editingProject ? "Edit Project" : "New Project"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-ivory/40 hover:text-ivory text-2xl leading-none transition-colors"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">

                {/* Basic Info */}
                <div>
                  <p className="font-sans text-[10px] tracking-ultra uppercase text-ivory/30 mb-4">Basic Information</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Title *">
                      <input
                        type="text" name="title" required
                        value={form.title} onChange={handleChange}
                        className={inputCls}
                        placeholder="e.g. The Glass House"
                      />
                    </Field>
                    <Field label="Location *">
                      <input
                        type="text" name="location" required
                        value={form.location} onChange={handleChange}
                        className={inputCls}
                        placeholder="e.g. Mumbai, India"
                      />
                    </Field>
                    <Field label="Category *">
                      <select
                        name="category" required
                        value={form.category} onChange={handleChange}
                        className={inputCls + " appearance-none"}
                      >
                        <option value="" className="bg-obsidian">Select category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.name} className="bg-obsidian">{c.name}</option>
                        ))}
                        {!categories.some(c => c.name.toLowerCase() === "miscellaneous") && (
                          <option value="Miscellaneous" className="bg-obsidian">Miscellaneous</option>
                        )}
                      </select>
                    </Field>
                    <Field label="Year *">
                      <input
                        type="text" name="year" required
                        value={form.year} onChange={handleChange}
                        className={inputCls}
                        placeholder="e.g. 2024"
                      />
                    </Field>
                    <Field label="Client">
                      <input
                        type="text" name="client"
                        value={form.client} onChange={handleChange}
                        className={inputCls}
                        placeholder="e.g. Tata Group"
                      />
                    </Field>
                    <Field label="Area">
                      <input
                        type="text" name="area"
                        value={form.area} onChange={handleChange}
                        className={inputCls}
                        placeholder="e.g. 3,200 sq ft"
                      />
                    </Field>
                  </div>
                </div>

                {/* Main Image */}
                <div>
                  <p className="font-sans text-[10px] tracking-ultra uppercase text-ivory/30 mb-4">Main Image</p>

                  <input
                    ref={mainImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleMainImageUpload}
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => mainImageInputRef.current?.click()}
                    className="mb-4 font-sans text-[10px] tracking-ultra uppercase border border-ivory/40 px-5 py-2.5 hover:border-ivory text-ivory/60 hover:text-ivory transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <><span className="animate-spin inline-block w-3 h-3 border border-ivory/40 border-t-ivory rounded-full" /> Uploading...</>
                    ) : (
                      "Upload from Device"
                    )}
                  </button>

                  <Field label="Or paste Image URL *">
                    <input
                      type="url" name="src" required
                      value={form.src} onChange={handleChange}
                      className={inputCls + (srcError ? " border-red-500" : "")}
                      placeholder="https://res.cloudinary.com/... or https://i.ibb.co/..."
                    />
                  </Field>
                  {srcError && (
                    <p className="text-red-400 text-[10px] font-sans tracking-wide mt-2">
                      ⚠ Could not load image from this URL. Check the link is public and direct.
                    </p>
                  )}
                  {!srcError && form.src && (
                    <div className="mt-4">
                      <p className="font-sans text-[10px] tracking-ultra uppercase text-ivory/30 mb-2">Preview</p>
                      <img
                        src={form.src}
                        alt="Preview"
                        className="w-full h-52 object-cover border border-ivory/20"
                        onError={() => setSrcError(true)}
                      />
                    </div>
                  )}
                  <p className="font-sans text-[10px] text-ivory/30 tracking-wide mt-3">
                    Max 5 MB · JPEG, PNG, WebP, GIF
                  </p>
                </div>

                {/* Description */}
                <div>
                  <p className="font-sans text-[10px] tracking-ultra uppercase text-ivory/30 mb-4">Description</p>
                  <div className="space-y-6">
                    <Field label="Project Description *">
                      <textarea
                        name="description" required rows={4}
                        value={form.description} onChange={handleChange}
                        className={inputCls + " resize-none"}
                        placeholder="Brief description shown on the projects page..."
                      />
                    </Field>
                    <Field label="Subtitle (shown on miscellaneous card)">
                      <input
                        type="text" name="subtitle"
                        value={form.subtitle} onChange={handleChange}
                        className={inputCls}
                        placeholder="e.g. Interior · 2024"
                      />
                    </Field>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <p className="font-sans text-[10px] tracking-ultra uppercase text-ivory/30 mb-4">Project Details (shown on project detail page)</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Challenge">
                      <textarea
                        name="challenge" rows={3}
                        value={form.challenge} onChange={handleChange}
                        className={inputCls + " resize-none"}
                        placeholder="What was the design challenge?"
                      />
                    </Field>
                    <Field label="Solution">
                      <textarea
                        name="solution" rows={3}
                        value={form.solution} onChange={handleChange}
                        className={inputCls + " resize-none"}
                        placeholder="How was it solved?"
                      />
                    </Field>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <p className="font-sans text-[10px] tracking-ultra uppercase text-ivory/30 mb-4">Gallery</p>

                  <input
                    ref={galleryImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                  <button
                    type="button"
                    disabled={galleryUploading}
                    onClick={() => galleryImageInputRef.current?.click()}
                    className="mb-4 font-sans text-[10px] tracking-ultra uppercase border border-ivory/40 px-5 py-2.5 hover:border-ivory text-ivory/60 hover:text-ivory transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {galleryUploading ? (
                      <><span className="animate-spin inline-block w-3 h-3 border border-ivory/40 border-t-ivory rounded-full" /> Uploading...</>
                    ) : (
                      "Upload Gallery Images"
                    )}
                  </button>

                  <Field label="Or paste Gallery Image URLs (comma separated)">
                    <textarea
                      rows={3}
                      value={galleryInput}
                      onChange={e => setGalleryInput(e.target.value)}
                      className={inputCls + " resize-none"}
                      placeholder="https://url1.jpg, https://url2.jpg, https://url3.jpg"
                    />
                  </Field>
                  <p className="font-sans text-[10px] text-ivory/30 tracking-wide mt-2">
                    Select multiple files at once · Max 5 MB each
                  </p>
                </div>

                {/* Featured + Miscellaneous */}
                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox" name="featured" id="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer accent-ivory"
                    />
                    <label htmlFor="featured" className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase cursor-pointer">
                      Show on home page (Featured)
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox" name="isMiscellaneous" id="isMiscellaneous"
                      checked={form.isMiscellaneous ?? false}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer accent-ivory"
                    />
                    <label htmlFor="isMiscellaneous" className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase cursor-pointer">
                      Display as miscellaneous (full-width image, title &amp; subtitle only)
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-ivory/10">
                  <button
                    type="button" onClick={closeModal}
                    className="font-sans text-xs tracking-ultra uppercase border border-ivory/30 px-6 py-3 hover:border-ivory text-ivory/60 hover:text-ivory transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !form.src}
                    className="font-sans text-xs tracking-ultra uppercase border border-ivory bg-ivory text-obsidian px-8 py-3 hover:bg-transparent hover:text-ivory transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReorderSection({
  label,
  items,
  onReorder,
}: {
  label: string;
  items: FullProject[];
  onReorder: (items: FullProject[]) => void;
}) {
  return (
    <div>
      <p className="font-sans text-[10px] tracking-ultra uppercase text-ivory/40 mb-4">
        {label} <span className="text-ivory/20">({items.length})</span>
      </p>

      {items.length === 0 ? (
        <div className="border border-dashed border-ivory/10 py-10 text-center">
          <p className="font-sans text-ivory/20 text-xs tracking-ultra uppercase">No projects in this group</p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={onReorder}
          className="space-y-2"
        >
          {items.map((p, index) => (
            <Reorder.Item
              key={p.id}
              value={p}
              className="flex items-center gap-4 border border-ivory/20 bg-obsidian px-4 py-3 cursor-grab active:cursor-grabbing hover:border-ivory/40 transition-colors select-none"
            >
              {/* Drag handle */}
              <span className="text-ivory/20 flex flex-col gap-[3px] flex-shrink-0">
                <span className="block w-4 h-px bg-current" />
                <span className="block w-4 h-px bg-current" />
                <span className="block w-4 h-px bg-current" />
              </span>

              {/* Position index */}
              <span className="font-sans text-[10px] tracking-ultra text-ivory/30 w-6 flex-shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Thumbnail */}
              {p.src ? (
                <img
                  src={p.src}
                  alt={p.title}
                  className="w-14 h-9 object-cover bg-ivory/10 flex-shrink-0"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="w-14 h-9 bg-ivory/10 flex-shrink-0" />
              )}

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="font-serif text-ivory text-base truncate">{p.title}</p>
                <p className="font-sans text-ash text-[10px] tracking-wide">{p.category} · {p.year}</p>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-shrink-0">
                {p.featured && (
                  <span className="font-sans text-[9px] tracking-wider uppercase px-2 py-0.5 bg-ivory/10 text-ivory/60">
                    Featured
                  </span>
                )}
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}

const inputCls = "bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none w-full transition-colors placeholder:text-ivory/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">{label}</label>
      {children}
    </div>
  );
}
