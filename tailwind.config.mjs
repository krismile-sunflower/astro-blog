import defaultTheme from "tailwindcss/defaultTheme";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
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
      },
	  animation: {
        wiggle: 'wiggle 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
