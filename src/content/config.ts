import { defineCollection, z } from 'astro:content';

const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    // Date de révision réelle. Renseignée seulement quand le texte a été
    // repris après publication ; sinon dateModified retombe sur date.
    updated: z.string().optional(),
    category: z.enum(['reflexion', 'analyse']),
    excerpt: z.string(),
    thumbnail: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  articles: articlesCollection,
};
