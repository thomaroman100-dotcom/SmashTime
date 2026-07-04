import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        smash: {
          black: "#050505",
          dark: "#0B0B0D",
          card: "#111113",
          red: "#D71920",
          deepRed: "#B80012",
          gold: "#C9A24A",
          light: "#D8D8D8",
          muted: "#8A8A8A"
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Impact", "Arial Narrow", "sans-serif"],
        body: ["var(--font-body)", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        redline: "0 0 0 1px rgba(215, 25, 32, 0.55)"
      }
    }
  },
  plugins: [forms]
};

export default config;
