import type { Config } from "tailwindcss";

const config: Config = {
  // Only process files that actually use Tailwind classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // ---- VentureAI Color System (Dark Theme) ----
      // Rule: 60% dark base, 30% secondary, 10% accent
      colors: {
        // Base (60%) — deep dark backgrounds
        base: {
          950: "#05060a", // darkest — page background
          900: "#0d0e17", // card backgrounds
          800: "#13141f", // elevated surfaces
          700: "#1a1b2e", // borders, dividers
        },
        // Secondary (30%) — purples for depth
        brand: {
          950: "#1a0533",
          900: "#2d0f5e",
          800: "#3d1a7a",
          700: "#5b2d9e",
          600: "#7c3dbf",
          500: "#9b59d0",
          400: "#b47ee0",
          300: "#cda8ee",
        },
        // Accent (10%) — cyan for CTAs and highlights
        accent: {
          500: "#00d4ff",
          400: "#33dcff",
          300: "#66e5ff",
          200: "#99eeff",
        },
        // Semantic colors
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },

      // ---- Typography ----
      // Inter for body (clean, readable), Space Grotesk for headings (techy)
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },

      // ---- Animations ----
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 212, 255, 0.6)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
        glow: "glow 2s ease-in-out infinite",
      },

      // ---- Glassmorphism utility ----
      backdropBlur: {
        xs: "2px",
      },

      // ---- Border radius ----
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;