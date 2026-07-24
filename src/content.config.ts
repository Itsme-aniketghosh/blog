import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One entry = one piece of writing. Two shapes share this schema:
//
//   • External (the common case): set `url` to where the piece actually lives
//     (Substack / Medium / LessWrong). The card links straight out; no local
//     reader page is generated and no content is copy-pasted here.
//
//   • Native: omit `url`. The MDX body is rendered in a local reader with math,
//     code highlighting, and side-notes. `crosspost` may still point to mirrors.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Drives affordances, not a separate section: research reads like a paper
    // (math, side-notes, LW discussion), personal reads like an essay.
    kind: z.enum(['research', 'personal']),
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // --- Bridge fields -----------------------------------------------------
    // Where the full piece lives. If set, this entry is a pointer (external).
    url: z.url().optional(),
    // Which platform `url` points to (also used for the outbound label).
    platform: z.enum(['lesswrong', 'substack', 'medium', 'site']).optional(),
    // Extra mirrors / discussion homes for the same piece.
    crosspost: z
      .object({
        lesswrong: z.url().optional(),
        substack: z.url().optional(),
        medium: z.url().optional(),
      })
      .optional(),

    // --- Native-only ------------------------------------------------------
    // Only loads KaTeX CSS when true.
    math: z.boolean().default(false),
  }),
});

export const collections = { posts };
