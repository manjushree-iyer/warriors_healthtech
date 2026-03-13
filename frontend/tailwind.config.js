/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060E1C',
          900: '#0A1628',
          800: '#0F2040',
        },
        teal: {
          600: '#0D9488',
          500: '#14B8A6',
          400: '#2DD4BF',
          50: '#F0FDFA',
        },
        'warm-white': '#F8FAFC',
        'slate-500': '#64748B',
        rose: '#FB7185',
        emerald: '#059669',
        amber: '#F59E0B',
        lavender: '#818CF8',
      },
      fontFamily: {
        headings: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
