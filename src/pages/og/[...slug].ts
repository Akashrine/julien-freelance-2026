import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { formatDate } from '../../utils/date';
import { getCategoryLabel } from '../../utils/articles';

// Images OG rendues par satori : polices embarquées, retour à la ligne natif,
// rendu identique en local et sur Vercel. Le design est celui du site —
// crème, encre, Newsreader pour le titre, Instrument Sans pour le reste, le point
// du logotype en vermillon. Les TTF de src/og-fonts/ ne servent qu'au build.
const COLORS = {
  canvas: '#FBF7F1',
  ink: '#121316',
  dim: '#5E5C56',
  ochre: '#E84A2A',
};

// Chemin depuis la racine du projet : le module bundlé ne vit plus dans
// src/, et ces routes sont toutes prérendues — l'endpoint ne s'exécute
// qu'au build, où cwd est la racine du dépôt.
const font = (file: string) => readFileSync(`${process.cwd()}/src/og-fonts/${file}`);

const FONTS = [
  { name: 'Newsreader', data: font('Newsreader-Medium.ttf'), weight: 500 as const, style: 'normal' as const },
  { name: 'Instrument Sans', data: font('InstrumentSans-Regular.ttf'), weight: 400 as const, style: 'normal' as const },
  { name: 'Instrument Sans', data: font('InstrumentSans-Medium.ttf'), weight: 500 as const, style: 'normal' as const },
];

// Titres et descriptions repris des metadata réelles des pages. Aucune
// formulation propre à cet endpoint : l'image OG dit ce que la page dit.
const staticPages: Record<string, { title: string; description: string }> = {
  'page-home': {
    // Le H1 réel de la page : le logotype est déjà dans la carte.
    // Espaces insécables : la coupure tombe après la virgule, comme sur le site.
    title: 'Je prends en charge un sujet produit, de\u00a0la\u00a0décision au suivi des résultats.',
    description: 'Julien Brionne, Product Lead freelance.',
  },
  'page-ce-que-je-fais': {
    title: 'Porter le sujet avec vous, ou d’abord trancher ?',
    description: 'Deux manières de travailler avec moi : porter un sujet produit pendant plusieurs mois, ou trancher d’abord une question en un mois avec La Mise au clair.',
  },
  'page-a-propos': {
    title: 'Ce que j’ai déjà porté',
    description: 'Quinze ans dans le produit, de designer à Head of Product. Où j’ai travaillé, ce que j’y ai porté, et ce qu’en disent les gens qui étaient là.',
  },
  'page-ecrits': {
    title: 'Ce que j’écris, c’est comment je travaille.',
    description: 'Produit Sans Filtre et des textes sur les organisations produit : les explications qui arrivent avant le problème, les décisions qui ne tiennent pas.',
  },
};

export async function getStaticPaths() {
  const paths: Array<{ params: { slug: string } }> = [];

  Object.keys(staticPages).forEach((pageSlug) => {
    paths.push({ params: { slug: `${pageSlug}.webp` } });
  });

  const articles = await getCollection('articles', ({ data }) => data.draft !== true);
  articles.forEach((article) => {
    paths.push({ params: { slug: `article-${article.slug}.webp` } });
  });

  return paths;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const el = (type: string, style: Record<string, unknown>, children: unknown): any => ({
  type,
  props: { style, children },
});

function carte(title: string, description: string, meta?: string) {
  // La taille du titre suit sa longueur : grand quand il est court.
  const corps = title.length > 70 ? 56 : title.length > 42 ? 66 : 76;

  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: COLORS.canvas,
      padding: '72px 80px 64px',
      fontFamily: 'Instrument Sans',
    },
    [
      // Le logotype, point vermillon compris.
      el('div', { display: 'flex', fontFamily: 'Newsreader', fontSize: 34, letterSpacing: '-0.5px' }, [
        el('span', { color: COLORS.ink }, 'Julien Brionne'),
        el('span', { color: COLORS.ochre }, '.'),
      ]),

      // Le cœur : méta éventuelle, titre serif, description.
      el(
        'div',
        { display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', paddingBottom: 24 },
        [
          meta
            ? el(
                'div',
                {
                  fontSize: 21,
                  fontWeight: 500,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  color: COLORS.dim,
                  marginBottom: 26,
                },
                meta
              )
            : null,
          el(
            'div',
            {
              fontFamily: 'Newsreader',
              fontSize: corps,
              lineHeight: 1.12,
              letterSpacing: '-1px',
              color: COLORS.ink,
              maxWidth: 980,
              lineClamp: 3,
            },
            title
          ),
          description
            ? el(
                'div',
                {
                  fontSize: 27,
                  lineHeight: 1.5,
                  color: COLORS.dim,
                  marginTop: 28,
                  maxWidth: 900,
                  lineClamp: 3,
                },
                description
              )
            : null,
        ]
      ),

      // Pied : le domaine, rien d'autre.
      el('div', { fontSize: 23, color: COLORS.dim }, 'julien-brionne.fr'),
    ]
  );
}

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) return new Response('Not Found', { status: 404 });

  const cleanSlug = slug.replace(/\.webp$/, '');
  let title = '';
  let description = '';
  let meta: string | undefined;

  if (cleanSlug.startsWith('article-')) {
    const articleSlug = cleanSlug.replace('article-', '');
    const articles = await getCollection('articles', ({ data }) => data.draft !== true);
    const article = articles.find((a) => a.slug === articleSlug);
    if (!article) return new Response('Article Not Found', { status: 404 });
    title = String(article.data.title || '');
    description = String(article.data.excerpt || '');
    const cat = article.data.category ? getCategoryLabel(article.data.category) : '';
    const dat = article.data.date ? formatDate(article.data.date) : '';
    meta = cat && dat ? `${cat} · ${dat}` : cat || dat || undefined;
  } else if (cleanSlug.startsWith('page-')) {
    const pageData = staticPages[cleanSlug];
    if (!pageData) return new Response('Page Not Found', { status: 404 });
    title = pageData.title;
    description = pageData.description;
  } else {
    return new Response('Invalid slug format', { status: 400 });
  }

  const svg = await satori(carte(title, description, meta), {
    width: 1200,
    height: 630,
    fonts: FONTS,
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  const webpBuffer = await sharp(png).webp({ quality: 90 }).toBuffer();

  return new Response(webpBuffer, {
    headers: { 'Content-Type': 'image/webp' },
  });
};
