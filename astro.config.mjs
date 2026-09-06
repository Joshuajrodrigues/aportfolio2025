// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import svelte from '@astrojs/svelte';

import favicons from 'astro-favicons';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.akankshagajankar.com',
  adapter: cloudflare(),
    integrations: [mdx(), sitemap(), svelte(), favicons(), react()],
});
