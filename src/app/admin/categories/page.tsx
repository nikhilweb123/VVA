"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    });

    setNewCategoryName("");
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    // We need a DELETE endpoint for categories
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory py-20 px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-serif text-5xl font-light">Category Manager</h1>
          <form onSubmit={handleAddCategory} className="flex gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New Category Name"
              className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none"
              required
            />
            <button
              type="submit"
              className="nav-link font-sans text-xs tracking-ultra uppercase border border-ivory px-6 py-3 hover:bg-ivory hover:text-obsidian transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {loading ? (
          <p className="font-sans text-ash text-xs tracking-ultra uppercase animate-pulse">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(categories) && categories.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border border-ivory/20 bg-ivory/5 flex justify-between items-center group"
              >
                <span className="font-sans text-lg tracking-wide">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-ash hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
              </motion.div>
            ))}
            {(!Array.isArray(categories) || categories.length === 0) && (
              <p className="col-span-full text-center text-ash text-xs tracking-ultra uppercase py-8">No categories found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
