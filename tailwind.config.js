/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
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
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.5' },
          '50%': { transform: 'translateY(-30px) rotate(180deg)', opacity: '0.8' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 0, 255, 0.8), 0 0 60px rgba(204, 255, 0, 0.5)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
