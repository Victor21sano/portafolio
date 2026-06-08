import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "rgb(var(--brand) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)"
      },
      boxShadow: {
        "hard": "0 1px 0 rgb(17 24 39 / 0.08), 0 20px 45px rgb(17 24 39 / 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
