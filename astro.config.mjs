// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, writeFileSync, existsSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

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


// Une redirection à joker que la config `redirects` ne sait pas exprimer en
// sortie statique : /case-study/* → /a-propos (audit SEO du 11/10). Ajoutée à
// la table de routage Vercel une fois que l'adaptateur l'a écrite, avant la
// lecture du système de fichiers, comme les autres redirections.
const redirectionCaseStudy = {
  name: 'redirection-case-study',
  hooks: {
    'astro:build:done': ({ logger }) => {
      const chemin = './.vercel/output/config.json';
      if (!existsSync(chemin)) {
        logger.warn(`${chemin} introuvable : /case-study/* n'est pas redirigée.`);
        return;
      }
      const config = JSON.parse(readFileSync(chemin, 'utf-8'));
      const regle = { src: '^/case-study(?:/.*)?$', headers: { Location: '/a-propos' }, status: 301 };
      if (config.routes.some((r) => r.src === regle.src)) return;
      const ici = config.routes.findIndex((r) => r.handle === 'filesystem');
      config.routes.splice(ici === -1 ? 0 : ici, 0, regle);
      writeFileSync(chemin, JSON.stringify(config, null, 2));
      logger.info('/case-study/* → /a-propos ajoutée à la table de routage.');
    },
  },
};

// Typographie française : une espace fine insécable (U+202F) devant « : ; ? ! »
// et à l'intérieur des guillemets, pour qu'un signe ne parte jamais seul en début
// de ligne. Posée sur le HTML final, pas dans les sources : le texte n'est pas
// réécrit. Seules les espaces ordinaires sont remplacées, dans le texte visible ;
// balises, attributs, commentaires, scripts, styles et blocs de code restent
// intacts. Revue typographique du 12/10/2026.
const ESPACE_FINE = ' ';
const espacesFines = (html) => {
  let horsTexte = null;
  return html.replace(/(<!--[\s\S]*?-->|<[^>]+>)|([^<]+)/g, (bloc, balise, texte) => {
    if (balise) {
      const ouvre = balise.match(/^<(script|style|pre|code|textarea)\b/i);
      const ferme = balise.match(/^<\/(script|style|pre|code|textarea)\s*>/i);
      if (!horsTexte && ouvre && !balise.endsWith('/>')) horsTexte = ouvre[1].toLowerCase();
      else if (horsTexte && ferme && ferme[1].toLowerCase() === horsTexte) horsTexte = null;
      return balise;
    }
    if (horsTexte) return texte;
    return texte.replace(/ ([:;?!»])/g, `${ESPACE_FINE}$1`).replace(/« /g, `«${ESPACE_FINE}`);
  });
};
const typographieFrancaise = {
  name: 'typographie-francaise',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      const racines = [fileURLToPath(dir), './.vercel/output/static']
        .filter((r) => existsSync(r))
        .map((r) => realpathSync(r));
      const vus = new Set();
      let fichiers = 0;
      for (const racine of new Set(racines)) {
        for (const relatif of readdirSync(racine, { recursive: true })) {
          if (!String(relatif).endsWith('.html')) continue;
          const chemin = realpathSync(join(racine, String(relatif)));
          if (vus.has(chemin)) continue;
          vus.add(chemin);
          const avant = readFileSync(chemin, 'utf-8');
          const apres = espacesFines(avant);
          if (apres !== avant) { writeFileSync(chemin, apres); fichiers++; }
        }
      }
      logger.info(`Espaces fines insécables posées dans ${fichiers} pages.`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // Hôte canonique : www, arbitré le 30/08. C'est le domaine primaire servi
  // par Vercel ; le domaine nu redirige vers lui.
  site: 'https://www.julien-brionne.fr',
  output: 'static',
  // Redirections 301, refonte Product Lead freelance du 11/10/2026.
  // Table de référence : 09_Solopreneur-Claude/03_PROJETS/julien-brionne/site-architecture.md.
  // Chaque destination est une page existante, et aucune destination n'est
  // elle-même redirigée. Exception connue et acceptée : une ancienne URL avec
  // slash final passe d'abord par le 308 générique de l'adaptateur (qui retire
  // le slash), puis par sa 301. Deux sauts, sans boucle. Les anciens articles
  // anglais et /now restent volontairement en 404.
  redirects: {
    // Pages retirées de cette refonte
    '/articles': { status: 301, destination: '/ecrits' },
    '/diagnostic': { status: 301, destination: '/ce-que-je-fais#la-mise-au-clair' },
    '/product-manager-freelance-pme': { status: 301, destination: '/ce-que-je-fais' },
    '/situations': { status: 301, destination: '/' },
    '/ressources': { status: 301, destination: '/ecrits' },
    '/ressources/generateur-prd': { status: 301, destination: '/ecrits' },
    '/ressources/systeme-discovery': { status: 301, destination: '/ecrits' },
    '/ressources/vibe-coding-pm': { status: 301, destination: '/ecrits' },
    // Redirections du 28/08, destinations mises à jour
    '/approche': { status: 301, destination: '/ce-que-je-fais' },
    '/contact': { status: 301, destination: '/ce-que-je-fais' },
    '/references': { status: 301, destination: '/a-propos' },
    // Anciennes routes (audit SEO du 11/10)
    '/head-of-product-montpellier': { status: 301, destination: '/ce-que-je-fais#porter' },
    '/fractional-cpo': { status: 301, destination: '/ce-que-je-fais#porter' },
    '/fractional-head-of-product': { status: 301, destination: '/ce-que-je-fais#porter' },
    '/blog/fractional-head-of-product': { status: 301, destination: '/ce-que-je-fais#porter' },
    '/accompagnement/coaching-product': { status: 301, destination: '/ce-que-je-fais' },
    '/accompagnement-produit': { status: 301, destination: '/ce-que-je-fais' },
    '/accompagnement/impact-sprint': { status: 301, destination: '/ce-que-je-fais#la-mise-au-clair' },
    '/accompagnement/leadership-produit': { status: 301, destination: '/ce-que-je-fais' },
    '/leadership-produit': { status: 301, destination: '/ce-que-je-fais' },
    '/diagnostic-produit': { status: 301, destination: '/ce-que-je-fais#la-mise-au-clair' },
    '/blog/art-subtil-dire-non': { status: 301, destination: '/articles/art-du-non' },
    '/blog': { status: 301, destination: '/ecrits' },
    '/posts': { status: 301, destination: '/ecrits' },
    '/outils': { status: 301, destination: '/ecrits' },
    '/case-studies': { status: 301, destination: '/a-propos' },
    // Articles dépubliés le 12/10/2026 (draft: true, fichiers conservés).
    '/articles/pm-freelance-senior-scale-up': { status: 301, destination: '/ecrits' },
    '/articles/structurer-equipe-produit-scale-up': { status: 301, destination: '/ecrits' },
    '/articles/probleme-organisation': { status: 301, destination: '/ecrits' },
    '/articles/activation-sequence': { status: 301, destination: '/ecrits' },
    // /case-study/* : route dynamique, posée par l'intégration
    // `redirection-case-study` plus bas (Astro statique n'accepte pas de
    // redirection à paramètre sans getStaticPaths).
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
  integrations: [mdx(), react(), redirectionCaseStudy, typographieFrancaise, sitemap({
    // Hors sitemap : le légal, et /ressources/prompts-discovery, gardée hors
    // vitrine pour d'anciens abonnés.
    filter: (page) => !page.includes('/mentions-legales') && !page.includes('/ressources'),
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