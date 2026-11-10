import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07090c",
        navy: "#0d1b2a",
        ivory: "#f6f1e7",
        mute: "#a39e93",
        gold: {
          DEFAULT: "#d4af37",
          bright: "#f0d78c",
        },
        line: "rgba(212, 175, 55, 0.35)",
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
      maxWidth: {
        page: "1440px",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(212, 175, 55, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
