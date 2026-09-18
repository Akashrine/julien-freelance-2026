/**
 * Schema.org utilities for editorial / thought leadership website
 * 
 * This module provides reusable functions to generate Schema.org JSON-LD
 * schemas aligned with an editorial positioning, not a service marketplace.
 * 
 * Principles:
 * - No transactional schemas (ProfessionalService, Offer, Service)
 * - No commercial signals (reviews, ratings, offers)
 * - Focus on editorial credibility (Person, Article, WebPage)
 * - Minimal and semantic, not SEO spam
 */

const SITE_URL = 'https://www.julien-brionne.fr';
import { MISE_AU_CLAIR, COPILOTE } from './offres';
const AUTHOR_NAME = 'Julien Brionne';
const AUTHOR_JOB_TITLE = 'Senior Product Manager freelance';

/**
 * Person schema for the author
 * Used on the Home page to establish author identity
 */
export function getPersonSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    jobTitle: AUTHOR_JOB_TITLE,
    url: SITE_URL,
    description: "Senior Product Manager freelance. Je reprends les sujets produit importants qui n'avancent plus et je les mène jusqu'en production.",
    // `knowsAbout` dit à un moteur génératif sur quoi cette personne fait
    // autorité. Sans lui, il doit le déduire du corps des pages. Les sujets
    // listés sont ceux que les douze articles couvrent réellement.
    knowsAbout: [
      'Product management',
      'Organisation produit en scale-up',
      'Ownership produit',
      'Priorisation et arbitrage produit',
      "Structuration d'équipe produit",
      'Activation et rétention en self-serve',
      'Produit B2B SaaS',
      'Expérience client et parcours grand public',
      'Alignement Product, Ops et Engineering',
      'Support client comme territoire produit',
      'Backoffice et outils internes',
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
 * Service schemas for the Home page
 * Descriptive only — no pricing, no offers, no commercial signals
 */
export function getServiceSchemas(): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: MISE_AU_CLAIR.nom,
      description: `${MISE_AU_CLAIR.format}. ${MISE_AU_CLAIR.resultat}`,
      provider: { '@id': `${SITE_URL}/#person` },
      url: `${SITE_URL}/ce-que-je-fais#la-mise-au-clair`,
      serviceType: 'Product management',
      areaServed: 'FR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: COPILOTE.nom,
      description: `${COPILOTE.format} pour faire sortir un MVP qui ne sort pas, avec la méthode que l'équipe garde après mon départ.`,
      provider: { '@id': `${SITE_URL}/#person` },
      url: `${SITE_URL}/ce-que-je-fais#le-copilote`,
      serviceType: 'Product management',
      areaServed: 'FR',
    },
  ];
}

/**
 * WebSite schema for the site structure
 * Used on the Home page to describe the site globally
 */
export function getWebsiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Julien Brionne',
    url: SITE_URL,
    description: "Je reprends les sujets produit importants qui n'avancent plus. On vérifie, on tranche, puis seulement on construit.",
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
    inLanguage: 'fr',
  };
}

/**
 * WebPage schema for editorial pages
 * Used on pages like Approche, Situations, Diagnostic, Articles listing
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
  ecrits: { name: 'Écrits', url: `${SITE_URL}/ecrits` },
  ressources: { name: 'Ressources', url: `${SITE_URL}/ressources` },
  situations: { name: 'Situations', url: `${SITE_URL}/situations` },
  articles: { name: 'Articles', url: `${SITE_URL}/articles` },
  diagnostic: { name: 'Diagnostic', url: `${SITE_URL}/diagnostic` },
  pme: { name: 'PM freelance en PME', url: `${SITE_URL}/product-manager-freelance-pme` },
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
