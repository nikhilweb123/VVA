"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceCategory {
  id: string;
  name: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  order?: number;
}

const emptyForm = { title: "", description: "", category: "" };

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Category management
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [tab, setTab] = useState<"services" | "categories">("services");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [svcRes, catRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/service-categories"),
      ]);
      const svcData = await svcRes.json();
      const catData = await catRes.json();
      setServices(Array.isArray(svcData) ? svcData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openForm = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setForm({ title: service.title, description: service.description, category: service.category });
    } else {
      setEditingService(null);
      setForm(emptyForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingService ? `/api/services/${editingService.id}` : "/api/services";
      const method = editingService ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast(editingService ? "Service updated" : "Service created");
      closeModal();
      fetchAll();
    } catch {
      showToast("Failed to save service", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      showToast("Service deleted");
      fetchAll();
    } catch {
      showToast("Failed to delete service", "error");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const res = await fetch("/api/service-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (!res.ok) throw new Error();
      setNewCategoryName("");
      showToast("Category added");
      fetchAll();
    } catch {
      showToast("Failed to add category", "error");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Services in this category will not be deleted.")) return;
    try {
      await fetch(`/api/service-categories/${id}`, { method: "DELETE" });
      showToast("Category deleted");
      fetchAll();
    } catch {
      showToast("Failed to delete category", "error");
    }
  };

  // Group services by category for display
  const grouped = categories.reduce<Record<string, Service[]>>((acc, cat) => {
    acc[cat.name] = services.filter(s => s.category === cat.name);
    return acc;
  }, {});
  const uncategorised = services.filter(s => !categories.some(c => c.name === s.category));

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

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif text-5xl font-light mb-1">Service Manager</h1>
            <p className="font-sans text-ash text-xs tracking-ultra uppercase">
              {services.length} service{services.length !== 1 ? "s" : ""} · {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
            </p>
          </div>
          <button
            onClick={() => openForm()}
            className="font-sans text-xs tracking-ultra uppercase border border-ivory px-6 py-3 hover:bg-ivory hover:text-obsidian transition-colors w-fit"
          >
            + Add New Service
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 mb-10 border-b border-ivory/20">
          {(["services", "categories"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-sans text-[10px] tracking-ultra uppercase px-6 py-3 transition-colors border-b-2 -mb-px capitalize ${
                tab === t
                  ? "border-ivory text-ivory"
                  : "border-transparent text-ash hover:text-ivory"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── SERVICES TAB ── */}
        {tab === "services" && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <p className="font-sans text-ash text-xs tracking-ultra uppercase animate-pulse">Loading...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="border border-dashed border-ivory/20 py-24 text-center">
                <p className="font-serif text-2xl text-ivory/40 mb-4">No services yet</p>
                <p className="font-sans text-ash text-xs tracking-ultra uppercase mb-8">Add your first service to get started</p>
                <button
                  onClick={() => openForm()}
                  className="font-sans text-xs tracking-ultra uppercase border border-ivory px-8 py-3 hover:bg-ivory hover:text-obsidian transition-colors"
                >
                  + Add Service
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(grouped).map(([catName, items]) =>
                  items.length > 0 ? (
                    <CategoryBlock
                      key={catName}
                      label={catName}
                      items={items}
                      onEdit={openForm}
                      onDelete={handleDelete}
                    />
                  ) : null
                )}
                {uncategorised.length > 0 && (
                  <CategoryBlock
                    label="Uncategorised"
                    items={uncategorised}
                    onEdit={openForm}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* ── CATEGORIES TAB ── */}
        {tab === "categories" && (
          <div>
            <form onSubmit={handleAddCategory} className="flex gap-4 mb-10">
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="New Category Name"
                className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none flex-1"
                required
              />
              <button
                type="submit"
                disabled={addingCategory}
                className="font-sans text-xs tracking-ultra uppercase border border-ivory px-6 py-3 hover:bg-ivory hover:text-obsidian transition-colors disabled:opacity-40"
              >
                {addingCategory ? "Adding..." : "Add"}
              </button>
            </form>

            {loading ? (
              <p className="font-sans text-ash text-xs tracking-ultra uppercase animate-pulse">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border border-ivory/20 bg-ivory/5 flex justify-between items-center group"
                  >
                    <div>
                      <span className="font-sans text-lg tracking-wide">{cat.name}</span>
                      <p className="font-sans text-ash text-[10px] tracking-ultra uppercase mt-1">
                        {services.filter(s => s.category === cat.name).length} service{services.filter(s => s.category === cat.name).length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-ash hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 font-sans text-[10px] tracking-ultra uppercase"
                    >
                      Delete
                    </button>
                  </motion.div>
                ))}
                {categories.length === 0 && (
                  <p className="col-span-full text-center text-ash text-xs tracking-ultra uppercase py-8">No categories found.</p>
                )}
              </div>
            )}
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
              className="bg-obsidian border border-ivory/20 w-full max-w-xl shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-ivory/10">
                <h2 className="font-serif text-2xl font-light">
                  {editingService ? "Edit Service" : "New Service"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-ivory/40 hover:text-ivory text-2xl leading-none transition-colors"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                <Field label="Title *">
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="e.g. Master Planning"
                  />
                </Field>

                <Field label="Category *">
                  <select
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                    className={inputCls + " appearance-none"}
                  >
                    <option value="" className="bg-obsidian">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name} className="bg-obsidian">{c.name}</option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-yellow-400 text-[10px] font-sans tracking-wide mt-1">
                      No categories yet — add one in the Categories tab first.
                    </p>
                  )}
                </Field>

                <Field label="Description *">
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    className={inputCls + " resize-none"}
                    placeholder="Brief description of this service..."
                  />
                </Field>

                <div className="flex justify-end gap-4 pt-4 border-t border-ivory/10">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="font-sans text-xs tracking-ultra uppercase border border-ivory/30 px-6 py-3 hover:border-ivory text-ivory/60 hover:text-ivory transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="font-sans text-xs tracking-ultra uppercase border border-ivory bg-ivory text-obsidian px-8 py-3 hover:bg-transparent hover:text-ivory transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
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

function CategoryBlock({
  label,
  items,
  onEdit,
  onDelete,
}: {
  label: string;
  items: Service[];
  onEdit: (s: Service) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <p className="font-sans text-[10px] tracking-ultra uppercase text-ivory/40 mb-4">
        {label} <span className="text-ivory/20">({items.length})</span>
      </p>
      <div className="border border-ivory/20 divide-y divide-ivory/10">
        {items.map(s => (
          <div key={s.id} className="flex items-start gap-6 px-6 py-5 hover:bg-white/5 transition-colors group">
            <div className="flex-1 min-w-0">
              <p className="font-serif text-ivory text-xl mb-1">{s.title}</p>
              <p className="font-sans text-ash text-xs leading-relaxed line-clamp-2">{s.description}</p>
            </div>
            <div className="flex gap-4 flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(s)}
                className="font-sans text-[10px] tracking-ultra uppercase text-ivory hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(s.id)}
                className="font-sans text-[10px] tracking-ultra uppercase text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
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
