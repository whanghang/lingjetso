/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { brand: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#1e64c8', 600: '#1e64c8', 700: '#184f9e', 800: '#123d78', 900: '#0d2b52' } },
      fontFamily: { sans: ['"Noto Sans TC"', "sans-serif"] },
    },
  },
  plugins: [],
}
