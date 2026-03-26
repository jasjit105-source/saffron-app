import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Saffron brand palette
        saffron: {
          50: "#fefaf0",
          100: "#fdf3d8",
          200: "#fbe5a8",
          300: "#f8d06e",
          400: "#f5b83a",
          500: "#e89613", // primary saffron
          600: "#cc7a0e",
          700: "#a95c10",
          800: "#8a4914",
          900: "#723c14",
        },
        ivory: {
          50: "#fefdfb",
          100: "#fdf9f0",
          200: "#faf3e0",
          300: "#f5e8c8",
          400: "#eddaab",
        },
        maroon: {
          50: "#fdf2f2",
          100: "#fce7e7",
          200: "#f9d0d0",
          300: "#f4a8a8",
          400: "#ec7272",
          500: "#b91c1c",
          600: "#991b1b",
          700: "#7f1d1d",
          800: "#6b1e1e",
          900: "#5c1e1e",
        },
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#d4a017",
          600: "#b8860b",
          700: "#92710c",
          800: "#7a5f12",
          900: "#684e15",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["DM Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
