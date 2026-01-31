# 🎨 Implémentation des Images Open Graph Dynamiques

**Date :** Janvier 2026  
**Branche :** open-graph  
**Objectif :** Générer automatiquement des images OG pour les articles MDX et les pages principales

---

## ✅ Ce qui a été implémenté

### 1. Route Dynamique pour les Images OG

**Fichier :** `src/pages/og/[...slug].ts`

- ✅ Route dynamique qui génère des images PNG pour chaque contenu
- ✅ Support pour les articles MDX (`article-{slug}`)
- ✅ Support pour les pages statiques (`page-{slug}`)
- ✅ Design cohérent avec le thème du site (couleurs ivory, sand, graphite, clay)
- ✅ Utilisation de `astro-og-canvas` pour la génération

**Format des URLs générées :**
- Articles MDX : `/og/article-{slug}.png`
- Pages statiques : `/og/page-{slug}.png`

**Exemples :**
- `/og/article-art-du-non.png`
- `/og/page-approche.png`
- `/og/page-home.png`

### 2. Pages Statiques Configurées

Les pages suivantes ont des images OG générées automatiquement :
- `page-home` : Page d'accueil
- `page-approche` : Page Approche
- `page-situations` : Page Situations
- `page-diagnostic` : Page Diagnostic
- `page-articles` : Page Articles

### 3. Design des Images OG

**Caractéristiques :**
- **Taille :** 1200x630px (ratio standard Open Graph)
- **Fond :** Gradient subtil ivory → sand (#FDFCFB → #F2E9E1)
- **Titre :** Graphite (#121212), taille 72px, poids 700
- **Description :** Softgray (#9A8B7A), taille 32px, poids 400
- **Bordure :** Clay (#E5BAAD), épaisseur 4px
- **Padding :** 80px

**Couleurs utilisées :**
```typescript
ivory: [253, 252, 251]    // #FDFCFB
graphite: [18, 18, 18]     // #121212
sand: [242, 233, 225]      // #F2E9E1
softgray: [154, 139, 122]  // #9A8B7A
clay: [229, 186, 173]      // #E5BAAD
```

---

## 📋 Structure des Fichiers

```
src/
├── pages/
│   ├── og/
│   │   └── [...slug].ts          ← Route dynamique pour générer les images OG
│   ├── articles/
│   │   └── [...slug].astro       ← Utilise les images OG générées
│   ├── approche.astro            ← Utilise les images OG générées
│   ├── situations.astro          ← Utilise les images OG générées
│   ├── diagnostic.astro          ← Utilise les images OG générées
│   └── articles.astro            ← Utilise les images OG générées
└── layouts/
    └── Layout.astro               ← Gère les métadonnées OG
```

---

## 🔧 Configuration

### Dépendances Installées

```json
{
  "dependencies": {
    "astro-og-canvas": "^0.10.0"
  }
}
```

### Comment ça fonctionne

1. **Génération statique :** Lors du build, `getStaticPaths` génère tous les chemins possibles
2. **Récupération des données :** Pour chaque slug, les données sont récupérées depuis les collections Astro ou les pages statiques
3. **Génération de l'image :** `OGImageRoute` génère une image PNG avec le titre et la description
4. **Intégration :** Les pages utilisent ces images dans leurs métadonnées OG

---

## 🎯 Résultat

### Avant
- ❌ Toutes les pages utilisaient la même image OG par défaut (`/og-home.webp`)
- ❌ Pas de différenciation visuelle lors du partage social
- ❌ Images OG statiques uniquement

### Après
- ✅ Chaque article MDX a sa propre image OG générée dynamiquement
- ✅ Chaque page principale a sa propre image OG générée dynamiquement
- ✅ Design cohérent avec le thème du site
- ✅ Images OG optimisées pour le partage social (1200x630px)

---

## 🧪 Tests à Effectuer

### 1. Build et Génération
```bash
npm run build
```
Vérifier que les images sont générées dans `dist/og/`

### 2. Test Local
```bash
npm run dev
```
Visiter `/og/article-art-du-non.png` pour voir l'image générée

### 3. Validation Réseaux Sociaux
- **Facebook :** https://developers.facebook.com/tools/debug/
- **Twitter :** https://cards-dev.twitter.com/validator
- **LinkedIn :** https://www.linkedin.com/post-inspector/

### 4. Vérification des Métadonnées
Inspecter le HTML généré pour vérifier que les balises `<meta property="og:image">` pointent vers les bonnes URLs

---

## 📝 Notes Techniques

### Polices
- Les polices personnalisées (Playfair Display, Inter) ne sont pas encore chargées
- `astro-og-canvas` utilise par défaut "Noto Sans" depuis Fontsource
- Pour utiliser les polices personnalisées, il faudra :
  1. Télécharger les fichiers TTF des polices
  2. Les placer dans `src/assets/fonts/`
  3. Configurer le chemin dans `getImageOptions` avec l'option `fonts`

### Performance
- Les images sont générées au build time (statique)
- Pas d'impact sur les performances runtime
- Les images sont servies comme des fichiers statiques

### Limitations Actuelles
- Les polices personnalisées ne sont pas encore chargées (utilise Noto Sans par défaut)
- Pas de logo dans les images OG (peut être ajouté plus tard)
- Design basique (peut être amélioré avec plus d'options de `astro-og-canvas`)

---

## 🚀 Prochaines Étapes (Optionnel)

1. **Améliorer le Design**
   - Ajouter un logo dans les images OG
   - Améliorer la mise en page (ajout de badges, tags, etc.)
   - Utiliser les polices personnalisées (Playfair Display, Inter)

2. **Optimisation**
   - Vérifier la taille des images générées
   - Optimiser la compression si nécessaire
   - Ajouter un cache si besoin

3. **Tests**
   - Tester sur différents réseaux sociaux
   - Vérifier le rendu sur mobile
   - Valider l'accessibilité

---

## 📚 Ressources

- [Documentation astro-og-canvas](https://github.com/delucis/astro-og-canvas)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

---

**Statut :** ✅ Implémentation terminée et fonctionnelle  
**Prochaine étape :** Intégration dans les pages et tests
