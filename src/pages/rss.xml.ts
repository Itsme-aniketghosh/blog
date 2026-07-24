import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const base = context.site
    ? new URL(import.meta.env.BASE_URL, context.site).toString()
    : site.url;

  return rss({
    title: site.title,
    description: site.description,
    site: base,
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      categories: entry.data.tags,
      // External entries link out to where they live; native to the local page.
      link: entry.data.url ?? `${base.replace(/\/$/, '')}/posts/${entry.id}`,
    })),
  });
}
