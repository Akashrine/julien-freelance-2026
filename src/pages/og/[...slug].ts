import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import sharp from 'sharp';

// Configuration des couleurs du site
const colors = {
  ivory: [253, 252, 251] as [number, number, number],      // #FDFCFB
  graphite: [18, 18, 18] as [number, number, number],     // #121212
  sand: [242, 233, 225] as [number, number, number],       // #F2E9E1
  softgray: [154, 139, 122] as [number, number, number],  // #9A8B7A
  clay: [229, 186, 173] as [number, number, number],      // #E5BAAD
};

// Configuration des pages statiques avec leurs métadonnées OG
const staticPages: Record<string, { title: string; description: string }> = {
  'page-home': {
    title: "Simplifier pour retrouver de l'impact",
    description: "Quand le produit avance, que la roadmap se remplit, mais que chaque décision coûte plus cher que la précédente. Le problème n'est pas l'exécution. C'est la dette de décision.",
  },
  'page-approche': {
    title: 'Leadership opérationnel',
    description: "Une approche d'intervention, pas une méthode. Restaurer la clarté et la capacité de décision là où le système est devenu trop bruyant.",
  },
  'page-situations': {
    title: 'Reconnaître le moment critique',
    description: "Quand l'effort augmente plus vite que l'impact, quand chaque avancée coûte deux fois plus d'énergie. Symptôme de saturation du système décisionnel.",
  },
  'page-diagnostic': {
    title: 'Une pause pour vérifier le cap',
    description: 'Intervention courte pour comprendre ce qui se passe réellement dans votre organisation produit. Regard extérieur sur les blocages structurels.',
  },
  'page-articles': {
    title: "L'écrit comme outil de lecture",
    description: "Réflexions et analyses de cas. Des textes pour clarifier le raisonnement avant d'agir, pas des guides méthodologiques.",
  },
};

export async function getStaticPaths() {
  const paths: Array<{ params: { slug: string } }> = [];

  // Ajouter les pages statiques (uniquement avec extension .webp)
  Object.keys(staticPages).forEach((pageSlug) => {
    paths.push({ params: { slug: `${pageSlug}.webp` } });
  });

  // Ajouter les articles (uniquement avec extension .webp)
  const articles = await getCollection('articles', ({ data }) => {
    return data.draft !== true;
  });

  articles.forEach((article) => {
    paths.push({ params: { slug: `article-${article.slug}.webp` } });
  });

  return paths;
}

// Fonction pour formater la date en français
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Fonction pour obtenir le label de catégorie
function getCategoryLabel(category: string): string {
  return category === 'reflexion' ? 'Réflexion' : 'Analyse';
}

// Fonction pour échapper le texte pour SVG
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Fonction pour générer le SVG
function generateOGSVG(title: string, category?: string, date?: string): string {
  const categoryLabel = category ? getCategoryLabel(category) : '';
  const formattedDate = date ? formatDate(date) : '';
  const metaText = category && date ? `${categoryLabel} · ${formattedDate}` : '';

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title {
      font-family: Inter, sans-serif;
      font-weight: 700;
      font-size: 64px;
      line-height: 1.15;
      fill: #0F172A;
    }
    .meta {
      font-family: Inter, sans-serif;
      font-weight: 400;
      font-size: 28px;
      fill: #475569;
    }
    .signature {
      font-family: Inter, sans-serif;
      font-weight: 400;
      font-size: 22px;
      fill: #94A3B8;
    }
  </style>

  <rect width="100%" height="100%" fill="#F8FAFC"/>

  <text x="80" y="200" class="title">
    ${escapeXml(title)}
  </text>

  ${metaText ? `<text x="80" y="280" class="meta">
    ${escapeXml(metaText)}
  </text>

  <line x1="80" y1="320" x2="240" y2="320" stroke="#CBD5E1" stroke-width="2"/>` : ''}

  <text x="80" y="560" class="signature">
    julien-brionne.fr
  </text>

</svg>`;
}

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response('Not Found', { status: 404 });
  }

  // Retirer l'extension .webp si présente
  const cleanSlug = slug.replace(/\.webp$/, '');

  let title = '';
  let category: string | undefined;
  let date: string | undefined;

  // Vérifier si c'est un article
  if (cleanSlug.startsWith('article-')) {
    const articleSlug = cleanSlug.replace('article-', '');
    const articles = await getCollection('articles', ({ data }) => {
      return data.draft !== true;
    });
    
    const article = articles.find((a) => a.slug === articleSlug);
    if (article) {
      title = String(article.data.title || '');
      category = article.data.category;
      date = article.data.date;
    } else {
      return new Response('Article Not Found', { status: 404 });
    }
  }
  // Vérifier si c'est une page statique
  else if (cleanSlug.startsWith('page-')) {
    const pageData = staticPages[cleanSlug];
    if (pageData) {
      title = String(pageData.title);
      // Pas de catégorie ni date pour les pages statiques
    } else {
      return new Response('Page Not Found', { status: 404 });
    }
  } else {
    return new Response('Invalid slug format', { status: 400 });
  }

  // Générer le SVG
  const svg = generateOGSVG(title, category, date);

  // Convertir le SVG en WebP avec sharp
  const webpBuffer = await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toBuffer();

  return new Response(webpBuffer, {
    headers: {
      'Content-Type': 'image/webp',
    },
  });
};
