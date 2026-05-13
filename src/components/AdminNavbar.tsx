"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "text-ivory border-b border-ivory" : "text-ivory/60 hover:text-ivory";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-obsidian/80 backdrop-blur-md border-b border-ivory/10 px-8 py-6 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link href="/admin" className="font-serif text-2xl text-ivory tracking-wider">
          Admin
        </Link>
        <div className="flex gap-8 font-sans text-xs tracking-widest uppercase">
          <Link href="/admin/projects" className={`pb-1 transition-colors ${isActive("/admin/projects")}`}>
            Projects
          </Link>
          <Link href="/admin/categories" className={`pb-1 transition-colors ${isActive("/admin/categories")}`}>
            Categories
          </Link>
          <Link href="/admin/team" className={`pb-1 transition-colors ${isActive("/admin/team")}`}>
            Team
          </Link>
          <Link href="/admin/homepage" className={`pb-1 transition-colors ${isActive("/admin/homepage")}`}>
            Homepage
          </Link>
          <Link href="/admin/about" className={`pb-1 transition-colors ${isActive("/admin/about")}`}>
            About
          </Link>
          <Link href="/admin/contact" className={`pb-1 transition-colors ${isActive("/admin/contact")}`}>
            Contact
          </Link>
          <Link href="/admin/enquiries" className={`pb-1 transition-colors ${isActive("/admin/enquiries")}`}>
            Enquiries
          </Link>
          <Link href="/admin/site-settings" className={`pb-1 transition-colors ${isActive("/admin/site-settings")}`}>
            Site Settings
          </Link>
        </div>
      </div>
      {/* Logout button will be injected from layout.tsx or can be placed here if we prefer */}
    </nav>
  );
}
