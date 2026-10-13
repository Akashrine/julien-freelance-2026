# Product

<!-- impeccable:product-schema 1 -->

Mis à jour le 11/10/2026, refonte « Product Lead freelance ». L'architecture de référence vit hors du dépôt : `09_Solopreneur-Claude/03_PROJETS/julien-brionne/site-architecture.md`. En cas d'écart, c'est elle qui fait foi.

## Platform

web

## Users

Deux audiences, une seule identité, les mêmes pages.

| Visiteur | Ce qu'il cherche | Surfaces |
|---|---|---|
| Dirigeant, fondateur, Head of Product | Le regard de Julien, ce qu'on peut lui confier, La Mise au clair | `/`, `/ce-que-je-fais` |
| Recruteur, apporteur, entreprise avec une mission longue | Un Product Lead opérationnel, capable de porter un scope important, un parcours crédible | `/`, `/ce-que-je-fais#porter`, `/a-propos` |
| Lecteur, pair PM | La manière de penser, une raison de revenir | `/ecrits`, `/articles/[slug]` |

## Product Purpose

Faire comprendre, dans cet ordre : qui est Julien, dans quel genre de problème il est utile, ce qu'il fait une fois dedans, qu'il peut porter un sujet pendant plusieurs mois, qu'il existe une manière plus courte de travailler avec lui, pourquoi le croire, et comment commencer une conversation.

Le succès est un mail entrant qualifié.

## Positioning

Julien Brionne, Product Lead freelance. Le geste : « Qu'est-ce qui vous fait dire que c'est ça, le problème ? »

Deux profondeurs du même travail :
- **Porter** : l'activité principale. Prendre la responsabilité d'un sujet produit pendant plusieurs mois, rester après la décision, jusqu'à l'exécution et la mesure. Pas une offre packagée, pas de Service déclaré, ni rythme ni durée minimum publiés.
- **Décider** : La Mise au clair. Un mois, avec le dirigeant et les personnes Produit, Tech ou Data utiles, pour décider quoi construire, pour qui, comment savoir si ça marche et par quoi commencer.

## Operating Context

- **Une seule action : le mail.** Trois objets pré-remplis, qui servent de mesure : « Un sujet produit », « Mission longue », « La Mise au clair ». Les lettres pré-remplies vivent dans `src/utils/mail.ts`.
- **Aucun prix sur le site.**
- **Le dépôt implémente, il ne décide pas.** Identité et offres : `01_PRODUCT-BUSINESS/00_NOW.md` et `01_OFFERS.md`. Preuves : `01_PRODUCT-BUSINESS/04_CASES.md`. Voix : `02_CONTENT/03_VOIX.md`.
- **La copy des quatre pages a été validée le 11/10/2026.** Elle ne se reformule pas dans le code. Une contrainte technique qui toucherait un texte se signale à Julien.
- **Rendu statique, servi par le CDN Vercel.** Deux endpoints serverless subsistent pour `/ressources/prompts-discovery`. Ne pas basculer en `output: 'server'` sans décision écrite.
- **`master` = production.** Aucun merge vers `master` sans que Julien dise de déployer.

## Capabilities and Constraints

- Ancres : `#porter`, `#la-mise-au-clair`. Les anciennes ancres `#le-copilote` (posée sur Porter) et `#le-rendez-vous-produit` (posée sur le bloc « lequel des deux ») restent pour les liens déjà envoyés, sans afficher d'ancienne offre.
- Les redirections vivent dans `astro.config.mjs` et suivent la table de `site-architecture.md`. Aucune URL ne se supprime sans redirection.
- Hors vitrine, à préserver : `/ressources/prompts-discovery`, `/api/subscribe-pack`, `/api/pack-prompts` (anciens abonnés Loops). `LOOPS_API_KEY` reste requise en production.
- Les 13 articles gardent leur URL. Leur corps n'est pas réécrit dans le dépôt sans chantier éditorial validé.
- Site en français uniquement. Thème clair et sombre, préférence système par défaut.

## Brand Commitments

- **Nom et signature :** Julien Brionne. Logo dessiné (13/10/2026), vectorisé dans `public/logo/` : `julien-brionne.svg` (une ligne), `julien-brionne-pile.svg` (deux lignes), `jb.svg` (monogramme), tous avec le point final vermillon pour le nom. Dans le site, composant `src/components/Logo.astro`. Favicon : le monogramme JB en papier sur tuile encre (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`). « Product Lead freelance » dans les titres et les métadonnées.
- **Voix :** première personne, phrases courtes, sérieux sur le fond, détendu dans la manière. Pas de vocabulaire de cabinet, pas de landing page SaaS, pas de tiret long.
- **Actifs :** portrait `/public/portrait-640.webp` ; Newsreader et Instrument Sans auto-hébergées ; palette papier et encre du 13/10/2026 (papier `#F3F1EC`, encre `#151515`, gris `#5A5A57`, filet `#D6D3CC`, vermillon `#E4472B`), l'accent restant rare ; images OG générées par `src/pages/og/[...slug].ts`.

## Evidence on Hand

Uniquement ce que `04_CASES.md` autorise. Aujourd'hui sur le site : Heetch (les étoiles, Cold Feedback, l'équipe Care et l'admin), Waalaxy (le churn confronté à l'usage), WizVille (le repositionnement), The Other Store (le checkout tranché par un test, la première fonction produit), les témoignages d'Elodie Mermet et de Jaume Avila Estivill (sans entreprise). Back Market : mission en cours, côté Care, rien de plus.

## Product Principles

1. **Ce qu'on peut confier avant les cas.** Le visiteur comprend le travail avant de lire les preuves.
2. **Rien qui ne soit vérifiable dans CASES.** À défaut de fait, on n'écrit rien.
3. **Une seule porte.** Écrire un mail.
4. **Le dépôt implémente, il n'arbitre pas.** Signaler à Julien, ne pas improviser.

## Accessibility & Inclusion

- Lien d'évitement vers `#contenu`, qui reçoit le focus (`tabindex="-1"`) sur chaque page.
- Le sélecteur de thème annonce où il emmène : `aria-pressed` et `aria-label` se mettent à jour à chaque bascule.
- Tout ornement est décoratif et `aria-hidden` : le paysage du hero, les traits du schéma, les flèches de lien.
- **Le vermillon `#E4472B` mesure 3,55:1 sur le papier `#F3F1EC`.** Grands caractères, flèches et états seulement, jamais de texte courant.
- Les pages restent lisibles à l'impression.
