"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─────────────────────────────────────────────── */
interface HeroSlide { src: string; title: string; subtitle: string; location: string; ctaText: string; ctaLink: string; }
interface ServiceItem { title: string; description: string; }
interface StatItem { value: string; label: string; }
interface Testimonial { name: string; role: string; image: string; review: string; }
interface SocialLink { label: string; href: string; }
interface FooterContent { ctaHeading: string; ctaSubtext: string; email: string; phone: string; address: string; brandName: string; tagline: string; socialLinks: SocialLink[]; copyright: string; }
interface AboutContent { title: string; description1: string; description2: string; image: string; }
interface HomepageData {
  hero: HeroSlide[];
  about: AboutContent;
  servicesHeading: string;
  servicesSubheading: string;
  services: ServiceItem[];
  stats: StatItem[];
  testimonials: Testimonial[];
  footer: FooterContent;
}

const EMPTY_SLIDE: HeroSlide = { src: "", title: "", subtitle: "", location: "", ctaText: "", ctaLink: "" };
const EMPTY_SERVICE: ServiceItem = { title: "", description: "" };
const EMPTY_STAT: StatItem = { value: "", label: "" };
const EMPTY_TESTIMONIAL: Testimonial = { name: "", role: "", image: "", review: "" };
const EMPTY_SOCIAL: SocialLink = { label: "", href: "" };

const TABS = ["Hero", "About", "Services", "Stats", "Testimonials", "Footer"] as const;
type Tab = typeof TABS[number];

/* ─── Helpers ────────────────────────────────────────────── */
function Input({ label, value, onChange, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string; }) {
  const cls = "w-full bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">{label}</span>
      {textarea
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls + " resize-y"} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </label>
  );
}

function ImageInput({ label, value, onChange, uploading, onUpload }: { label: string; value: string; onChange: (v: string) => void; uploading?: boolean; onUpload?: (file: File) => void; }) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-sans text-ivory/50 text-[10px] tracking-ultra uppercase">{label}</span>
      <div className="flex gap-2">
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="Paste image URL or upload…" className="flex-1 bg-ivory/5 border border-ivory/20 text-ivory placeholder-ivory/30 font-sans text-sm px-4 py-2.5 focus:outline-none focus:border-ivory/50 transition-colors" />
        <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2.5 border border-ivory/20 text-ivory/70 font-sans text-xs tracking-wider hover:bg-ivory/10 transition-colors whitespace-nowrap" disabled={uploading}>
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f && onUpload) onUpload(f); e.target.value = ""; }} />
      </div>
      {value && <img src={value} alt="preview" className="mt-2 h-24 w-auto object-cover border border-ivory/10 grayscale opacity-70" />}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-ivory text-2xl font-light mb-8">{children}</h2>;
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="mt-4 px-5 py-2.5 border border-dashed border-ivory/30 text-ivory/60 font-sans text-xs tracking-ultra uppercase hover:border-ivory/60 hover:text-ivory/80 transition-colors">
      + {label}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="font-sans text-[10px] tracking-ultra uppercase text-red-400/70 hover:text-red-400 transition-colors">
      Remove
    </button>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function AdminHomepage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Hero");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch("/api/homepage")
      .then(r => r.json())
      .then(d => {
        if (d && !d.error) {
          setData({
            hero: Array.isArray(d.hero) ? d.hero : [],
            about: d.about ?? { title: "", description1: "", description2: "", image: "" },
            servicesHeading: d.servicesHeading ?? "",
            servicesSubheading: d.servicesSubheading ?? "",
            services: Array.isArray(d.services) ? d.services : [],
            stats: Array.isArray(d.stats) ? d.stats : [],
            testimonials: Array.isArray(d.testimonials) ? d.testimonials : [],
            footer: d.footer ? {
              ...d.footer,
              socialLinks: Array.isArray(d.footer.socialLinks) ? d.footer.socialLinks : []
            } : { ctaHeading: "", ctaSubtext: "", email: "", phone: "", address: "", brandName: "", tagline: "", socialLinks: [], copyright: "" },
          });
        } else {
          setData(null);
        }
      })
      .catch(() => showToast("Failed to load content", "error"))
      .finally(() => setLoading(false));
  }, []);

  const uploadImage = async (file: File, key: string): Promise<string> => {
    setUploading(key);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    setUploading(null);
    if (!res.ok) throw new Error(json.error ?? "Upload failed");
    return json.url as string;
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/homepage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Save failed");
      showToast("Homepage saved successfully");
    } catch {
      showToast("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  /* array helpers */
  const updateHero = (i: number, k: keyof HeroSlide, v: string) =>
    setData(d => d ? { ...d, hero: d.hero.map((s, idx) => idx === i ? { ...s, [k]: v } : s) } : d);
  const addHero = () => setData(d => d ? { ...d, hero: [...d.hero, { ...EMPTY_SLIDE }] } : d);
  const removeHero = (i: number) => setData(d => d ? { ...d, hero: d.hero.filter((_, idx) => idx !== i) } : d);

  const updateService = (i: number, k: keyof ServiceItem, v: string) =>
    setData(d => d ? { ...d, services: d.services.map((s, idx) => idx === i ? { ...s, [k]: v } : s) } : d);
  const addService = () => setData(d => d ? { ...d, services: [...d.services, { ...EMPTY_SERVICE }] } : d);
  const removeService = (i: number) => setData(d => d ? { ...d, services: d.services.filter((_, idx) => idx !== i) } : d);

  const updateStat = (i: number, k: keyof StatItem, v: string) =>
    setData(d => d ? { ...d, stats: d.stats.map((s, idx) => idx === i ? { ...s, [k]: v } : s) } : d);
  const addStat = () => setData(d => d ? { ...d, stats: [...d.stats, { ...EMPTY_STAT }] } : d);
  const removeStat = (i: number) => setData(d => d ? { ...d, stats: d.stats.filter((_, idx) => idx !== i) } : d);

  const updateTestimonial = (i: number, k: keyof Testimonial, v: string) =>
    setData(d => d ? { ...d, testimonials: d.testimonials.map((s, idx) => idx === i ? { ...s, [k]: v } : s) } : d);
  const addTestimonial = () => setData(d => d ? { ...d, testimonials: [...d.testimonials, { ...EMPTY_TESTIMONIAL }] } : d);
  const removeTestimonial = (i: number) => setData(d => d ? { ...d, testimonials: d.testimonials.filter((_, idx) => idx !== i) } : d);

  const updateSocial = (i: number, k: keyof SocialLink, v: string) =>
    setData(d => d ? { ...d, footer: { ...d.footer, socialLinks: d.footer.socialLinks.map((s, idx) => idx === i ? { ...s, [k]: v } : s) } } : d);
  const addSocial = () => setData(d => d ? { ...d, footer: { ...d.footer, socialLinks: [...d.footer.socialLinks, { ...EMPTY_SOCIAL }] } } : d);
  const removeSocial = (i: number) => setData(d => d ? { ...d, footer: { ...d.footer, socialLinks: d.footer.socialLinks.filter((_, idx) => idx !== i) } } : d);

  const setAbout = (k: keyof AboutContent, v: string) =>
    setData(d => d ? { ...d, about: { ...d.about, [k]: v } } : d);
  const setFooter = (k: keyof FooterContent, v: string) =>
    setData(d => d ? { ...d, footer: { ...d.footer, [k]: v } } : d);

  if (loading) return <div className="font-sans text-ivory/40 text-sm">Loading…</div>;
  if (!data) return <div className="font-sans text-red-400 text-sm">Failed to load content.</div>;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-serif text-ivory">Homepage Content</h1>
        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-3 bg-ivory text-obsidian font-sans text-xs tracking-ultra uppercase hover:bg-ivory/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-ivory/20 mb-10 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-sans text-xs tracking-ultra uppercase transition-colors whitespace-nowrap ${activeTab === tab ? "text-ivory border-b-2 border-ivory -mb-px" : "text-ivory/40 hover:text-ivory/70"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Hero Tab ── */}
      {activeTab === "Hero" && (
        <div className="space-y-10">
          <SectionTitle>Hero Slides</SectionTitle>
          {data.hero.map((slide, i) => (
            <div key={i} className="border border-ivory/15 p-6 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-ivory/40 text-xs tracking-ultra uppercase">Slide {i + 1}</span>
                <RemoveBtn onClick={() => removeHero(i)} />
              </div>
              <ImageInput
                label="Background Image"
                value={slide.src}
                onChange={v => updateHero(i, "src", v)}
                uploading={uploading === `hero-${i}`}
                onUpload={async f => { try { const url = await uploadImage(f, `hero-${i}`); updateHero(i, "src", url); } catch { showToast("Image upload failed", "error"); } }}
              />
              <Input label="Heading Text" value={slide.title} onChange={v => updateHero(i, "title", v)} textarea placeholder="Use \n for line breaks" />
              <Input label="Subheading Text" value={slide.subtitle} onChange={v => updateHero(i, "subtitle", v)} placeholder="e.g. Golden Square, Manesar" />
              <Input label="Location" value={slide.location} onChange={v => updateHero(i, "location", v)} placeholder="e.g. Haryana" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="CTA Button Text" value={slide.ctaText} onChange={v => updateHero(i, "ctaText", v)} placeholder="e.g. View Projects" />
                <Input label="CTA Button Link" value={slide.ctaLink} onChange={v => updateHero(i, "ctaLink", v)} placeholder="e.g. /projects" />
              </div>
            </div>
          ))}
          <AddBtn onClick={addHero} label="Add Slide" />
        </div>
      )}

      {/* ── About Tab ── */}
      {activeTab === "About" && (
        <div className="space-y-6">
          <SectionTitle>About Section</SectionTitle>
          <Input label="Title / Studio Name" value={data.about.title} onChange={v => setAbout("title", v)} />
          <Input label="Description (Left Column)" value={data.about.description1} onChange={v => setAbout("description1", v)} textarea />
          <Input label="Description (Right Column)" value={data.about.description2} onChange={v => setAbout("description2", v)} textarea />
          <ImageInput
            label="About Image"
            value={data.about.image}
            onChange={v => setAbout("image", v)}
            uploading={uploading === "about-img"}
            onUpload={async f => { try { const url = await uploadImage(f, "about-img"); setAbout("image", url); } catch { showToast("Image upload failed", "error"); } }}
          />
        </div>
      )}

      {/* ── Services Tab ── */}
      {activeTab === "Services" && (
        <div className="space-y-8">
          <SectionTitle>Services / Features</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Section Subheading" value={data.servicesSubheading} onChange={v => setData(d => d ? { ...d, servicesSubheading: v } : d)} placeholder="e.g. Our Expertise" />
            <Input label="Section Heading" value={data.servicesHeading} onChange={v => setData(d => d ? { ...d, servicesHeading: v } : d)} placeholder="e.g. Elevating spaces…" />
          </div>
          <hr className="border-ivory/10" />
          {data.services.map((svc, i) => (
            <div key={i} className="border border-ivory/15 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-ivory/40 text-xs tracking-ultra uppercase">Service {i + 1}</span>
                <RemoveBtn onClick={() => removeService(i)} />
              </div>
              <Input label="Title" value={svc.title} onChange={v => updateService(i, "title", v)} />
              <Input label="Description" value={svc.description} onChange={v => updateService(i, "description", v)} textarea />
            </div>
          ))}
          <AddBtn onClick={addService} label="Add Service" />
        </div>
      )}

      {/* ── Stats Tab ── */}
      {activeTab === "Stats" && (
        <div className="space-y-8">
          <SectionTitle>Stats Section</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.stats.map((stat, i) => (
              <div key={i} className="border border-ivory/15 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-ivory/40 text-xs tracking-ultra uppercase">Stat {i + 1}</span>
                  <RemoveBtn onClick={() => removeStat(i)} />
                </div>
                <Input label="Number / Value" value={stat.value} onChange={v => updateStat(i, "value", v)} placeholder="e.g. 120+" />
                <Input label="Label" value={stat.label} onChange={v => updateStat(i, "label", v)} placeholder="e.g. Projects Completed" />
              </div>
            ))}
          </div>
          <AddBtn onClick={addStat} label="Add Stat" />
        </div>
      )}

      {/* ── Testimonials Tab ── */}
      {activeTab === "Testimonials" && (
        <div className="space-y-8">
          <SectionTitle>Testimonials</SectionTitle>
          {data.testimonials.length === 0 && (
            <p className="font-sans text-ivory/40 text-sm">No testimonials yet. Add one below.</p>
          )}
          {data.testimonials.map((t, i) => (
            <div key={i} className="border border-ivory/15 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-ivory/40 text-xs tracking-ultra uppercase">Testimonial {i + 1}</span>
                <RemoveBtn onClick={() => removeTestimonial(i)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Client Name" value={t.name} onChange={v => updateTestimonial(i, "name", v)} />
                <Input label="Role / Company" value={t.role} onChange={v => updateTestimonial(i, "role", v)} placeholder="e.g. CEO, Acme Corp" />
              </div>
              <Input label="Review" value={t.review} onChange={v => updateTestimonial(i, "review", v)} textarea />
              <ImageInput
                label="Client Photo (optional)"
                value={t.image}
                onChange={v => updateTestimonial(i, "image", v)}
                uploading={uploading === `testimonial-${i}`}
                onUpload={async f => { try { const url = await uploadImage(f, `testimonial-${i}`); updateTestimonial(i, "image", url); } catch { showToast("Image upload failed", "error"); } }}
              />
            </div>
          ))}
          <AddBtn onClick={addTestimonial} label="Add Testimonial" />
        </div>
      )}

      {/* ── Footer Tab ── */}
      {activeTab === "Footer" && (
        <div className="space-y-6">
          <SectionTitle>Footer Content</SectionTitle>

          <div className="border border-ivory/15 p-6 space-y-4">
            <p className="font-sans text-ivory/40 text-xs tracking-ultra uppercase mb-2">CTA Banner</p>
            <Input label="CTA Label" value={data.footer.ctaSubtext} onChange={v => setFooter("ctaSubtext", v)} placeholder="e.g. Let's Work Together" />
            <Input label="CTA Heading" value={data.footer.ctaHeading} onChange={v => setFooter("ctaHeading", v)} placeholder="e.g. Let's Build Something Exceptional." />
          </div>

          <div className="border border-ivory/15 p-6 space-y-4">
            <p className="font-sans text-ivory/40 text-xs tracking-ultra uppercase mb-2">Brand Info</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Brand Name" value={data.footer.brandName} onChange={v => setFooter("brandName", v)} placeholder="e.g. VVA" />
              <Input label="Tagline" value={data.footer.tagline} onChange={v => setFooter("tagline", v)} placeholder="e.g. Design Studio" />
            </div>
            <Input label="Address" value={data.footer.address} onChange={v => setFooter("address", v)} textarea placeholder="Use \n for line breaks" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" value={data.footer.phone} onChange={v => setFooter("phone", v)} placeholder="+91 XXXXXXXXXX" />
              <Input label="Email" value={data.footer.email} onChange={v => setFooter("email", v)} placeholder="connect@studio.in" />
            </div>
          </div>

          <div className="border border-ivory/15 p-6 space-y-4">
            <p className="font-sans text-ivory/40 text-xs tracking-ultra uppercase mb-2">Social Links</p>
            {data.footer.socialLinks.map((s, i) => (
              <div key={i} className="grid grid-cols-5 gap-3 items-end">
                <div className="col-span-2">
                  <Input label="Label" value={s.label} onChange={v => updateSocial(i, "label", v)} placeholder="e.g. Instagram" />
                </div>
                <div className="col-span-2">
                  <Input label="URL" value={s.href} onChange={v => updateSocial(i, "href", v)} placeholder="https://…" />
                </div>
                <div className="pb-2.5">
                  <RemoveBtn onClick={() => removeSocial(i)} />
                </div>
              </div>
            ))}
            <AddBtn onClick={addSocial} label="Add Social Link" />
          </div>

          <div className="border border-ivory/15 p-6">
            <Input label="Copyright Tagline" value={data.footer.copyright} onChange={v => setFooter("copyright", v)} placeholder="e.g. Architecture & Interiors — Faridabad, Haryana" />
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
            className={`fixed bottom-8 right-8 px-6 py-4 font-sans text-sm ${toast.type === "success" ? "bg-ivory text-obsidian" : "bg-red-500 text-white"}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
