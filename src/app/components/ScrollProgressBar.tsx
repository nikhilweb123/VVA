"use client";

import { useScrollProgress } from "../hooks/useScrollProgress";

export default function ScrollProgressBar() {
  const ref = useScrollProgress();

  return (
    <div
      ref={ref}
      className="scroll-progress"
      style={{ width: "100%", transformOrigin: "left" }}
    />
  );
}
