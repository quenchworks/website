import { defineCollection, z } from 'astro:content';
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

export const collections = { changelog };
