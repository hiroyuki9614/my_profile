// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://hiroyuki9614.github.io/',
	base: '/my_profile',
	integrations: [react(), sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},
});
