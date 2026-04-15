import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

export const getPostByAttr = (posts: Post[], attr: keyof Post['data']) => {
	const attrSet = new Set<string>();
	posts.forEach((post) => {
		if (post.data[attr]) {
			attrSet.add(String(post.data[attr]));
		}
	});
	return Array.from(attrSet);
};

export const countByAttr = (posts: Post[], attr: keyof Post['data']) => {
	return posts.reduce<Record<string, number>>((acc, post: Post) => {
		const value = post.data[attr];

		if (value) {
			acc[String(value)] = (acc[String(value)] || 0) + 1;
		}

		return acc;
	}, {});
};
