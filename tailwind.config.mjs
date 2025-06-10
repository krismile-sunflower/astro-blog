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
      },
	  animation: {
        wiggle: 'wiggle 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
