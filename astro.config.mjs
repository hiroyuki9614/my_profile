// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://hiroyuki9614.github.io/my_profile',
	base: '/my_profile',
	integrations: [tailwind()],
});
