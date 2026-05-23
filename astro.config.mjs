import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from "@astrojs/preact";
import { remarkReadingTime } from './remark-reading-time.mjs';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321",
  prefetch: true,
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      langs: [],
      wrap: true,
      transformers: []
    },
    gfm: true,
    remarkPlugins: [remarkReadingTime]
  },
  integrations: [preact({
    compat: true
  }), mdx(), tailwind(), icon({
    iconDir: "src/icons"
  }), pagefind()],
  experimental: {

  }
});