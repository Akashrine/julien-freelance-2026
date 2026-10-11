# julien-brionne.fr

Site personnel de Julien Brionne, Product Lead freelance. Astro 5 + Tailwind 4 + MDX, déployé sur Vercel.

## Architecture de rendu

**`output: 'static'`. Toutes les pages publiques sont pré-rendues à la compilation.** Le visiteur reçoit du HTML fini depuis le CDN. Aucune page de la vitrine, aucun article, aucune page SEO ne passe par un serveur au moment de la visite.

**Une seule fonction serverless subsiste**, et elle n'appartient qu'à `/ressources/prompts-discovery`, gardée hors vitrine pour d'anciens abonnés : les deux endpoints qui se désinscrivent du pré-rendu avec `export const prerender = false`.

- `src/pages/api/subscribe-pack.ts` — capture d'email vers Loops
- `src/pages/api/pack-prompts.ts` — livraison des prompts

Si cette page disparaît un jour, ces deux routes partent avec elle et le site devient entièrement statique. **C'est une conséquence possible, pas un objectif** : on ne la supprime pas pour simplifier l'hébergement.

**Toute modification de cette architecture doit être explicite et décidée.** Ne pas basculer en `output: 'server'`, ne pas ajouter `prerender = false` sur une route, ne pas introduire de rendu à la demande sans que la décision soit écrite dans le contexte projet. Un site statique est le comportement voulu, pas un accident de configuration.

Les redirections sont déclarées dans `astro.config.mjs` et compilées par l'adaptateur en règles de routage Vercel. Elles sont donc traitées à la périphérie, avant tout rendu — pas dans le code applicatif.

## Ce qui fait autorité, et qui n'est pas dans ce dépôt

Le contenu, l'architecture des pages, les URLs, les CTA et ce qui peut être publié sont décidés ailleurs, dans le dossier de contexte `09_Solopreneur-Claude/` :

| Question | Fichier |
|---|---|
| Le site : pages, routes, redirections, règles de preuve | `03_PROJETS/julien-brionne/site-architecture.md` |
| Identité, offres, mission longue | `01_PRODUCT-BUSINESS/00_NOW.md`, `01_OFFERS.md` |
| Ce qui peut être affirmé et publié | `01_PRODUCT-BUSINESS/04_CASES.md` |

**Ce dépôt implémente ces décisions, il n'en prend aucune.** La copy des quatre pages a été validée le 11/10/2026 : elle ne se reformule pas dans le code. Une contrainte technique qui toucherait un texte se signale à Julien.

Trois règles qui se cassent facilement sans le savoir :

- **Les ancres `#porter` et `#la-mise-au-clair` sont publiques**, et les anciennes `#le-copilote` et `#le-rendez-vous-produit` restent posées sur la page pour les liens déjà envoyés.
- **Aucun prix sur le site.**
- **Aucune URL ne se supprime sans redirection.** La table vit dans `site-architecture.md` et s'implémente dans `astro.config.mjs`.

## Structure

```text
src/
├── pages/           une route par fichier
│   ├── index.astro  ce-que-je-fais  a-propos  ecrits  mentions-legales  404
│   ├── articles/    bibliothèque éditoriale, hors navigation (l'index redirige vers /ecrits)
│   └── ressources/  prompts-discovery seulement, hors vitrine, anciens abonnés
├── content/articles/  13 articles MDX
├── components/      Navbar, Footer, composants d'article
├── layouts/         Layout.astro, métadonnées et schémas
├── utils/           mail.ts (objets et lettres), offres.ts, schema.ts
└── styles/          global.css, jetons de couleur et de typographie
```

## Commandes

| Commande | Action |
| :--- | :--- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Serveur local sur `localhost:4321` |
| `npm run build` | Build de production dans `./dist/` |
| `npm run preview` | Prévisualise le build |
