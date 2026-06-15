import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Changelog: one Markdown file per entry under src/content/changelog/.
// Catalog data is generated from the source repos; these notes are hand-written.
const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

// Docs: one MDX file per page under src/content/docs/, rendered through the
// custom Docs.astro layout and the /docs/[...slug] route. Sidebar grouping and
// ordering are driven by the group + order fields below.
const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    group: z.enum(['Guides', 'Reference']),
    order: z.number(),
  }),
});

export const collections = { changelog, docs };
