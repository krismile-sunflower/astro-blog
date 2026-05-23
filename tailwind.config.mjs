import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        term: {
          bg: "#0a0a0a",
          surface: "#111111",
          elevated: "#161616",
          "border-subtle": "#1a1a1a",
          "border-default": "#262626",
          "border-strong": "#404040",
          "text-primary": "#ededed",
          "text-secondary": "#a3a3a3",
          "text-muted": "#525252",
          "text-faint": "#2a2a2a",
          accent: "#f5b042",
          "accent-soft": "#ffb86c",
          "accent-dim": "#a3741f",
        },
        light: {
          bg: "#fafaf7",
          surface: "#f4f3ee",
          elevated: "#ecebe4",
          "border-subtle": "#e7e5de",
          "border-default": "#d6d3c7",
          "border-strong": "#a8a29a",
          "text-primary": "#1a1a1a",
          "text-secondary": "#525252",
          "text-muted": "#737373",
          "text-faint": "#d4d4d4",
          accent: "#c2410c",
          "accent-soft": "#ea580c",
          "accent-dim": "#9a3412",
        },
      },
      fontFamily: {
        mono: ['"Maple Mono CN"', '"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
        sans: ['"Maple Mono CN"', '"JetBrains Mono"', "system-ui", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      letterSpacing: {
        terminal: "0.02em",
      },
      keyframes: {
        "cursor-blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "cursor-blink": "cursor-blink 1.05s steps(1) infinite",
        "fade-up": "fade-up 200ms ease-out",
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
        lg: "4px",
        xl: "6px",
        "2xl": "6px",
        "3xl": "8px",
      },
    },
  },
  plugins: [],
};
