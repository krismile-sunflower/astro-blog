import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors"; // Import colors
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: { // Add new color palette
        primary: {
          '400': '#FF007F',
          '500': '#FF007F',
          '600': '#C0005F',
        },
        neutraltext: '#222222',
        neutralbg: '#F0F0F0',
        darktext: '#E0E0E0',
        darkbg: '#1A1A1A',
        'pixel-accent': '#00FFFF',
      },
      fontFamily: {
        sans: ['PixelFont', "Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
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
