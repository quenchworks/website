import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

// /rss.xml — the changelog as a feed, newest first.
export async function GET(context: APIContext) {
  const entries = (await getCollection('changelog')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: 'QuenchWorks Changelog',
    description:
      'What shipped in the QuenchWorks catalog: new hardened images, signed charts, and supply-chain changes.',
    site: context.site ?? 'https://quench-works.com',
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: '/changelog',
      categories: entry.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
