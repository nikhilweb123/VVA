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
    <div className="border-y border-bone/10 py-5 overflow-hidden bg-obsidian">
      <div className="flex gap-10 whitespace-nowrap marquee-track">
        {track.map((item, i) => (
          <span
            key={i}
            className={
              item === "—"
                ? "font-sans text-ash text-xs"
                : "font-serif text-ivory/80 text-sm italic tracking-wide"
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
