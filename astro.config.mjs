import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import rehypeMermaid from 'rehype-mermaid';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
	site: 'https://hiroyuki9614.github.io',
	base: '/my_profile',
	integrations: [
		react(),
		sitemap(),
		mdx({
			syntaxHighlight: false,
			rehypePlugins: [[rehypeMermaid, { strategy: 'inline-svg' }]],
		}),
	],

	markdown: {
		syntaxHighlight: {
			type: 'shiki',
			excludeLangs: ['mermaid', 'js'],
		},
		rehypePlugins: [[rehypeMermaid, { strategy: 'inline-svg' }]],
	},

	vite: {
		plugins: [tailwindcss()],
	},
});
