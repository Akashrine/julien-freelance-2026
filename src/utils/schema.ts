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

const SITE_URL = 'https://julien-brionne.fr';
const AUTHOR_NAME = 'Julien Brionne';
const AUTHOR_JOB_TITLE = 'Product Lead Indépendant';

/**
 * Person schema for the author
 * Used on the Home page to establish author identity
 */
export function getPersonSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    jobTitle: AUTHOR_JOB_TITLE,
    url: SITE_URL,
    description: 'Product Lead indépendant. J\'interviens auprès de fondateurs et Heads of Product (Series A/B) quand le système produit a grandi plus vite que sa capacité à trancher.',
    sameAs: [
      'https://www.linkedin.com/in/julienbrionne',
      'https://substack.com/@productcopilot',
    ],
  };
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
    description: 'Réflexions et analyses de cas sur le produit, la décision et l\'organisation.',
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
export const BreadcrumbItems = {
  home: { name: 'Accueil', url: SITE_URL },
  approche: { name: 'Mon approche', url: `${SITE_URL}/approche` },
  situations: { name: 'Vos situations', url: `${SITE_URL}/situations` },
  articles: { name: 'Articles', url: `${SITE_URL}/articles` },
  diagnostic: { name: 'Diagnostic', url: `${SITE_URL}/diagnostic` },
  article: (title: string, url: string) => ({ name: title, url }),
};
