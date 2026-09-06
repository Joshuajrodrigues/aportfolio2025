// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import svelte from '@astrojs/svelte';

import favicons from 'astro-favicons';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.akankshagajankar.com',
  integrations: [mdx(), sitemap(), svelte(), favicons(), react()],
  adapter: cloudflare(),
});