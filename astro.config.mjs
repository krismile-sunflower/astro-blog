import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from "@astrojs/preact";
import { remarkReadingTime } from './remark-reading-time.mjs';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321",
  prefetch: true,
  markdown: {
    shikiConfig: {
      // 选择 Shiki 内置的主题（或添加你自己的主题）
      // https://shiki.style/themes
      // theme: 'dracula',
      // 另外，也提供了多种主题
      // 查看下面关于使用亮/暗双主题的的说明
      // themes: {
      //   light: 'github-light',
      //   dark: 'github-dark',
      // },
      // 添加自定义语言
      // 注意：Shiki 内置了无数语言，包括 .astro！
      // https://shiki.style/languages
      langs: [],
      // 启用自动换行，以防止水平滚动
      wrap: true,
      // 添加自定义转换器：https://shiki.style/guide/transformers
      // 查找常用转换器：https://shiki.style/packages/transformers
      transformers: []
    },
    gfm: true,
    remarkPlugins: [remarkReadingTime]
  },
  integrations: [preact({
    compat: true
  }), mdx(), tailwind(), icon({
    iconDir: "src/icons"
  })],
  output: "server",
  adapter: vercel()
});