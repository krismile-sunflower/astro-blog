import { rssSchema } from "@astrojs/rss";
import { defineCollection, z } from "astro:content";

const blogsCollection = defineCollection({
    // schema: rssSchema
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      tags: z.array(z.string())
    })
 });

export const collections = {
  posts: blogsCollection,
};