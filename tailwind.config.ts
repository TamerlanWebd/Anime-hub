// tailwind.config.ts
import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "brand-primary": "rgb(var(--brand-primary-rgb) / <alpha-value>)",
        "brand-secondary": "rgb(var(--brand-secondary-rgb) / <alpha-value>)",
        "accent-purple": "var(--accent-purple)",
        "accent-pink": "var(--accent-pink)",
        "accent-yellow": "var(--accent-yellow)",

        "background-light": "rgb(var(--background-light-rgb) / <alpha-value>)",
        "foreground-light": "var(--foreground-light)",
        "card-light": "var(--card-light)",
        "card-border-light": "var(--card-border-light)",
        "text-primary-light": "var(--text-primary-light)",
        "text-secondary-light": "var(--text-secondary-light)",
        "text-muted-light": "var(--text-muted-light)",
        "border-light": "var(--border-light)",
        "input-bg-light": "var(--input-bg-light)",

        "background-dark": "rgb(var(--background-dark-rgb) / <alpha-value>)",
        "foreground-dark": "var(--foreground-dark)",
        "card-dark": "var(--card-dark)",
        "card-border-dark": "var(--card-border-dark)",
        "text-primary-dark": "var(--text-primary-dark)",
        "text-secondary-dark": "var(--text-secondary-dark)",
        "text-muted-dark": "var(--text-muted-dark)",
        "border-dark": "var(--border-dark)",
        "input-bg-dark": "var(--input-bg-dark)",
      },
      fontFamily: {
        sans: ["var(--font-inter-str)", "Inter", "sans-serif"],
        display: ["var(--font-poppins-str)", "Poppins", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
