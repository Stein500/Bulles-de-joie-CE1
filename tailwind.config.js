/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fuchsia: {
          DEFAULT: "#FF00FF",
          50: "#FFE5FF",
          100: "#FFCCFF",
          200: "#FF99FF",
          300: "#FF66FF",
          400: "#FF33FF",
          500: "#FF00FF",
          600: "#CC00CC",
          700: "#990099",
          800: "#660066",
          900: "#330033",
        },
        citron: {
          DEFAULT: "#CCFF00",
          50: "#F5FFE5",
          100: "#EBFFCC",
          200: "#D6FF99",
          300: "#C2FF66",
          400: "#ADFF33",
          500: "#CCFF00",
          600: "#99CC00",
          700: "#669900",
          800: "#336600",
          900: "#1A3300",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
