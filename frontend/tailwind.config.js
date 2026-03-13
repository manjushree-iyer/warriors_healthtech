/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060E1C",
          900: "#0A1628",
          800: "#0F2040",
        },
        teal: {
          600: "#0D9488",
          500: "#14B8A6",
          400: "#2DD4BF",
          50: "#F0FDFA",
        },
        slate: {
          500: "#64748B",
        },
        warm: {
          white: "#F8FAFC",
        },
        rose: "#FB7185",
        emerald: "#059669",
        amber: "#F59E0B",
        lavender: "#818CF8",
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "teal-cta": "0 8px 24px rgba(13, 148, 136, 0.25)",
        "card-default": "0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(13, 148, 136, 0.07)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.08), 0 16px 40px rgba(13, 148, 136, 0.14)",
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      maxWidth: {
        "7xl": "80rem",
      },
    },
  },
  plugins: [],
}
