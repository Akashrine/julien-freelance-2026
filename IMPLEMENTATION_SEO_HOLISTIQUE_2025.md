# Implémentation SEO holistique 2025 — Product Lead Indépendant

**Stratégie :** Niche d'autorité (Product Lead / Fractional Head of Product) + branding haute posture + requêtes à haute intention (SaaS, Series A/B, audit roadmap).  
**Positionnement conservé :** Leadership par substitution, trancher / fermer / assumer — pas de vente de clarté, méthode ou accompagnement.  
**Objectif :** Modifications et conseils exécutables, sans sacrifier la qualité de lecture ni l’esthétique minimaliste.

---

## 1. Sémantique & hiérarchie HTML

### 1.1 H1 Home — Ciblage requêtes d’autorité

**État actuel :**  
- `Hero.astro` : H1 = « Simplifier pour retrouver de l’impact. »  
- Label au-dessus : « [ PRODUCT LEAD INDÉPENDANT ] »

**Recommandation :**  
- **H1 unique** (pour SEO et accessibilité) : **« Product Lead Indépendant & Fractional Head of Product »**.  
- Conserver la phrase de marque en **H2** (ou bloc sémantique équivalent) : « Simplifier pour retrouver de l’impact. »  
- Garder les deux paragraphes et le CTA tels quels.

**Implémentation :**

| Fichier | Modification |
|--------|---------------|
| `src/components/Hero.astro` | Remplacer le contenu du `<h1>` par « Product Lead Indépendant & Fractional Head of Product » (éventuellement avec `<br>` pour le retour à la ligne sur desktop). Ajouter immédiatement après un `<h2>` ou un `<p>` avec classe type « hero-payoff » contenant « Simplifier pour retrouver de l’impact. » |

**Hiérarchie globale à respecter :**

- **Home** : 1 seul H1 (Product Lead & Fractional Head of Product), puis H2 pour les sections (ex. Intro « 01 / CONTEXTE » peut rester en label + paragraphe sans H2 si la section n’a pas de titre sémantique ; sinon prévoir un H2 court).
- **Approche, Situations, Diagnostic, Articles (listing)** : 1 H1 par page (déjà le cas).
- **Article (MDX)** : 1 H1 = titre de l’article ; H2/H3 issus des composants `Section`, `ColorBlock`, etc. (déjà cohérent).

**Vérification :** S’assurer qu’aucune page ne contient deux H1. Les composants `Section.astro`, `ColorBlock.astro`, etc. utilisent déjà `<h2>` et `<h3>`.

---

## 2. Métadonnées dynamiques (Title & Meta description)

**Règles :**  
- **Title :** ≤ 60 caractères (idéal 50–58).  
- **Meta description :** ≤ 155 caractères (idéal 150–155).  
- Mots-clés **sémantiques** (expertise produit, pilotage stratégique, scaling SaaS, audit roadmap, décision produit) plutôt que bourrage de mots-clés.

### 2.1 Tableau par page

| Page | Title (≤60 car.) | Meta description (≤155 car.) |
|------|-------------------|------------------------------|
| **Home** | Julien Brionne — Product Lead & Fractional Head of Product | Product Lead indépendant. Expertise produit et pilotage stratégique pour fondateurs et Heads of Product (SaaS, Series A/B). Quand le système n’arrive plus à trancher. |
| **Approche** | Approche — Product Lead Indépendant \| Julien Brionne | Leadership opérationnel : intervention terrain, arbitrages, décisions impopulaires. Pas une méthode. Scaling produit Series A/B. |
| **Situations** | Situations produit — Moment critique \| Julien Brionne | Quand l’effort dépasse l’impact et que personne n’ose trancher. Vision décorative, roadmap réactive, PMs éponges. |
| **Diagnostic** | Diagnostic situation produit — Julien Brionne | Intervention courte 2–3 semaines : pourquoi les décisions ne tiennent pas. Mettre sur la table les tensions. Aucune garantie de suite. |
| **Articles (listing)** | Articles — Réflexions produit \| Julien Brionne | Réflexions et analyses de cas produit. Trancher le raisonnement avant d’agir. Pas des guides méthodologiques. |
| **Article (dynamique)** | {titre article} — Julien Brionne | Utiliser `article.data.excerpt` ; si > 155 car., tronquer proprement (phrase complète) côté `[...slug].astro`. |

### 2.2 Implémentation technique

- **Pages statiques** (`index.astro`, `approche.astro`, `situations.astro`, `diagnostic.astro`, `articles.astro`) : passer les valeurs du tableau en props `title` et `description` du `Layout`.  
- **Article** : dans `src/pages/articles/[...slug].astro`, définir une variable `metaDescription` = `article.data.excerpt` ; si `metaDescription.length > 155`, faire `metaDescription = excerpt.slice(0, 152).trim() + '…'` (ou couper au dernier espace). Passer `metaDescription` au `Layout` en `description`.  
- **OG / Twitter** : réutiliser les mêmes titres et descriptions (ou variantes courtes pour OG si besoin) pour cohérence.

---

## 3. Structured Data (Schema.org) — E-E-A-T

### 3.1 État actuel

- **Home** : `Person` + `WebSite` (déjà en place).  
- **Articles** : `Article` + `BreadcrumbList` (déjà en place).  
- **Autres pages** : `WebPage` + `BreadcrumbList`.

### 3.2 Ajouts recommandés

**3.2.1 Schema `Service` sur la Home (sans en faire une page « catalogue »)**

Objectif : renforcer l’autorité et l’intention (session stratégique, diagnostic) sans promesse commerciale.

- **Type :** `Service`.  
- **Propriétés minimales :**  
  - `name` : « Session stratégique produit » (ou « Diagnostic de situation produit » si on décide de mettre en avant le diagnostic).  
  - `description` : 1–2 phrases factuelles (ex. « Échange de 30 minutes pour exposer une situation produit et voir si une intervention peut être utile. »).  
  - `provider` : référence au `Person` (même `@id` si on donne un `@id` au Person).  
  - `url` : `https://julien-brionne.fr` ou URL de la page contact / CTA (ex. lien Lemcal si pertinent).  
- **Emplacement :** dans `src/utils/schema.ts`, ajouter une fonction `getServiceSchema()` (ou deux : une pour « Session stratégique », une pour « Diagnostic ») et injecter le script JSON-LD sur la Home uniquement, à côté de `Person` et `WebSite`.

**3.2.2 Person avec `@id` (optionnel mais utile pour lier Service)**

- Dans `getPersonSchema()`, ajouter `"@id": "https://julien-brionne.fr/#person"` (ou une URL stable).  
- Dans le `Service`, mettre `"provider": { "@id": "https://julien-brionne.fr/#person" }`.

**3.2.3 Article — Enrichissement E-E-A-T**

- S’assurer que chaque article a bien `author` (Person), `datePublished`, `dateModified` (au moins égal à `datePublished`), `publisher`.  
- Option : ajouter un champ `about` (tableau de concepts) par article dans le frontmatter MDX et le passer à `getArticleSchema()` pour renforcer la sémantique (sans sur-optimiser).

**3.2.4 Pas de changement de philosophie**

- Ne pas ajouter `Offer`, `AggregateRating`, `Review` ni promesses commerciales dans les schémas.  
- Le `Service` reste descriptif (ce qu’est l’échange / le diagnostic), pas une offre tarifée.

---

## 4. Performance & Core Web Vitals (objectif 95+ Mobile/Desktop)

### 4.1 Polices

- **Actuel :** Google Fonts (CSS externe) + `preconnect` dans `Layout.astro` ; `@font-face` avec `font-display: swap` dans `global.css`.  
- **Recommandations :**  
  - Conserver `font-display: swap` pour toutes les polices.  
  - Option avancée : auto-héberger les fichiers woff2 (Inter, Playfair Display, JetBrains Mono) et les servir en préload pour les caractères above-the-fold ; à évaluer selon gain réel (LCP) vs complexité.  
  - Si on reste sur Google Fonts : garder `preconnect` + un seul `<link rel="stylesheet">` (pas de preload de woff2 vers gstatic qui peut 404).

### 4.2 JavaScript

- **Actuel :** Scripts inline dans `Layout.astro` (reveal, section-fade, parallax blobs), `Navbar.astro` (menu mobile), `ArticlesList.astro` (filtres), `ReadingProgress.astro`.  
- **Recommandations :**  
  - Astro bundle déjà minimal (peu ou pas de framework client lourd).  
  - Différer l’exécution non critique : pour les animations « reveal », on peut garder un petit script inline mais s’assurer qu’il ne bloque pas le premier rendu (pas de `document.write`, chargement async si script externe).  
  - Si un script est volumineux, le sortir en `.ts` et l’importer en `client:visible` ou `client:idle` pour qu’il se charge après le LCP.  
  - Vérifier qu’aucun script inutile n’est chargé sur les pages articles (ex. filtres uniquement sur la liste d’articles).

### 4.3 Images

- Déjà en place : dimensions explicites, `loading="lazy"` sur les vignettes, `fetchpriority="high"` sur l’image hero.  
- S’assurer que toutes les images de contenu ont `width`/`height` et un `alt` pertinent pour éviter le CLS.

### 4.4 Checklist rapide

- [ ] LCP < 2,5 s (image hero + polices).  
- [ ] INP / FID < 100 ms (peu d’JS interactif).  
- [ ] CLS < 0,1 (dimensions images, pas de contenu injecté qui décale la mise en page).  
- [ ] Tester avec Lighthouse (Mobile + Desktop) et PageSpeed Insights après chaque grosse modification.

---

## 5. Refonte section Articles (acquisition + conversion)

### 5.1 Table des matières (TOC) cliquable

- **Condition d’affichage :** uniquement si le contenu dépasse environ 1 500 mots (ou un seuil configurable).  
- **Contenu :** liens d’ancrage vers les titres H2 (et optionnellement H3) du corps de l’article.  
- **Implémentation :**  
  - **Option A (recommandée)** : extraire les headings au build avec un plugin Remark/Rehype qui parcourt le MDX et expose une liste `headings: { id, text, depth }[]` (ex. `remark-heading-id` + custom plugin). Passer `headings` en prop au layout d’article et afficher une `TableOfContents.astro` dans une colonne latérale ou en haut sur mobile.  
  - **Option B** : en frontmatter, ajouter un champ `toc: { title: string, id: string }[]` rempli manuellement ou par un script au moment de la rédaction.  
- **Design :** liste compacte, police mono ou discrète, ancres `#section-id`. Pas de surcharge visuelle ; la TOC doit rester « invisible » comme élément de confort SEO et UX.

**Composant suggéré :** `src/components/articles/TableOfContents.astro`.  
- Props : `headings: { id: string; text: string; depth: number }[]`.  
- Rendu : `<nav aria-label="Table des matières">` avec liens `<a href="#id">` et styles cohérents avec le reste du site.

### 5.2 Zones d’engagement aérées

- Conserver l’espacement actuel entre sections (ex. `mb-32` dans `Section.astro`).  
- Éviter les blocs de texte trop denses : garder des paragraphes courts, des listes, des callouts.  
- Option : insérer un bloc « pause » léger (ex. une citation ou un callout) tous les 3–4 blocs pour aérer sans ajouter de contenu superflu.

### 5.3 Passerelle de conversion en fin d’article

- **Composant :** ex. `ArticleConversionGate.astro`.  
- **Contenu :**  
  - Titre court (ex. « Discuter de votre situation » ou « Session stratégique 30 min »).  
  - Une phrase contextuelle (ex. « Si cette situation résonne avec votre contexte, on peut en discuter. »).  
  - CTA : lien vers la session de 30 min (Lemcal), même URL que le footer.  
  - Style : sobre, même charte que le site (pas de bannière agressive).  
- **Emplacement :** après le dernier bloc de contenu MDX, avant le bloc « Article précédent / suivant » et « Retour aux articles ».  
- **Intégration :** dans `src/pages/articles/[...slug].astro`, insérer `<ArticleConversionGate />` entre `<Content />` et `<ArticleNavigation />`.

---

## 6. Guardrails (vibe & design)

- **Qualité de lecture** : aucune densification de mots-clés dans le corps des textes. Les titres et metas restent naturels et alignés avec le positionnement (trancher, fermer, assumer, leadership opérationnel).  
- **Esthétique** : les ajouts (TOC, CTA fin d’article) doivent respecter le minimalisme (typographies, couleurs, espacements existants).  
- **Composants réutilisables** : TOC et passerelle de conversion sont des composants Astro réutilisables ; les visuels type « frameworks » (schémas, infographies) peuvent être des composants dédiés (ex. dans `src/components/articles/`) pour garder cohérence et maintenabilité.

---

## 7. Récapitulatif des fichiers à créer ou modifier

| Fichier | Action |
|---------|--------|
| `src/components/Hero.astro` | H1 = « Product Lead Indépendant & Fractional Head of Product » ; phrase de marque en H2 ou bloc dédié. |
| `src/pages/index.astro` | Nouveaux `title` et `description` (voir tableau §2.1). |
| `src/pages/approche.astro` | Nouveaux `title` et `description`. |
| `src/pages/situations.astro` | Nouveaux `title` et `description`. |
| `src/pages/diagnostic.astro` | Nouveaux `title` et `description`. |
| `src/pages/articles.astro` | Nouveaux `title` et `description`. |
| `src/pages/articles/[...slug].astro` | Troncature meta description si > 155 car. ; intégration TOC (si headings fournis) ; intégration `ArticleConversionGate`. |
| `src/utils/schema.ts` | `getServiceSchema()` ; optionnel `@id` sur Person ; appel `getServiceSchema()` sur Home. |
| `src/layouts/Layout.astro` | Accepter et injecter `serviceSchema` en JSON-LD si fourni. |
| `src/components/articles/TableOfContents.astro` | **Créer** : TOC cliquable à partir de `headings`. |
| `src/components/articles/ArticleConversionGate.astro` | **Créer** : CTA 30 min en fin d’article. |
| Extraction headings MDX | Plugin Remark ou Rehype (ou frontmatter) pour fournir `headings` au template article. |

---

## 8. Ordre d’exécution suggéré

1. Métadonnées (titres et descriptions) sur toutes les pages.  
2. H1 Home + H2 payoff.  
3. Schema `Service` + `@id` Person sur Home.  
4. Article : troncature description, puis `ArticleConversionGate`, puis TOC (avec extraction des headings).  
5. Audit performance (polices, JS, images) et ajustements si score < 95.

---

*Document prêt pour exécution. Aucune modification automatique ; chaque point peut être implémenté de façon incrémentale en gardant le positionnement et le design actuels.*
