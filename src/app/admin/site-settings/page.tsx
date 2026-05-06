"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ─── Types ─────────────────────────────────────────── */
interface NavItem { label: string; href: string }
interface NavColumn { heading: string; links: NavItem[] }

interface SiteSettings {
  id?: string;
  navbar: { logoUrl: string; logoAlt: string; navItems: NavItem[] };
  footer: {
    ctaHeading: string; ctaSubtext: string;
    email: string; phone: string; address: string;
    brandName: string; tagline: string;
    navColumns: NavColumn[]; socialLinks: NavItem[]; copyright: string;
  };
  seo: { metaTitle: string; metaDescription: string; ogImage: string };
}

const EMPTY: SiteSettings = {
  navbar: { logoUrl: "", logoAlt: "", navItems: [] },
  footer: {
    ctaHeading: "", ctaSubtext: "",
    email: "", phone: "", address: "",
    brandName: "", tagline: "",
    navColumns: [], socialLinks: [], copyright: "",
  },
  seo: { metaTitle: "", metaDescription: "", ogImage: "" },
};

type Tab = "navbar" | "footer" | "seo";

/* ─── Small helpers ──────────────────────────────────── */
function Field({
  label, value, onChange, textarea, placeholder, type = "text", hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; placeholder?: string; type?: string; hint?: string;
}) {
  const cls = "w-full bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">{label}</span>
      {textarea
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls + " resize-y"} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
      {hint && <p className="font-sans text-ivory/25 text-[10px]">{hint}</p>}
    </label>
  );
}

function ItemList({
  items, onChange, labelPlaceholder = "Label", hrefPlaceholder = "URL",
}: {
  items: NavItem[];
  onChange: (items: NavItem[]) => void;
  labelPlaceholder?: string;
  hrefPlaceholder?: string;
}) {
  const update = (i: number, k: keyof NavItem, v: string) =>
    onChange(items.map((it, idx) => idx === i ? { ...it, [k]: v } : it));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { label: "", href: "" }]);

  const inputCls = "bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-3 py-2 focus:outline-none focus:border-ivory/50 transition-colors";

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <div className="flex flex-col gap-1">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-ivory/30 hover:text-ivory disabled:opacity-20 text-xs leading-none">▲</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-ivory/30 hover:text-ivory disabled:opacity-20 text-xs leading-none">▼</button>
          </div>
          <input value={item.label} onChange={e => update(i, "label", e.target.value)} placeholder={labelPlaceholder} className={inputCls + " flex-1"} />
          <input value={item.href} onChange={e => update(i, "href", e.target.value)} placeholder={hrefPlaceholder} className={inputCls + " flex-[2]"} />
          <button type="button" onClick={() => remove(i)} className="text-red-400/60 hover:text-red-400 transition-colors text-lg leading-none px-1">×</button>
        </div>
      ))}
      <button type="button" onClick={add} className="font-sans text-[10px] tracking-ultra uppercase text-ivory/40 border border-dashed border-ivory/20 px-4 py-1.5 hover:border-ivory/40 hover:text-ivory/60 transition-colors">
        + Add
      </button>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "og" | null>(null);
  const [tab, setTab] = useState<Tab>("navbar");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const ogRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetch$ = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/site-settings");
      const data = await res.json();
      setSettings({ ...EMPTY, ...data, navbar: { ...EMPTY.navbar, ...data.navbar }, footer: { ...EMPTY.footer, ...data.footer }, seo: { ...EMPTY.seo, ...data.seo } });
    } catch {
      showToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch$(); }, []);

  const upload = async (file: File, field: "logo" | "og") => {
    setUploading(field);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      if (field === "logo") setSettings(s => ({ ...s, navbar: { ...s.navbar, logoUrl: json.url } }));
      else setSettings(s => ({ ...s, seo: { ...s.seo, ogImage: json.url } }));
      showToast("Image uploaded");
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...settings };
      if (body.id) delete body.id;
      const res = await fetch("/api/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      showToast("Settings saved");
      await fetch$();
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  /* helpers for nested updates */
  const setNavbar = (patch: Partial<SiteSettings["navbar"]>) =>
    setSettings(s => ({ ...s, navbar: { ...s.navbar, ...patch } }));
  const setFooter = (patch: Partial<SiteSettings["footer"]>) =>
    setSettings(s => ({ ...s, footer: { ...s.footer, ...patch } }));
  const setSeo = (patch: Partial<SiteSettings["seo"]>) =>
    setSettings(s => ({ ...s, seo: { ...s.seo, ...patch } }));

  const updateColumn = (ci: number, patch: Partial<NavColumn>) =>
    setFooter({ navColumns: settings.footer.navColumns.map((c, i) => i === ci ? { ...c, ...patch } : c) });
  const addColumn = () =>
    setFooter({ navColumns: [...settings.footer.navColumns, { heading: "", links: [] }] });
  const removeColumn = (ci: number) =>
    setFooter({ navColumns: settings.footer.navColumns.filter((_, i) => i !== ci) });

  const TABS: { key: Tab; label: string }[] = [
    { key: "navbar", label: "Navbar" },
    { key: "footer", label: "Footer" },
    { key: "seo", label: "SEO" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-serif text-ivory">Site Settings</h1>
        <button onClick={save} disabled={saving || loading} className="px-8 py-3 bg-ivory text-obsidian font-sans text-xs tracking-ultra uppercase hover:bg-ivory/90 transition-colors disabled:opacity-50">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-ivory/15">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`font-sans text-xs tracking-ultra uppercase px-6 py-3 transition-colors ${tab === t.key ? "text-ivory border-b border-ivory -mb-px" : "text-ivory/40 hover:text-ivory/70"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-sans text-ivory/40 text-sm">Loading…</p>
      ) : (
        <div className="border border-ivory/15 p-8">

          {/* ── NAVBAR ── */}
          {tab === "navbar" && (
            <div className="space-y-8">
              {/* Logo */}
              <div>
                <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase mb-4">Logo</p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input value={settings.navbar.logoUrl} onChange={e => setNavbar({ logoUrl: e.target.value })} placeholder="/logo_transparent.png or paste URL…" className="flex-1 bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors" />
                    <button type="button" onClick={() => logoRef.current?.click()} disabled={uploading === "logo"} className="px-4 py-2.5 border border-ivory/20 text-ivory/70 font-sans text-xs tracking-wider hover:bg-ivory/10 transition-colors whitespace-nowrap disabled:opacity-40">
                      {uploading === "logo" ? "Uploading…" : "Upload"}
                    </button>
                    <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f, "logo"); e.target.value = ""; }} />
                  </div>
                  {settings.navbar.logoUrl && (
                    <div className="h-12 w-auto bg-white/10 inline-flex items-center px-4 rounded border border-ivory/20">
                      <img src={settings.navbar.logoUrl} alt="Logo preview" className="h-8 w-auto object-contain" />
                    </div>
                  )}
                  <Field label="Logo Alt Text" value={settings.navbar.logoAlt} onChange={v => setNavbar({ logoAlt: v })} placeholder="VVA Design Studio" />
                </div>
              </div>

              {/* Nav Items */}
              <div>
                <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase mb-4">Navigation Items</p>
                <ItemList items={settings.navbar.navItems} onChange={items => setNavbar({ navItems: items })} labelPlaceholder="Label (e.g. About)" hrefPlaceholder="Path (e.g. /about)" />
              </div>
            </div>
          )}

          {/* ── FOOTER ── */}
          {tab === "footer" && (
            <div className="space-y-10">
              {/* CTA */}
              <div>
                <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase mb-4">CTA Banner</p>
                <div className="space-y-4">
                  <Field label="Heading" value={settings.footer.ctaHeading} onChange={v => setFooter({ ctaHeading: v })} placeholder="Let's Build Something Exceptional." />
                  <Field label="Subtext" value={settings.footer.ctaSubtext} onChange={v => setFooter({ ctaSubtext: v })} placeholder="Let's Work Together" />
                </div>
              </div>

              {/* Brand */}
              <div>
                <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase mb-4">Brand</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Brand Name" value={settings.footer.brandName} onChange={v => setFooter({ brandName: v })} placeholder="VVA" />
                  <Field label="Tagline" value={settings.footer.tagline} onChange={v => setFooter({ tagline: v })} placeholder="Design Studio" />
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase mb-4">Contact Info</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Email" value={settings.footer.email} onChange={v => setFooter({ email: v })} type="email" placeholder="connect@studio.in" />
                    <Field label="Phone" value={settings.footer.phone} onChange={v => setFooter({ phone: v })} type="tel" placeholder="+91 70420 24600" />
                  </div>
                  <Field label="Address" value={settings.footer.address} onChange={v => setFooter({ address: v })} textarea placeholder="Street, City — Pincode" />
                </div>
              </div>

              {/* Nav Columns */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase">Footer Link Columns</p>
                  <button type="button" onClick={addColumn} className="font-sans text-[10px] tracking-ultra uppercase text-ivory/40 border border-dashed border-ivory/20 px-4 py-1.5 hover:border-ivory/40 hover:text-ivory/60 transition-colors">
                    + Add Column
                  </button>
                </div>
                <div className="space-y-6">
                  {settings.footer.navColumns.map((col, ci) => (
                    <div key={ci} className="border border-ivory/10 p-5 space-y-4">
                      <div className="flex gap-3 items-center">
                        <input value={col.heading} onChange={e => updateColumn(ci, { heading: e.target.value })} placeholder="Column heading (e.g. Studio)" className="flex-1 bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors" />
                        <button type="button" onClick={() => removeColumn(ci)} className="text-red-400/60 hover:text-red-400 text-lg leading-none px-2">×</button>
                      </div>
                      <ItemList items={col.links} onChange={links => updateColumn(ci, { links })} labelPlaceholder="Link label" hrefPlaceholder="/path" />
                    </div>
                  ))}
                  {settings.footer.navColumns.length === 0 && (
                    <p className="font-sans text-ivory/25 text-sm text-center py-4">No columns yet. Add one above.</p>
                  )}
                </div>
              </div>

              {/* Social */}
              <div>
                <p className="font-sans text-ivory/30 text-[10px] tracking-ultra uppercase mb-4">Social Links</p>
                <ItemList items={settings.footer.socialLinks} onChange={items => setFooter({ socialLinks: items })} labelPlaceholder="Platform (e.g. Instagram)" hrefPlaceholder="https://…" />
              </div>

              {/* Copyright */}
              <Field label="Copyright Text" value={settings.footer.copyright} onChange={v => setFooter({ copyright: v })} placeholder="Architecture & Interiors — Faridabad, Haryana" />
            </div>
          )}

          {/* ── SEO ── */}
          {tab === "seo" && (
            <div className="space-y-8">
              <Field label="Meta Title" value={settings.seo.metaTitle} onChange={v => setSeo({ metaTitle: v })} placeholder="VVA — Architecture & Interiors" hint="Shown in browser tab and search results. Keep under 60 characters." />
              <Field label="Meta Description" value={settings.seo.metaDescription} onChange={v => setSeo({ metaDescription: v })} textarea placeholder="Award-winning architecture and interior design studio…" hint="Shown in search results snippets. Keep under 160 characters." />

              {/* OG Image */}
              <div className="flex flex-col gap-1.5">
                <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">OG Image</span>
                <div className="flex gap-3">
                  <input value={settings.seo.ogImage} onChange={e => setSeo({ ogImage: e.target.value })} placeholder="Paste image URL or upload…" className="flex-1 bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors" />
                  <button type="button" onClick={() => ogRef.current?.click()} disabled={uploading === "og"} className="px-4 py-2.5 border border-ivory/20 text-ivory/70 font-sans text-xs tracking-wider hover:bg-ivory/10 transition-colors whitespace-nowrap disabled:opacity-40">
                    {uploading === "og" ? "Uploading…" : "Upload"}
                  </button>
                  <input ref={ogRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f, "og"); e.target.value = ""; }} />
                </div>
                {settings.seo.ogImage && (
                  <div className="relative mt-3 h-40 w-full overflow-hidden rounded border border-ivory/20">
                    <Image src={settings.seo.ogImage} alt="OG preview" fill className="object-cover" />
                  </div>
                )}
                <p className="font-sans text-ivory/25 text-[10px]">Recommended: 1200×630 px. Used when the site is shared on social media.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 px-6 py-4 font-sans text-sm z-50 ${toast.type === "success" ? "bg-ivory text-obsidian" : "bg-red-500 text-white"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
