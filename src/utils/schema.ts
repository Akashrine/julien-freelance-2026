/**
 * Schema.org JSON-LD du site.
 *
 * Identité : Julien Brionne, Product Lead freelance (site-architecture.md,
 * 11/10/2026). Un seul Service déclaré : La Mise au clair. Porter un sujet
 * pendant plusieurs mois est une manière de travailler, pas un Service nommé.
 * Aucun prix, aucune note, aucun avis, aucun résultat client.
 */

const SITE_URL = 'https://www.julien-brionne.fr';
import { MISE_AU_CLAIR } from './offres';
const AUTHOR_NAME = 'Julien Brionne';
export const AUTHOR_JOB_TITLE = 'Product Lead freelance';
export const AUTHOR_DESCRIPTION =
  "Product Lead freelance, quinze ans dans le produit. Stratégie, discovery, delivery et mesure, de la compréhension du problème jusqu’aux résultats.";

/**
 * Person schema for the author.
 * `@id` partagé : les autres schémas y renvoient au lieu de redéclarer la personne.
 */
export function getPersonSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    jobTitle: AUTHOR_JOB_TITLE,
    url: SITE_URL,
    description: AUTHOR_DESCRIPTION,
    // Les terrains publiés sur /ce-que-je-fais et /a-propos, et le geste.
    knowsAbout: [
      'Product management',
      'Décision produit',
      'Discovery et delivery produit',
      'Customer Care et support',
      'Plateformes et outils internes',
      'E-commerce et checkout',
      'Mesure produit et data',
    ],
    knowsLanguage: 'fr-FR',
    areaServed: { '@type': 'Country', name: 'France' },
    sameAs: [
      'https://www.linkedin.com/in/julienbrionne',
      'https://produitsansfiltre.substack.com',
    ],
  };
}

/**
 * La Mise au clair, seule intervention déclarée. Descriptif seulement.
 */
export function getServiceSchemas(): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: MISE_AU_CLAIR.nom,
      description: `${MISE_AU_CLAIR.format}. ${MISE_AU_CLAIR.resultat}`,
      provider: { '@id': `${SITE_URL}/#person` },
      url: `${SITE_URL}${MISE_AU_CLAIR.ancre}`,
      serviceType: 'Product management',
      areaServed: 'FR',
    },
  ];
}

/**
 * WebSite schema, posé sur l'accueil.
 */
export function getWebsiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Julien Brionne',
    url: SITE_URL,
    description: AUTHOR_DESCRIPTION,
    author: { '@id': `${SITE_URL}/#person` },
    inLanguage: 'fr',
  };
}

/**
 * WebPage schema for editorial pages
 * Used on the editorial pages
 * 
 * @param url - Full URL of the page
 * @param title - Page title
 * @param description - Page description
 * @param about - Main topic/concept of the page (optional, for semantic clarity)
 */
export function getWebPageSchema(
  url: string,
  title: string,
  description: string,
  about?: string | string[]
): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    name: title,
    description,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
    inLanguage: 'fr',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Julien Brionne',
      url: SITE_URL,
    },
  };

  // Add 'about' if provided (for semantic clarity, not SEO keywords)
  if (about) {
    schema.about = Array.isArray(about) ? about : [about];
  }

  return schema;
}

/**
 * Article schema for MDX articles
 * Used on individual article pages
 * 
 * @param url - Full URL of the article
 * @param headline - Article title
 * @param description - Article excerpt
 * @param datePublished - Publication date (ISO format: YYYY-MM-DD)
 * @param dateModified - Last modification date (ISO format: YYYY-MM-DD, defaults to datePublished)
 * @param about - Main concepts/topics covered in the article (optional)
 * @param imageUrl - Article thumbnail URL (optional)
 */
export function getArticleSchema(
  url: string,
  headline: string,
  description: string,
  datePublished: string,
  dateModified?: string,
  about?: string | string[],
  imageUrl?: string
): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: 'fr',
  };

  // Add 'about' if provided (for semantic clarity, not SEO keywords)
  if (about) {
    schema.about = Array.isArray(about) ? about : [about];
  }

  // Add image if provided
  if (imageUrl) {
    schema.image = {
      '@type': 'ImageObject',
      url: imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`,
    };
  }

  return schema;
}

/**
 * BreadcrumbList schema for navigation structure
 * Used on all pages except Home
 * 
 * @param items - Array of { name, url } objects representing the breadcrumb path
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Helper to generate breadcrumb items for common page types
 */
// `approche`, `references` et `contact` ont été retirées le 18/09 : ces trois
// URL ne sont plus que des redirections 301, et déclarer une URL qui redirige
// dans un fil d'Ariane apprend au moteur un chemin qui n'existe plus. Aucune
// page ne les utilisait.
export const BreadcrumbItems = {
  home: { name: 'Accueil', url: SITE_URL },
  ceQueJeFais: { name: 'Ce que je fais', url: `${SITE_URL}/ce-que-je-fais` },
  aPropos: { name: 'Parcours', url: `${SITE_URL}/a-propos` },
  ecrits: { name: 'Écrits', url: `${SITE_URL}/ecrits` },
  article: (title: string, url: string) => ({ name: title, url }),
};

/**
 * ItemList schema for structured lists (e.g. references)
 */
export function getItemListSchema(
  items: Array<{ name: string; description: string; position: number }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      description: item.description,
    })),
  };
}
