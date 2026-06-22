import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Changelog: one Markdown file per entry under src/content/changelog/.
// Catalog data is generated from the source repos; these notes are hand-written.
const changelogSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  summary: z.string(),
  tags: z.array(z.string()).optional(),
});

const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: changelogSchema,
});

// Locale changelog collections: same schema as `changelog`, different base
// dirs. Each holds translated Markdown of the same filenames. Rendered by the
// /ar/changelog and /es/changelog routes.
const changelogAr = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog-ar' }),
  schema: changelogSchema,
});

const changelogEs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog-es' }),
  schema: changelogSchema,
});

// Docs: one MDX file per page under src/content/docs/, rendered through the
// custom Docs.astro layout and the /docs/[...slug] route. Sidebar grouping and
// ordering are driven by the group + order fields below.
const docsSchema = z.object({
  title: z.string(),
  description: z.string(),
  group: z.enum(['Guides', 'Build images', 'Reference']),
  order: z.number(),
});

const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: docsSchema,
});

// Locale doc collections: same schema as `docs`, different base dirs. Each holds
// translated MDX of the same filenames. Rendered by /ar/docs and /es/docs routes.
const docsAr = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs-ar' }),
  schema: docsSchema,
});

const docsEs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs-es' }),
  schema: docsSchema,
});

export const collections = { changelog, changelogAr, changelogEs, docs, docsAr, docsEs };
