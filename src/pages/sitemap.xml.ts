import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', ({ data }) => {
    return data.draft !== true;
  });

  const siteUrl = 'https://julien-brionne.fr';
  const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  // Pages statiques
  const staticPages = [
    {
      url: `${siteUrl}/`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '1.0',
    },
    {
      url: `${siteUrl}/approche`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9',
    },
    {
      url: `${siteUrl}/situations`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9',
    },
    {
      url: `${siteUrl}/articles`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      url: `${siteUrl}/diagnostic`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8',
    },
  ];

  // Articles dynamiques
  const articlePages = articles.map((article) => {
    const articleDate = new Date(article.data.date).toISOString().split('T')[0];
    return {
      url: `${siteUrl}/articles/${article.slug}`,
      lastmod: articleDate,
      changefreq: 'yearly',
      priority: '0.8',
    };
  });

  // Combiner toutes les pages
  const allPages = [...staticPages, ...articlePages];

  // Générer le XML
  const sitemapItems = allPages.map((page) => {
    return `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapItems}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
