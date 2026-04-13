"use client";

const items = [
  "Architecture",
  "—",
  "Interiors",
  "—",
  "Hospitality",
  "—",
  "Civic",
  "—",
  "Residential",
  "—",
  "Commercial",
  "—",
  "Landscape",
  "—",
];

export default function MarqueeBanner() {
  const track = [...items, ...items];

  return (
    <div className="border-y border-black/10 py-5 overflow-hidden bg-[#D87441]">
      <div className="flex gap-10 whitespace-nowrap marquee-track">
        {track.map((item, i) => (
          <span
            key={i}
            className={
              item === "—"
                ? "font-sans text-white/40 text-xs"
                : "font-serif text-white text-sm tracking-wide"
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>

  );
}
