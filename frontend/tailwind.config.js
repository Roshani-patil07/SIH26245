/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: "#003366",
          navy: "#0a192f",
          dark: "#1e293b",
          light: "#f8fafc",
          gold: "#d97706",
          accent: "#2563eb",
          border: "#e2e8f0"
        },
        risk: {
          low: "#16a34a",
          medium: "#d97706",
          high: "#dc2626",
          critical: "#991b1b"
        }
      }
    },
  },
  plugins: [],
}
