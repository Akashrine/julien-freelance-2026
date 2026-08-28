// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://julien-brionne.fr',
  output: 'static',
  // Migration des routes, catégorie A, 28/08/2026.
  // Successeur fonctionnel direct, aucune donnée ne peut changer la destination.
  // Les catégories B et C attendent la Search Console : ne rien ajouter ici sans elle.
  redirects: {
    '/approche': { status: 301, destination: '/ce-que-je-fais' },
    '/contact': { status: 301, destination: '/ce-que-je-fais' },
    '/references': { status: 301, destination: '/ce-que-je-fais' },
  },
  adapter: vercel(),
  trailingSlash: 'never',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: 'terser',
    },
  },
  integrations: [mdx(), react(), sitemap({
    filter: (page) => !page.includes('/mentions-legales'),
  })],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
});