import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		category: z.enum(['日記', 'メモ', '知識', '仕事']),
		description: z.string().optional(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
	}),
});

export const collections = {
	posts: postsCollection,
};
