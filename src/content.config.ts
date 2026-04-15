import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		category: z.enum(['日記', 'メモ', '知識', '仕事']),
		description: z.string().optional(),
		image: z.string().optional(),
		status: z.enum(['published', 'unpublished']).default('unpublished'),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = {
	posts: postsCollection,
};
