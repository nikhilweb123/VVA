"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Refresh the page to trigger the server component to re-check the cookie
        window.location.reload();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-obsidian border border-ivory/20 p-8 md:p-12 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-ivory font-light mb-2">VVA Admin</h1>
          <p className="font-sans text-xs tracking-ultra uppercase text-ash">Content Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-3 border border-red-500/50 bg-red-500/10 text-red-200 text-xs text-center font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col">
            <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none" 
            />
          </div>

          <div className="flex flex-col">
            <label className="font-sans text-ivory/60 text-[10px] tracking-ultra uppercase mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="bg-transparent border-b border-ivory/20 focus:border-ivory pb-2 text-ivory font-sans outline-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 font-sans text-xs tracking-ultra uppercase border border-ivory bg-ivory text-obsidian px-8 py-3 hover:bg-transparent hover:text-ivory transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
