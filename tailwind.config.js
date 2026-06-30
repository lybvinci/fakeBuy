/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "3rem",
      },
    },
    extend: {
      colors: {
        cream: "#FAF6EE",
        paper: "#F1EBDA",
        ink: "#1A1A1A",
        vermilion: {
          DEFAULT: "#D63A2F",
          dark: "#A82A22",
        },
        moss: "#1F3A2E",
        mustard: "#E8B547",
        bone: "#E6DDC4",
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ['"Noto Sans SC"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['Fraunces', '"Noto Serif SC"', "serif"],
        mono: ['"Space Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      animation: {
        breathe: "breathe 1.8s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        "draw-check": "draw-check 0.6s ease-out forwards",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(214, 58, 47, 0.45)" },
          "50%": { boxShadow: "0 0 0 14px rgba(214, 58, 47, 0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "draw-check": {
          to: { strokeDashoffset: "0" },
        },
      },
      boxShadow: {
        paper: "4px 4px 0 0 #1A1A1A",
        "paper-sm": "2px 2px 0 0 #1A1A1A",
      },
    },
  },
  plugins: [],
};
