"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="font-sans text-[10px] tracking-ultra uppercase text-ash hover:text-ivory transition-colors border border-ash/30 hover:border-ivory px-4 py-2"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
