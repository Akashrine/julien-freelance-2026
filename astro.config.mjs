// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://julien-brionne.fr',
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: 'terser',
    },
  },
  integrations: [mdx()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
});
