import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors"; // Import colors
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: { // Add new color palette
        primary: colors.sky,
        secondary: colors.amber,
        neutraltext: colors.neutral[700],
        neutralbg: colors.neutral[100],
        darktext: colors.neutral[200],
        darkbg: colors.neutral[800],
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
        kalam: ["Kalam cursive"],
        // 科技感字体
        heading: ["Space Grotesk", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        tech: ["Orbitron", "sans-serif"],
      },

      keyframes: {
        wiggle: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        typing: {
          "0%": { width: 0 },
          "100%": { width: '23ch' },
        },
        // 科技感动画
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "pulse-border": {
          "0%, 100%": { borderColor: "rgba(59, 130, 246, 0.5)" },
          "50%": { borderColor: "rgba(59, 130, 246, 1)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "cyber-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.5)",
          },
        },
      },
	  animation: {
        wiggle: 'wiggle 0.5s ease-in-out',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        "pulse-border": 'pulse-border 2s ease-in-out infinite',
        "scan-line": 'scan-line 3s linear infinite',
        "cyber-glow": 'cyber-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
