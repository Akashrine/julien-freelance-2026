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
const AUTHOR_JOB_TITLE = 'Senior PM Freelance';

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
    description: 'Senior PM Freelance. Je transforme le care, le support et les ops internes en systèmes produit mesurables. En mission chez Back Market. Ex-Heetch, Wizville, Waalaxy.',
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
      name: 'Diagnostic care & ops',
      description: '2–3 semaines pour identifier pourquoi le care, le support ou les ops internes absorbent des ressources sans résultat. Diagnostic terrain, pas du conseil théorique.',
      provider: { '@id': `${SITE_URL}/#person` },
      url: `${SITE_URL}/approche`,
      serviceType: 'Consulting',
      areaServed: 'FR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Échange 30 min',
      description: '30 minutes pour exposer ta situation care, support ou ops. On voit si une intervention a du sens. Sans engagement.',
      provider: { '@id': `${SITE_URL}/#person` },
      url: SITE_URL,
      serviceType: 'Consulting',
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
    description: 'Intervention produit quand l\'organisation n\'arrive plus à décider. Réflexions, situations de terrain, diagnostic. Trancher, fermer, assumer.',
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
  references: { name: 'Références', url: `${SITE_URL}/references` },
  situations: { name: 'Situations', url: `${SITE_URL}/situations` },
  articles: { name: 'Articles', url: `${SITE_URL}/articles` },
  diagnostic: { name: 'Diagnostic', url: `${SITE_URL}/diagnostic` },
  contact: { name: 'Contact', url: `${SITE_URL}/contact` },
  article: (title: string, url: string) => ({ name: title, url }),
};

/**
 * FAQPage schema for pages with Q&A content
 */
export function getFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * HowTo schema for step-by-step articles
 */
export function getHowToSchema(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * Returns FAQ and HowTo schemas for specific articles
 * Called from the article page template based on slug
 */
export function getArticleExtraSchemas(slug: string): { faqSchema?: object; howToSchema?: object } {
  const schemas: Record<string, { faqSchema?: object; howToSchema?: object }> = {
    'ownership-produit': {
      faqSchema: getFAQSchema([
        {
          question: "Comment savoir si l'ownership est flou dans mon équipe ?",
          answer: "Trois indicateurs : les décisions produit prennent plus d'une semaine sans raison technique, des sujets importants (backoffice, outils internes, care) n'ont pas de PM identifié, et les stakeholders ne savent pas qui contacter pour une question produit.",
        },
        {
          question: "Faut-il un PM dédié aux outils internes ?",
          answer: "Si les outils internes occupent moins de 20% du temps d'un PM existant, un ownership partagé suffit. Au-delà, un PM dédié est nécessaire. Dans la plupart des scale-ups au-delà de 80 personnes, les outils internes justifient un PM à temps plein.",
        },
        {
          question: "À quelle fréquence revoir la matrice d'ownership ?",
          answer: "Chaque trimestre au minimum. Et à chaque changement structurel : arrivée ou départ d'un PM, réorganisation des squads engineering, lancement d'un nouveau produit.",
        },
        {
          question: "L'ownership produit, c'est pareil que l'organigramme ?",
          answer: "Non. L'organigramme dit qui reporte à qui. L'ownership dit qui décide quoi. Un PM IC est owner d'un périmètre stratégique sans avoir de report direct.",
        },
      ]),
      howToSchema: getHowToSchema(
        "Comment poser l'ownership produit en scale-up",
        "Méthode en 3 étapes pour clarifier qui décide quoi dans une équipe produit en croissance.",
        [
          { name: "Cartographier ce qui existe", text: "Réunir l'équipe et poser deux questions : 'explique ton périmètre à un nouveau PM' et 'quel sujet n'est dans le périmètre de personne'. La première révèle les chevauchements, la deuxième les angles morts." },
          { name: "Poser les périmètres par outcome", text: "Remplacer les périmètres par feature (PM Search, PM Checkout) par des périmètres par parcours utilisateur (PM Discovery to Purchase, PM Post-Purchase Experience). Ce recadrage force à couvrir les zones grises." },
          { name: "Rendre l'ownership visible", text: "Créer un tableau simple avec trois colonnes : périmètre, PM owner, stakeholders principaux. Le partager à toute l'entreprise. Le critère de succès : n'importe qui sait qui contacter en moins de 30 secondes." },
        ]
      ),
    },
    'backoffice-legacy-scale-up': {
      faqSchema: getFAQSchema([
        {
          question: "Comment savoir s'il faut refondre ou patcher un backoffice legacy ?",
          answer: "Trois critères : le modèle de données est-il encore viable, combien de process critiques dépendent de l'outil, et as-tu un PM owner dédié. Si le modèle est dépassé et que 15+ process passent par l'outil, la refonte a du sens.",
        },
        {
          question: "Combien de temps prend une refonte de backoffice ?",
          answer: "Une refonte big-bang prend 6+ mois et échoue souvent. L'approche par workflow (shadow 2 semaines + MVP sur le workflow critique en 2 semaines) donne des résultats mesurables en 1 mois.",
        },
        {
          question: "Faut-il un PM dédié pour refondre un backoffice ?",
          answer: "Oui. Une refonte de backoffice sans PM owner dédié échoue systématiquement. Ce n'est pas un side project. C'est un produit interne avec des utilisateurs et des arbitrages quotidiens.",
        },
      ]),
      howToSchema: getHowToSchema(
        "Comment mener une refonte de backoffice sans y passer 6 mois",
        "Méthode terrain pour refondre un backoffice legacy par workflow, en commençant par le plus coûteux.",
        [
          { name: "Shadow et cartographie (semaine 1-2)", text: "Passer 2 jours à observer les ops utiliser l'outil. Noter chaque clic inutile, chaque copier-coller. Identifier les 5 actions les plus fréquentes et mesurer le temps réel. Cartographier les workarounds." },
          { name: "MVP interne sur le workflow critique (semaine 3-4)", text: "Choisir le workflow qui coûte le plus cher en temps humain. Refondre uniquement celui-là. Livrer un premier écran en 2 semaines à côté de l'ancien outil. Mesurer le delta de temps." },
          { name: "Itérer par workflow", text: "Utiliser les résultats du premier workflow comme business case pour prioriser les suivants. Chaque itération suit le même cycle : observer, refondre un workflow, mesurer." },
        ]
      ),
    },
    'aligner-product-ops-engineering': {
      faqSchema: getFAQSchema([
        {
          question: "Comment aligner Product, Ops et Engineering en scale-up ?",
          answer: "Trois mécanismes : un objectif commun que les trois équipes partagent, un rituel hebdomadaire de friction (pas de synchronisation) qui expose les blocages, et un PM senior à l'intersection qui traduit entre les trois logiques.",
        },
        {
          question: "Pourquoi Product et Ops se désalignent en croissance ?",
          answer: "Parce que leurs incentives divergent. Product raisonne en quarters et métriques produit, Ops raisonne en temps réel et SLAs. Sans mécanisme d'arbitrage commun, chaque équipe optimise son silo.",
        },
        {
          question: "Un Project Manager suffit-il pour aligner les équipes ?",
          answer: "Non. Un PM ou Program Manager qui facilite sans autorité de décision ne résout rien. Le problème n'est pas la coordination, c'est l'absence d'arbitrage. Il faut quelqu'un qui tranche.",
        },
      ]),
    },
    'care-territoire-produit': {
      faqSchema: getFAQSchema([
        {
          question: "Pourquoi le care a besoin d'un PM dédié ?",
          answer: "Le care absorbe tout ce que le produit n'a pas tranché. Chaque edge case non géré devient une règle manuelle. Sans PM pour capter ces signaux et les transformer en specs, le care accumule de la dette silencieuse qui coûte en temps humain et en turnover.",
        },
        {
          question: "À partir de quel volume faut-il un PM care ?",
          answer: "Dès que le volume dépasse 200 tickets/jour, un PM à temps plein est nécessaire. En dessous, un ownership partagé avec du temps explicitement alloué suffit.",
        },
        {
          question: "Que faut-il automatiser dans le care ?",
          answer: "Les décisions répétitives des agents, pas les interactions client. Si un agent applique la même règle 200 fois par jour (rembourser si retard > 15 min), cette règle doit être dans le code, pas dans la tête de l'agent.",
        },
        {
          question: "Le care est-il un centre de coûts ou un territoire produit ?",
          answer: "C'est un territoire produit. Chaque ticket est un signal. Chaque workaround d'agent est un besoin non couvert. Traiter le care comme un centre de coûts revient à payer 3x plus en compensation humaine qu'en structuration produit.",
        },
      ]),
    },
    'art-du-non': {
      faqSchema: getFAQSchema([
        {
          question: "C'est quoi l'Art du Non en produit ?",
          answer: "C'est la capacité d'un CPO ou Head of Product à refuser les demandes qui ne servent pas la stratégie, même sous pression commerciale. Dire non protège la cohérence du système, pas le backlog.",
        },
        {
          question: "Quels sont les trois types de non en produit ?",
          answer: "Le non stratégique (l'idée ne sert pas la trajectoire définie), le non opportuniste (la demande vient d'un cas ponctuel, pas d'un problème récurrent), et le non structurel (l'équipe est saturée, dire oui détruirait même les bonnes idées).",
        },
        {
          question: "Qu'est-ce qu'un Kill Meeting ?",
          answer: "Un rituel où l'équipe produit décide quoi arrêter : projets stagnants, features inutilisées, paris jamais assumés. L'objectif n'est pas de critiquer, mais de clarifier ce qui ne sert plus la vision pour libérer de l'énergie sur ce qui compte.",
        },
        {
          question: "Comment dire non à un deal commercial sans bloquer le business ?",
          answer: "En reformulant la question : 'Oui, c'est faisable. Pour le faire maintenant, il faudra déprioriser X qui sert 80% de nos clients. Souhaitons-nous réellement faire passer l'ensemble de la base après une demande unique ?' Ça oblige l'organisation à regarder ses propres priorités.",
        },
      ]),
    },
    'structurer-equipe-produit-scale-up': {
      faqSchema: getFAQSchema([
        {
          question: "Par où commencer pour structurer une équipe produit en scale-up ?",
          answer: "Par l'écoute. Les 3 premières semaines servent à comprendre ce qui casse réellement via des one-on-ones, du shadow des rituels existants, et une cartographie des sujets sans owner. Ensuite seulement on pose l'ownership, puis les mécanismes de décision.",
        },
        {
          question: "Combien de temps faut-il pour structurer une équipe produit ?",
          answer: "Le socle se pose en 90 jours : 3 semaines de diagnostic, 5 semaines pour poser l'ownership, 4 semaines pour installer les mécanismes de décision. C'est le minimum pour que les décisions tiennent. L'optimisation vient après.",
        },
        {
          question: "Faut-il changer l'organigramme pour structurer l'équipe produit ?",
          answer: "Non. L'organigramme dit qui reporte à qui. Ce qui manque, c'est une matrice d'ownership : qui décide quoi. Changer l'organigramme sans poser l'ownership crée un chaos neuf, pas de la clarté.",
        },
        {
          question: "Quel framework produit utiliser en scale-up ?",
          answer: "Aucun en copier-coller. Scrum, Shape Up, OKRs ont chacun leur valeur, mais aucun ne fonctionne si l'ownership n'est pas clair. Le framework est un outil de lecture, pas une recette. La priorité est le cadre de décision, pas la méthodologie.",
        },
      ]),
      howToSchema: getHowToSchema(
        "Comment structurer une équipe produit en scale-up en 90 jours",
        "Séquence en 3 phases pour poser une structure produit quand la croissance a dépassé l'organisation.",
        [
          { name: "Écouter et cartographier (semaines 1-3)", text: "One-on-ones avec chaque PM, lead engineering et stakeholder clé. Shadow des rituels existants. Cartographie des sujets sans owner (outils internes, care, backoffice)." },
          { name: "Poser l'ownership (semaines 4-8)", text: "Redécouper les périmètres par outcome (pas par feature). Nommer un owner explicite sur chaque zone morte identifiée. Rendre l'ownership visible à toute l'entreprise via un tableau simple." },
          { name: "Installer les mécanismes de décision (semaines 9-12)", text: "Async par défaut (one-pager par initiative). Chaque réunion produit une décision écrite (décision, owner, deadline). Un rituel de friction hebdomadaire pour exposer les blocages inter-équipes." },
        ]
      ),
    },
  };

  return schemas[slug] || {};
}

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
