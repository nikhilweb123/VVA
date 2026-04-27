"use client";

import { useEffect, useState } from "react";
import { Project } from "../../components/sections/ProjectShowcase";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleToggleFeatured = async (project: Project) => {
    const updatedProject = { ...project, featured: !project.featured };
    await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
    });
    fetchProjects();
  };

  const openForm = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setImagePreview(project.src);
    } else {
      setEditingProject(null);
      setImagePreview("");
    }
    setImageInputMode('url');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: any = Object.fromEntries(formData.entries());

    // Convert checkbox value to boolean
    payload.featured = formData.get('featured') === 'on';

    // Parse gallery string into array
    if (payload.gallery) {
      payload.gallery = payload.gallery.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "");
    }

    if (editingProject) {
      await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setIsModalOpen(false);
    setImagePreview("");
    fetchProjects();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setImagePreview(data.url);
        // We'll store this in a hidden input or state
        (e.target.form as HTMLFormElement)?.querySelector('input[name="src"]')?.setAttribute('value', data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory py-20 px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-serif text-5xl font-light">Project Manager</h1>
          <button
            onClick={() => openForm()}
            className="nav-link font-sans text-xs tracking-ultra uppercase border border-ivory px-6 py-3 hover:bg-ivory hover:text-obsidian transition-colors"
          >
            Add New Project
          </button>
        </div>

        {loading ? (
          <p className="font-sans text-ash text-xs tracking-ultra uppercase animate-pulse">Loading...</p>
        ) : (
          <div className="w-full overflow-x-auto border border-ivory/20">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-[#f2f2f2]">
                <tr>
                  <th className="py-4 px-6 font-normal text-xs tracking-ultra uppercase border-b border-ivory/20 text-ash w-32">Image</th>
                  <th className="py-4 px-6 font-normal text-xs tracking-ultra uppercase border-b border-ivory/20 text-ash">Title</th>
                  <th className="py-4 px-6 font-normal text-xs tracking-ultra uppercase border-b border-ivory/20 text-ash">Category</th>
                  <th className="py-4 px-6 font-normal text-xs tracking-ultra uppercase border-b border-ivory/20 text-ash">Year</th>
                  <th className="py-4 px-6 font-normal text-xs tracking-ultra uppercase border-b border-ivory/20 text-ash text-center">Main Page</th>
                  <th className="py-4 px-6 font-normal text-xs tracking-ultra uppercase border-b border-ivory/20 text-ash text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory/10">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-black/5 transition-colors">
                    <td className="py-4 px-6">
                      <img src={p.src} alt={p.title} className="w-20 h-12 object-cover" />
                    </td>
                    <td className="py-4 px-6 font-serif text-xl">{p.title}</td>
                    <td className="py-4 px-6 text-ash">{p.category}</td>
                    <td className="py-4 px-6 text-ash">{p.year}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`px-4 py-2 text-xs uppercase tracking-wider transition-all rounded ${p.featured
                          ? 'bg-ivory text-obsidian hover:bg-ivory/90'
                          : 'bg-obsidian text-ivory border border-ivory/40 hover:border-ivory'
                          }`}
                      >
                        {p.featured ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => openForm(p)} className="text-xs uppercase tracking-wider hover:underline mr-4">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs uppercase tracking-wider text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-ash text-xs tracking-ultra uppercase">No projects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory/50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-obsidian border border-ivory/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-3xl font-light">{editingProject ? "Edit Project" : "New Project"}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ivory text-xl transition-transform hover:scale-110"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Title</label>
                  <input type="text" name="title" defaultValue={editingProject?.title} required className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Location</label>
                  <input type="text" name="location" defaultValue={editingProject?.location} required className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Category</label>
                  <select
                    name="category"
                    defaultValue={editingProject?.category}
                    required
                    className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none appearance-none"
                  >
                    <option value="" className="bg-obsidian text-ivory">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name} className="bg-obsidian text-ivory">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Year</label>
                  <input type="text" name="year" defaultValue={editingProject?.year} required className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Client</label>
                  <input type="text" name="client" defaultValue={(editingProject as any)?.client} className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none" />
                </div>
                <div className="flex flex-col">
                  <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Area</label>
                  <input type="text" name="area" defaultValue={(editingProject as any)?.area} className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Challenge</label>
                  <textarea name="challenge" defaultValue={(editingProject as any)?.challenge} rows={3} className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none resize-none" />
                </div>
                <div className="flex flex-col">
                  <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Solution</label>
                  <textarea name="solution" defaultValue={(editingProject as any)?.solution} rows={3} className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none resize-none" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Image</label>

                {/* Toggle between URL and Upload */}
                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition-all ${imageInputMode === 'url'
                      ? 'bg-ivory text-obsidian'
                      : 'bg-transparent text-ivory border border-ivory/40'
                      }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition-all ${imageInputMode === 'upload'
                      ? 'bg-ivory text-obsidian'
                      : 'bg-transparent text-ivory border border-ivory/40'
                      }`}
                  >
                    Upload
                  </button>
                </div>

                {/* URL Input */}
                {imageInputMode === 'url' && (
                  <input
                    type="url"
                    name="src"
                    defaultValue={editingProject?.src}
                    required
                    onChange={(e) => setImagePreview(e.target.value)}
                    className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none"
                  />
                )}

                {/* File Upload */}
                {imageInputMode === 'upload' && (
                  <div className="space-y-4">
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                      />
                      <div className="border-2 border-dashed border-ivory/30 hover:border-ivory/60 transition-colors px-6 py-8 text-center">
                        {uploading ? (
                          <p className="font-sans text-ivory/60 text-xs tracking-ultra uppercase animate-pulse">Uploading...</p>
                        ) : (
                          <div>
                            <p className="font-sans text-ivory text-sm mb-2">Click to upload image</p>
                            <p className="font-sans text-ivory/40 text-[10px]">JPEG, PNG, WebP, GIF (Max 5MB)</p>
                          </div>
                        )}
                      </div>
                    </label>
                    <input type="hidden" name="src" value={imagePreview} />
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover border border-ivory/20"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Description</label>
                <textarea name="description" defaultValue={editingProject?.description} required rows={4} className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none resize-none" />
              </div>

              <div className="flex flex-col">
                <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Gallery Images (Comma separated URLs)</label>
                <textarea name="gallery" defaultValue={(editingProject as any)?.gallery?.join(', ')} rows={2} className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none resize-none" />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase">Show on Main Page</label>
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={editingProject?.featured || false}
                  className="w-5 h-5 cursor-pointer accent-ivory"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="font-sans text-xs tracking-ultra uppercase border border-ivory bg-ivory text-obsidian px-8 py-3 hover:bg-transparent hover:text-ivory transition-colors">
                  Save Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
