# julien-brionne.fr

Site personnel éditorial de Julien Brionne, Senior Product Manager freelance. Astro 5 + Tailwind 4 + MDX, déployé sur Vercel.

## Architecture de rendu

**`output: 'static'`. Toutes les pages publiques sont pré-rendues à la compilation.** Le visiteur reçoit du HTML fini depuis le CDN. Aucune page de la vitrine, aucun article, aucune page SEO ne passe par un serveur au moment de la visite.

**Une seule fonction serverless subsiste**, et elle n'appartient qu'à `/ressources` : les deux endpoints qui se désinscrivent du pré-rendu avec `export const prerender = false`.

- `src/pages/api/subscribe-pack.ts` — capture d'email vers Loops
- `src/pages/api/pack-prompts.ts` — livraison des prompts

Si `/ressources` disparaît un jour, ces deux routes partent avec elle et le site devient entièrement statique. **C'est une conséquence possible, pas un objectif** : on ne supprime pas ces pages pour simplifier l'hébergement.

**Toute modification de cette architecture doit être explicite et décidée.** Ne pas basculer en `output: 'server'`, ne pas ajouter `prerender = false` sur une route, ne pas introduire de rendu à la demande sans que la décision soit écrite dans le contexte projet. Un site statique est le comportement voulu, pas un accident de configuration.

Les redirections sont déclarées dans `astro.config.mjs` et compilées par l'adaptateur en règles de routage Vercel. Elles sont donc traitées à la périphérie, avant tout rendu — pas dans le code applicatif.

## Ce qui fait autorité, et qui n'est pas dans ce dépôt

Le contenu, l'architecture des pages, les URLs, les CTA et ce qui peut être publié sont décidés ailleurs, dans le dossier de contexte `09_Solopreneur-Claude/` :

| Question | Fichier |
|---|---|
| Le site, dans son intégralité | `03_PROJETS/julien-brionne/site-architecture.md` |
| Ce qui est décidé, dans l'ordre | `02_ACTIVITE/decisions.md` |
| Ce qui peut être affirmé et publié | `01_MARQUE/preuves.md` |

**Ce dépôt implémente ces décisions, il n'en prend aucune.** Une question qui rouvrirait un arbitrage remonte à Julien.

Trois règles qui se cassent facilement sans le savoir :

- **Les ancres `#la-mise-au-clair`, `#le-copilote`, `#le-rendez-vous-produit` sont définitives.** Des liens partent dessus depuis LinkedIn et des messages privés. Les renommer casse des liens déjà envoyés.
- **Aucun prix sur le site.** Le format et le résultat sont publics, le prix se dit en conversation. Ni fourchette, ni « sur devis ».
- **Aucune URL ne se supprime sans redirection vérifiée.** Voir la table des routes dans `SORTIES CLAUDE/julien-brionne/`.

## Structure

```text
src/
├── pages/           une route par fichier
│   ├── index.astro  ce-que-je-fais  ecrits  product-manager-freelance-pme
│   ├── articles/    bibliothèque éditoriale, hors navigation
│   └── ressources/  outils Product Copilot, hors navigation, sort non tranché
├── content/articles/  12 articles MDX
├── components/      Navbar, Footer, composants d'article
├── layouts/         Layout.astro, métadonnées et schémas
└── styles/          global.css, jetons de couleur et de typographie
```

## Commandes

| Commande | Action |
| :--- | :--- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Serveur local sur `localhost:4321` |
| `npm run build` | Build de production dans `./dist/` |
| `npm run preview` | Prévisualise le build |
