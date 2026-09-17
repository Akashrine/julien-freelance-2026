// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Dates de dernière révision, lues une fois au build dans le frontmatter MDX.
// Pas de dépendance : le frontmatter de ce dépôt tient sur des lignes simples.
const datesArticles = Object.fromEntries(
  readdirSync('./src/content/articles')
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const tete = readFileSync(`./src/content/articles/${f}`, 'utf-8').split('---')[1] || '';
      const lire = (cle) => (tete.match(new RegExp(`^${cle}:\\s*['"]?([0-9-]{10})`, 'm')) || [])[1];
      const quand = lire('updated') || lire('date');
      return [`articles/${f.replace(/\.mdx$/, '')}`, quand ? new Date(quand).toISOString() : null];
    })
    .filter(([, d]) => d)
);


// https://astro.build/config
export default defineConfig({
  // Hôte canonique : www, arbitré le 30/08. C'est le domaine primaire servi
  // par Vercel ; le domaine nu redirige vers lui.
  site: 'https://www.julien-brionne.fr',
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
    // Le sitemap ne portait aucune date. Chaque article en a une dans son
    // frontmatter — `updated` s'il a été repris, `date` sinon. La donner au
    // moteur lui évite de redécouvrir douze textes à chaque passage.
    serialize: (item) => {
      const slug = item.url.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '');
      const lastmod = datesArticles[slug];
      return lastmod ? { ...item, lastmod } : item;
    },
  })],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
});