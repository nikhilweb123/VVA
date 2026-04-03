import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        obsidian: "#0a0a0a",
        ivory: "#f5f0e8",
        ash: "#888880",
        bone: "#d4cfc6",
      },
      letterSpacing: {
        "ultra": "0.3em",
        "wide-xl": "0.2em",
      },
      transitionDuration: {
        "800": "800ms",
        "1200": "1200ms",
        "1500": "1500ms",
      },
    },
  },
  plugins: [],
};
export default config;
