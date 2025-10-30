import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#f1f4f8",
          dark: "#141922"
        }
      },
      boxShadow: {
        neo: "12px 12px 24px rgba(0,0,0,0.15), -12px -12px 24px rgba(255,255,255,0.6)",
        "neo-sm": "6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.45)"
      }
    }
  },
  plugins: []
};

export default config;
