# Audit SEO & Growth — julien-brionne.fr

**Date** : 11 avril 2026
**Site** : https://julien-brionne.fr
**Stack** : Astro SSG + Tailwind v4 + MDX
**Branche** : `revue-contenu`

---

## État des lieux

### Pages indexées (sitemap)
| Page | Title | Description | Schema JSON-LD |
|---|---|---|---|
| `/` | Senior PM Freelance — Julien Brionne \| Orga Produit | 155 chars | Person, WebSite, Service x2 |
| `/approche` | Ce que je fais — Julien Brionne, Senior PM Freelance | 155 chars | WebPage, Breadcrumb, FAQ |
| `/references` | Références missions PM — Julien Brionne | 155 chars | WebPage, Breadcrumb, ItemList |
| `/articles` | Articles — Réflexions produit \| Julien Brionne | 155 chars | WebPage, Breadcrumb |
| `/contact` | Contact — Julien Brionne, Senior PM Freelance | 155 chars | WebPage, Breadcrumb |
| 8 articles | Titres individuels — Julien Brionne | Excerpts < 155 chars | Article, Breadcrumb |

### Pages noindex (hors sitemap)
- `/situations` — noindex, follow
- `/diagnostic` — noindex, follow
- `/404` — noindex, follow

---

## 1. SEO CLASSIQUE (Search Engine Optimisation)

### Ce qui est en place ✅
- Title tags < 60 chars, uniques par page
- Meta descriptions < 155 chars, uniques
- Canonical URLs sur toutes les pages
- H1 unique par page
- Sitemap XML auto-généré avec filtre noindex
- Robots.txt propre (Allow/Disallow explicites)
- Images avec alt text (photo hero)
- Google Analytics 4 intégré
- RSS feed (`/rss.xml`)
- Trailing slash cohérent (`never`)
- `compressHTML: true`
- OG images dynamiques (SVG → WebP via Sharp)
- Meta author sur toutes les pages

### Ce qui manque / à améliorer ⚠️

| Priorité | Action | Impact | Effort |
|---|---|---|---|
| **HAUTE** | **Pas de `<h2>` sémantiques dans les composants** — Hero, Intro, Posture, Situations utilisent des `<p>` stylés ou des `<div>`. Google perd la hiérarchie sémantique. Les titres devraient être des `<h2>` et `<h3>`. | SEO on-page fort | 1h |
| **HAUTE** | **Pas de maillage interne structuré depuis la homepage** — La homepage ne linke pas vers `/articles`, `/references` ou `/contact` de façon explicite (hors Navbar). Ajouter des liens contextuels dans le body. | Crawl budget + authority | 30min |
| **HAUTE** | **Pas de `hreflang`** — Le site est en français uniquement. Ajouter `<link rel="alternate" hreflang="fr" href="...">` pour clarifier. | Signal linguistique | 10min |
| **MOYENNE** | **Pas de `lastmod` dans le sitemap** — `@astrojs/sitemap` ne génère pas de dates. Google ne sait pas quand les pages ont été mises à jour. | Freshness signal | 30min |
| **MOYENNE** | **Pas d'image dans les articles** — Les 8 articles n'ont aucune image, illustration ou schéma. Ça impacte le temps de lecture, le scroll depth, et le potentiel de ranking en Google Images. | Engagement + Images SEO | 2-3h |
| **MOYENNE** | **L'image hero est un JPG non-optimisé comme fallback** — `_WOL6954-min.jpg` est le fallback du WebP mais le nom de fichier n'est pas SEO-friendly. Renommer en `julien-brionne-pm-freelance.webp`. | Image SEO | 15min |
| **MOYENNE** | **Pas de page dédiée /a-propos ou /qui-suis-je** — Le contenu "à propos" est dilué entre la homepage et /approche. Une page dédiée ciblerait "julien brionne pm freelance" directement. | Long-tail SEO | 1h |
| **BASSE** | **Favicon.ico + favicon.png + favicon.svg** — Trois formats sans `<link>` pour SVG. Le SVG n'est pas référencé dans le `<head>`. | Marginal | 5min |
| **BASSE** | **Pas de `<meta name="theme-color">`** — Ajouter pour cohérence mobile. | UX mobile | 2min |

---

## 2. GEO (Generative Engine Optimisation)

> Question clé : "Est-ce que ChatGPT/Perplexity recommanderait julien-brionne.fr ?"

### Ce qui est en place ✅
- Contenu clair, factuel, structuré par sections avec labels
- Prose formatée pour la summarisation (paragraphes courts, découpés)
- Schema FAQ sur `/approche` (3 Q&A) — citable par les LLMs
- Schema Article sur chaque article — attribution auteur claire
- Chiffres concrets vérifiables (NPS 3.5→4.1, +8% efficacité, ARR 7M→8.5M)
- Assertions fortes avec point de vue (pas du contenu générique)
- Noms de sociétés vérifiables (Heetch, Back Market, Waalaxy, Wizville)
- Maillage interne entre articles du cocon sémantique

### Ce qui manque / à améliorer ⚠️

| Priorité | Action | Impact GEO | Effort |
|---|---|---|---|
| **HAUTE** | **Pas de FAQ sur les articles** — Seul `/approche` a un schema FAQ. Les 4 articles du cocon (ownership, backoffice, alignement, care) ont du contenu FAQ-compatible dans le texte mais pas de schema dédié. Ajouter `FAQPage` schema sur chaque article avec 3-5 Q&A. | Très fort — les FAQ sont le format n°1 cité par les LLMs | 1h |
| **HAUTE** | **Pas de "TL;DR" ou résumé scannable en haut d'article** — Le `ColorBlock "L'ESSENTIEL À RETENIR"` existe mais n'est pas balisé sémantiquement. Ajouter un `<summary>` ou un bloc structuré identifiable par les crawlers AI. | Fort — AI overview + featured snippets | 30min |
| **HAUTE** | **Pas de `HowTo` schema** — Les articles "ownership" et "backoffice" décrivent des méthodes en étapes. Le schema `HowTo` les rendrait éligibles aux rich snippets et aux réponses AI structurées. | Fort — Google AI Overviews | 1h |
| **MOYENNE** | **Pas de liens sortants vers des sources autoritaires** — Les articles citent des expériences mais ne linkent aucune source externe (LinkedIn des personnes citées, études, frameworks). Les LLMs privilégient le contenu qui cite ses sources. | Crédibilité GEO | 30min |
| **MOYENNE** | **Contenu non testé dans les AI** — Tester les requêtes cibles ("structurer équipe produit scale-up", "ownership produit", "PM freelance care") dans ChatGPT, Perplexity, Google AI Overview. Mesurer si le site est cité. Adapter le contenu en fonction. | Mesure baseline | 1h |
| **BASSE** | **Pas de `speakable` schema** — Pour les assistants vocaux et la lecture à voix haute. Marquer les extraits clés comme `speakable`. | Marginal aujourd'hui | 15min |

---

## 3. AIO (AI Optimisation)

> Question clé : "Est-ce que les modèles d'IA apprennent de julien-brionne.fr ?"

### Ce qui est en place ✅
- Contenu original, non générique, point de vue fort
- Données factuelles vérifiables (dates, entreprises, chiffres)
- `sameAs` dans le Person schema (LinkedIn, Substack)
- Auteur identifié avec jobTitle et description
- Contenu en français — peu de concurrence AI-friendly sur ces sujets

### Ce qui manque / à améliorer ⚠️

| Priorité | Action | Impact AIO | Effort |
|---|---|---|---|
| **HAUTE** | **Pas de profil sur des sources de référence** — Wikipedia (mention), Crunchbase, Product Hunt, ou des plateformes PM (Mind the Product, SVPG). La présence sur des sources trusted augmente la probabilité d'inclusion dans les training data. | Fort — présence multi-source | Variable |
| **HAUTE** | **Newsletter Substack peu linkée depuis le site** — Un seul lien dans le footer. Le Substack (`produitsansfiltre.substack.com`) est une source indexable et crawlable par les AI. Le linker dans les articles et sur /contact. | Moyen | 15min |
| **MOYENNE** | **Pas de `mentions` ou `citation` schema** — Quand Julien est cité par d'autres (verbatim Elodie Mermet sur /references), ce n'est pas balisé comme une citation externe. Utiliser `Review` ou `Recommendation` schema. | Moyen | 30min |
| **MOYENNE** | **Pas de contenu sur GitHub/dev communities** — Même si le profil est PM et pas dev, une présence technique (articles techniques, repo public, contribution open source) augmente la surface AI. | Moyen — mais hors scope | Variable |
| **BASSE** | **Pas de données structurées Wikidata** — Créer une entrée Wikidata pour "Julien Brionne" augmenterait la reconnaissance entité par les LLMs. | Long terme | 2h |

---

## 4. AEO (Answer Engine Optimisation)

> Question clé : "Est-ce que Google AI Overview montrerait ce contenu comme réponse ?"

### Ce qui est en place ✅
- Questions-réponses dans le FAQ schema de `/approche`
- Structure de contenu compatible featured snippets (label + titre + contenu court)
- Paragraphes d'intro qui répondent directement aux questions
- Titres d'articles formulés en questions ("pourquoi personne ne sait qui décide quoi")

### Ce qui manque / à améliorer ⚠️

| Priorité | Action | Impact AEO | Effort |
|---|---|---|---|
| **CRITIQUE** | **Les H2 des articles ne sont pas des `<h2>` HTML** — Les articles MDX utilisent des composants `<Section title="">` qui rendent des divs stylés, pas des headings sémantiques. Google ne voit pas de structure de headings dans les articles. C'est le problème technique SEO le plus grave du site. | Critique — hiérarchie H1>H2>H3 cassée | 1h |
| **HAUTE** | **Pas de "People Also Ask" targeting** — Les articles ne ciblent pas explicitement les questions PAA de Google. Ajouter des sous-sections H3 formulées en questions ("Comment savoir si l'ownership est flou ?", "Faut-il un PM dédié au care ?"). | Fort — Featured snippets + PAA | 1h |
| **HAUTE** | **Pas de contenu zero-click** — Les articles sont longs (2000+ mots) mais ne contiennent pas de réponses courtes (40-60 mots) en début de section qui pourraient être extraites comme snippet. Ajouter un paragraphe de réponse directe après chaque H2. | Fort — AI Overviews | 1h |
| **MOYENNE** | **Pas de tableaux comparatifs** — Les articles "backoffice" et "alignement" gagneraient à avoir des tableaux de décision (Patcher vs Refondre, Product vs Ops vs Engineering). Les tableaux sont fortement favorisés dans les AI Overviews. | Fort — format AI-friendly | 30min |
| **MOYENNE** | **Pas de listes à puces structurées** — Les `DecisionItem` sont visuellement des listes mais sémantiquement des divs. Les convertir en `<ol>` ou `<ul>` avec `<li>` améliorerait l'extraction par les AI. | Moyen | 30min |

---

## 5. SXO (Search Experience Optimisation)

> Question clé : "Est-ce que le trafic qui arrive se convertit ?"

### Ce qui est en place ✅
- CTA clair et unique ("Discuter de ta situation" → Lemcal)
- `ArticleConversionGate` en fin d'article
- ReadingProgress bar sur les articles
- `btn-cta` avec min-height 48px (touch target)
- Prefetch viewport-based activé
- compressHTML activé
- Font loading non-bloquant (preload + print media swap)
- `focus-visible` outline pour accessibilité
- Photo avec `fetchpriority="high"` + dimensions explicites
- Page /contact dédiée avec embed Lemcal

### Ce qui manque / à améliorer ⚠️

| Priorité | Action | Impact SXO | Effort |
|---|---|---|---|
| **HAUTE** | **Pas de CTA intermédiaire dans les articles longs** — Le CTA n'apparait qu'en fin d'article (ArticleConversionGate). Sur un article de 2500 mots, le lecteur qui quitte à 50% ne voit jamais le CTA. Ajouter un CTA discret à mi-article (sidebar ou inline). | Fort — conversion | 30min |
| **HAUTE** | **Pas de lien /contact dans la Navbar** — Le menu principal ne contient pas de lien vers /contact. L'utilisateur doit scroller jusqu'au CTA ou tomber sur la page par hasard. Ajouter un lien "Contact" dans la Navbar. | Fort — conversion | 10min |
| **HAUTE** | **Google Analytics sans events de conversion** — GA4 est installé mais aucun event personnalisé ne track les clics sur le CTA Lemcal, les scrolls d'articles, ou les visites /contact. Impossible de mesurer le funnel. | Critique — mesure | 30min |
| **MOYENNE** | **Pas de Core Web Vitals monitoring** — Le site est rapide (SSG) mais aucun monitoring CWV n'est en place. Ajouter un check régulier via PageSpeed Insights ou web-vitals lib. | Moyen | 15min |
| **MOYENNE** | **Fonts externes bloquantes en JS-off** — Le `<noscript>` fallback charge les fonts de façon bloquante. Peu d'impact en pratique, mais c'est un point que Lighthouse signale. | Faible | 10min |
| **MOYENNE** | **Pas de breadcrumb visible** — Le schema Breadcrumb existe mais aucun breadcrumb n'est rendu visuellement. Ajouter un fil d'Ariane visible améliore la navigation et le CTR dans les SERPs. | Moyen | 30min |
| **BASSE** | **Pas de dark mode** — Le site est clair uniquement. Un dark mode améliore le temps passé pour les utilisateurs nocturnes. | Faible | 2h |
| **BASSE** | **Pas de `prefers-reduced-motion` complet** — Le media query existe pour le parallaxe blobs, mais les animations hero, reveal, et section-fade jouent quand même. | Accessibilité | 30min |

---

## 6. TECHNIQUE SEO — Points restants

| Problème | Détail | Impact | Fix |
|---|---|---|---|
| **Inline styles dans les composants** | Plusieurs composants utilisent `style=""` inline (Hero SVG, ReadingProgress, contact iframe). Pas critique mais pas idéal pour le CSS budget. | Faible | Migrer vers classes |
| **Pas de `<time>` sémantique** | Les dates d'articles sont rendues en texte, pas en `<time datetime="">`. Google préfère le balisage sémantique des dates. | Moyen | 15min |
| **ReadingProgress sur toutes les pages** | Le composant est dans Layout.astro (toutes les pages) mais se cache en JS si pas `/articles/*`. Mieux vaut le conditionner côté serveur. | Faible | 10min |
| **og-home.webp orphelin dans /public** | L'ancien fichier OG statique est toujours dans `/public/og-home.webp` mais n'est plus référencé (remplacé par `/og/page-home.webp`). | Poids mort | Supprimer |
| **Pas de `<link rel="manifest">`** | Pas de web app manifest. Pas critique pour un site editorial, mais manque pour PWA signals. | Faible | 15min |
| **SVG d'image OG non multi-ligne** | Le `generateOGSVG()` met le titre entier dans un seul `<text>`. Les titres longs sont tronqués ou overflow. Ajouter un word-wrap SVG. | Moyen — OG images illisibles sur titres longs | 1h |

---

## 7. GROWTH — Recommandations stratégiques

### 7.1 Cocon sémantique actuel

```
                    Homepage
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
        /approche  /references  /articles
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ownership      backoffice      alignement
                    │              │              │
                    └──────┬───────┘              │
                           ▼                      ▼
                    care-territoire ◄──────────────┘
```

Le cocon est cohérent. Chaque article linke vers les autres et vers `/approche`. C'est le bon pattern.

### 7.2 Articles manquants pour compléter le cocon

| Article | Mot-clé cible | Maillage | Pourquoi |
|---|---|---|---|
| **Art. 5 : Recruter un PM freelance vs embaucher** | "recruter PM freelance" | → approche, ownership | Capte le trafic transactionnel. La requête la plus proche de la conversion. |
| **Art. 6 : Quand automatiser le care (et quand ne pas)** | "automatiser care scale-up" | → care, backoffice | Prolonge le proof point Heetch. Angle technique unique. |

### 7.3 Actions growth hors-SEO

| Action | Canal | Impact | Effort |
|---|---|---|---|
| **Publier les articles sur LinkedIn** | LinkedIn | Fort — le réseau cible (CPO, Head of Product) est là | 30min/article |
| **Cross-poster sur Substack** | Newsletter | Moyen — construit une audience captive | 15min/article |
| **Répondre aux questions Quora/Reddit FR** | Forums | Moyen — backlinks naturels + visibilité AI | 1h/semaine |
| **Guest post sur ProductBoard/SVPG/Mind the Product** | Blogs spécialisés | Fort — backlinks de qualité + notoriété | 3-4h |
| **Créer un profil Malt optimisé** | Marketplace freelance | Moyen — backlink + visibilité locale | 1h |
| **Google Business Profile** | Local SEO | Moyen — signal de confiance, schema LocalBusiness | 30min |

### 7.4 Quick wins techniques (< 30 min chacun)

1. **Ajouter `hreflang="fr"` dans Layout.astro**
2. **Ajouter `<meta name="theme-color" content="#FDFCFB">`**
3. **Ajouter `/contact` dans la Navbar**
4. **Supprimer `/public/og-home.webp` (orphelin)**
5. **Ajouter `<time datetime="">` sur les dates d'articles**
6. **Linker la newsletter Substack dans les articles et sur /contact**
7. **Tracker les clics CTA Lemcal en GA4 events**

### 7.5 Chantiers structurants (> 1h chacun)

1. **Rendre les `<Section title="">` en vrais `<h2>`** — Le problème sémantique le plus grave. Les composants Section, ColorBlock, etc. rendent les titres en `<div>` stylés. Ça casse toute la hiérarchie headings que Google et les AI utilisent pour comprendre la structure.
2. **Ajouter FAQ schema sur les 4 articles du cocon** — Chaque article a du contenu FAQ dans le texte. L'extraire en schema JSON-LD.
3. **Ajouter HowTo schema sur ownership + backoffice** — Ces articles décrivent des méthodes en étapes numérotées.
4. **Ajouter un breadcrumb visible** — Le schema existe mais rien n'est rendu. Composant Breadcrumb à créer.
5. **Ajouter des images/schémas dans les articles** — Des schémas simples (matrice ownership, comparaison patcher/refondre) amélioreraient l'engagement et le ranking Images.
6. **GA4 events : conversion tracking** — Tracker CTA clicks, scroll depth 50%/100%, page /contact viewed.

---

## 8. SCORING ACTUEL

| Dimension | Score | Commentaire |
|---|---|---|
| **SEO classique** | 7/10 | Fondamentaux solides. Hiérarchie headings cassée dans les composants. |
| **GEO** | 5/10 | Contenu citable, mais peu de FAQ schema et pas de HowTo. Pas testé dans les AI. |
| **AIO** | 4/10 | Présence mono-source (site + LinkedIn + Substack). Pas sur les plateformes de référence. |
| **AEO** | 4/10 | Pas de headings sémantiques dans les articles = pas de featured snippets possibles. Pas de réponses zero-click. |
| **SXO** | 6/10 | CTA clair, site rapide, mais pas de tracking conversion, pas de CTA mid-article, /contact absent de la nav. |

**Score global : 5.2/10** — Le contenu est bon. La structure technique sous-exploite le contenu. Les quick wins techniques (headings, FAQ schema, CTA nav) relèveraient le score à ~7/10 en quelques heures.

---

## 9. PLAN D'ACTION PRIORISÉ

### Sprint 1 — Quick wins (2-3h)
- [ ] Convertir les titres des composants Section/ColorBlock en `<h2>` / `<h3>` sémantiques
- [ ] Ajouter `/contact` dans la Navbar (desktop + mobile)
- [ ] Ajouter `hreflang="fr"` + `theme-color` dans Layout.astro
- [ ] Ajouter `<time datetime="">` sur les dates d'articles
- [ ] Supprimer `/public/og-home.webp`
- [ ] Linker Substack dans le body des articles + page /contact

### Sprint 2 — Schema enrichment (2h)
- [ ] Ajouter FAQ schema JSON-LD sur les 4 articles du cocon
- [ ] Ajouter HowTo schema sur ownership + backoffice
- [ ] Ajouter `Review`/`Recommendation` schema sur les verbatims de /references

### Sprint 3 — Conversion tracking (1h)
- [ ] GA4 custom events : clic CTA Lemcal, scroll 50%/100%, visite /contact
- [ ] Breadcrumb visible (composant + toutes pages sauf home)

### Sprint 4 — Contenu (3-4h)
- [ ] Ajouter des schémas/images dans les 4 articles du cocon
- [ ] Écrire l'article 5 ("Recruter un PM freelance vs embaucher")
- [ ] Écrire l'article 6 ("Quand automatiser le care")
- [ ] Ajouter des tableaux comparatifs dans backoffice + alignement

### Sprint 5 — Présence externe (ongoing)
- [ ] Publier les 4 articles du cocon sur LinkedIn
- [ ] Cross-poster sur Substack
- [ ] Créer/optimiser profil Malt
- [ ] Google Business Profile
- [ ] Tester les requêtes cibles dans ChatGPT, Perplexity, Google AI Overview
