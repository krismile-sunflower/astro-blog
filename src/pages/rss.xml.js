import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: 'Astro Learner | Blog',
    description: 'My journey learning Astro',
    site: context.site,
    // items: await pagesGlobToRssItems(posts),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      customData: post.data.customData,
      // 从 `slug` 属性计算出 RSS 链接
      // 这个例子假设所有的文章都被渲染为 `/blog/[slug]` 路由
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>zh-cn</language>`,
  });
}