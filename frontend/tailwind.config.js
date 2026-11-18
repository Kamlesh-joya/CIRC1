/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lime: "#BBFA47",
          limeHover: "#aee83e",
          black: "#0D0F0D",
          charcoal: "#252B26",
          charcoalHover: "#2d352e",
          offwhite: "#FEFAF7",
          muted: "#A4ADA5",
          borderDark: "rgba(255, 255, 255, 0.1)",
          borderLight: "rgba(13, 15, 13, 0.1)"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(13, 15, 13, 0.06), 0 8px 24px rgba(13, 15, 13, 0.04)",
        "card-hover": "0 4px 12px rgba(13, 15, 13, 0.08), 0 16px 32px rgba(13, 15, 13, 0.08)",
        glow: "0 0 25px rgba(187, 250, 71, 0.3)"
      }
    },
  },
  plugins: [],
}
