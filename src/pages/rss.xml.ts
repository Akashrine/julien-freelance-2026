import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', ({ data }) => {
    return data.draft !== true;
  });

  // Trier par date décroissante
  const sortedArticles = articles.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  const siteUrl = 'https://julien-brionne.fr';
  
  const rssItems = sortedArticles.map((article) => {
    const articleUrl = `${siteUrl}/articles/${article.slug}`;
    const pubDate = new Date(article.data.date).toUTCString();
    
    return `    <item>
      <title><![CDATA[${article.data.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${article.data.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Julien Brionne — Articles</title>
    <link>${siteUrl}</link>
    <description>Réflexions et analyses de cas sur le produit, la décision et l'organisation.</description>
    <language>fr</language>
    <managingEditor>julien.brionne@gmail.com</managingEditor>
    <webMaster>julien.brionne@gmail.com</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
