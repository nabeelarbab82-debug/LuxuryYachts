/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a1628",
          800: "#0f1f3a",
          700: "#1a2942",
        },
        gold: {
          500: "#FFD700",
          600: "#FFC700",
          400: "#FFE55C",
        },
        ocean: {
          500: "#00CED1",
          600: "#00B4D8",
          400: "#48CAE4",
          300: "#90E0EF",
        },
        sunset: {
          500: "#FF6B35",
          600: "#F7931E",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
