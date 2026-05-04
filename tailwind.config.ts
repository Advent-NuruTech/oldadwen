import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // important
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F6F1EA",
          dark: "#0F0B08",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1A1410",
        },
        primary: {
          DEFAULT: "#3B2414",
          dark: "#E7D9C4",
        },
        secondary: {
          DEFAULT: "#5A3A23",
          dark: "#C9A24D",
        },
        accent: {
          DEFAULT: "#C9A24D",
          dark: "#B8943F",
        },
        muted: {
          DEFAULT: "#E7D9C4",
          dark: "#3A2B20",
        },
        text: {
          DEFAULT: "#2A1A10",
          dark: "#F6F1EA",
        },
      },
    },
  },
  plugins: [],
};

export default config;
