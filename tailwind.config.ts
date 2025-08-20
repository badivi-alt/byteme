import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0ea5e9" }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.05)"
      }
    }
  },
  plugins: []
}
export default config
