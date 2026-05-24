import { defineConfig } from 'astro/config';
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert';
import react from '@astrojs/react';
import rehypeMermaid from 'rehype-mermaid';
import remarkGfm from 'remark-gfm';
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
		remarkPlugins: [remarkGithubBlockquoteAlert, remarkGfm],
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
