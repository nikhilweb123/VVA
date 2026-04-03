"use client";

import { useLenis } from "../hooks/useLenis";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useLenis(); // initializes Lenis on mount

  return <>{children}</>;
}
