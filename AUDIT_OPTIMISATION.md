# Audit d'Optimisation du Site

**Date** : 31 janvier 2026  
**Objectif** : Identifier les optimisations possibles sans modifier le code  
**Focus** : Styles inline, scripts inline, duplications HTML, nettoyage CSS, composants à créer, scripts à déplacer

---

## 📋 Table des matières

1. [Styles inline](#styles-inline)
2. [Scripts inline](#scripts-inline)
3. [Duplications de code HTML](#duplications-de-code-html)
4. [Styles à nettoyer dans global.css](#styles-à-nettoyer-dans-globalcss)
5. [Composants à créer](#composants-à-créer)
6. [Scripts à déplacer](#scripts-à-déplacer)
7. [Couleurs hardcodées](#couleurs-hardcodées)
8. [Fonctions dupliquées](#fonctions-dupliquées)
9. [Résumé des priorités](#résumé-des-priorités)

---

## 1. Styles inline

### 🔴 Priorité Haute

#### 1.1 Border-radius organique répété
**Problème** : Le style `border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%` est répété en inline dans plusieurs fichiers alors qu'une classe `.organic-shape` existe déjà dans `global.css`.

**Fichiers concernés** :
- `src/components/articles/SidebarBox.astro` (ligne 10)
- `src/components/articles/KeyPoint.astro` (ligne 10)
- `src/content/articles/art-du-non.mdx` (lignes 36, 94, 152)

**Solution** : Supprimer `style="border-radius: ..."` et utiliser la classe `.organic-shape` qui existe déjà.

**Impact** : Réduction de la duplication, meilleure maintenabilité, cohérence visuelle.

---

#### 1.2 Font-family JetBrains Mono inline
**Problème** : `style="font-family: 'JetBrains Mono', monospace;"` dans `CodeBlock.astro` alors que `.font-mono` existe déjà.

**Fichier concerné** :
- `src/components/articles/CodeBlock.astro` (ligne 10)

**Solution** : La classe `.font-mono` est déjà appliquée, supprimer le style inline.

**Impact** : Cohérence avec le système de design.

---

#### 1.3 Variables CSS inline pour animations
**Problème** : Utilisation de `style={`--index: ${index}; transition-delay: ${index * 0.1}s;`}` dans `ArticlesList.astro`.

**Fichier concerné** :
- `src/components/ArticlesList.astro` (ligne 53)

**Solution** : Créer une classe utilitaire ou utiliser `data-index` avec CSS `attr()` ou créer des classes de délai dynamiques.

**Impact** : Réduction du JavaScript inline, meilleure séparation des préoccupations.

---

#### 1.4 Variables CSS pour thumbnails
**Problème** : `style={`--thumbnail-bg: ${thumbnailColor.bg}; --thumbnail-radius: ${thumbnailColor.shape};`}` dans `ArticlesList.astro`.

**Fichier concerné** :
- `src/components/ArticlesList.astro` (ligne 75)

**Solution** : Créer des classes Tailwind ou CSS pour chaque variante de couleur/forme, ou utiliser des attributs `data-*` avec CSS.

**Impact** : Réduction de la logique inline, meilleure maintenabilité.

---

### 🟡 Priorité Moyenne

#### 1.5 Couleurs hardcodées en inline
**Problème** : Nombreuses couleurs hardcodées dans les classes Tailwind (`bg-[#E5BAAD]`, `text-[#C5A070]`, etc.).

**Fichiers concernés** : Tous les composants

**Solution** : Voir section [Couleurs hardcodées](#couleurs-hardcodées).

---

## 2. Scripts inline

### 🔴 Priorité Haute

#### 2.1 Script IntersectionObserver dans Layout.astro
**Problème** : Script de ~50 lignes dans le layout principal pour gérer les animations `reveal` et `section-fade`, ainsi que la parallaxe.

**Fichier concerné** :
- `src/layouts/Layout.astro` (lignes 122-177)

**Solution** : Déplacer vers `/src/utils/animations.ts` ou `/src/scripts/animations.js` et l'importer dans le layout.

**Impact** : 
- Meilleure séparation des préoccupations
- Possibilité de réutiliser le code
- Meilleure mise en cache par le navigateur
- Code plus testable

**Code à déplacer** :
```javascript
// IntersectionObserver pour les animations reveal
// Observer pour les sections avec fade-in progressif
// Parallaxe sur les blobs
```

---

#### 2.2 Script de filtrage dans ArticlesList.astro
**Problème** : Script de ~40 lignes pour gérer le filtrage des articles directement dans le composant.

**Fichier concerné** :
- `src/components/ArticlesList.astro` (lignes 97-138)

**Solution** : Déplacer vers `/src/utils/articleFilters.ts` ou `/src/scripts/articleFilters.js`.

**Impact** : 
- Réutilisabilité si besoin ailleurs
- Meilleure organisation
- Code plus testable

---

#### 2.3 Script menu mobile dans Navbar.astro
**Problème** : Script de ~30 lignes pour gérer le menu mobile directement dans le composant.

**Fichier concerné** :
- `src/components/Navbar.astro` (lignes 43-75)

**Solution** : Déplacer vers `/src/utils/mobileMenu.ts` ou `/src/scripts/mobileMenu.js`.

**Impact** : 
- Code plus réutilisable
- Meilleure séparation des préoccupations

---

#### 2.4 Script ReadingProgress dans ReadingProgress.astro
**Problème** : Script de ~40 lignes pour gérer la barre de progression directement dans le composant.

**Fichier concerné** :
- `src/components/ReadingProgress.astro` (lignes 7-48)

**Solution** : Déplacer vers `/src/utils/readingProgress.ts` ou `/src/scripts/readingProgress.js`.

**Impact** : 
- Code plus testable
- Meilleure organisation

---

### 🟢 Priorité Basse

#### 2.5 Script Google Analytics dans Layout.astro
**Statut** : ✅ Justifié  
**Raison** : Script inline nécessaire pour Google Analytics avec `is:inline` et `define:vars` (spécifique à Astro).

**Fichier concerné** :
- `src/layouts/Layout.astro` (lignes 104-112)

**Action** : Aucune action nécessaire, c'est la bonne pratique pour GA4 dans Astro.

---

## 3. Duplications de code HTML

### 🔴 Priorité Haute

#### 3.1 Structure métadonnées d'articles
**Problème** : La structure HTML pour afficher la date, catégorie et temps de lecture est dupliquée entre `ArticlesList.astro` et `[...slug].astro`.

**Fichiers concernés** :
- `src/components/ArticlesList.astro` (lignes 59-62)
- `src/pages/articles/[...slug].astro` (lignes 126-128)

**Structure dupliquée** :
```html
<time class="font-mono text-[#C5A070] ...">{formatDate(...)}</time>
<span class="font-mono text-[9px] text-gray-300">/ {getCategoryLabel(...)}</span>
<span class="font-mono text-[9px] text-gray-400">· ~{readingTime} min</span>
```

**Solution** : Créer un composant `ArticleMetadata.astro` qui accepte `date`, `category`, et `readingTime` en props.

**Impact** : 
- DRY (Don't Repeat Yourself)
- Cohérence visuelle garantie
- Maintenance simplifiée

---

#### 3.2 Structure de blob décoratif
**Problème** : La structure HTML pour les blobs décoratifs est répétée dans de nombreux composants avec des variations mineures.

**Fichiers concernés** :
- `src/components/Hero.astro`
- `src/components/ApproachIntro.astro`
- `src/components/DiagnosticIntro.astro`
- `src/components/SituationsIntro.astro`
- `src/components/ArticlesHeader.astro`
- `src/components/ApproachPrisms.astro`
- `src/components/Approach.astro`
- `src/components/ArticlesFooter.astro`
- `src/components/SituationsFooter.astro`
- `src/components/DiagnosticFooter.astro`
- `src/components/SituationsIntervention.astro`
- Et d'autres...

**Structure répétée** :
```html
<div class="blob w-[XXXpx] h-[XXXpx] bg-[#COLOR] top-[X%] right-[X%] organic-shape"></div>
```

**Solution** : Créer un composant `Blob.astro` avec props :
- `size`: 'small' | 'medium' | 'large' | 'custom' (avec width/height)
- `color`: 'sand' | 'blue' | 'clay' | 'custom'
- `position`: objet avec top, right, bottom, left
- `opacity`: number
- `delay`: string (pour animations)

**Impact** : 
- Réduction significative de la duplication
- Cohérence visuelle
- Maintenance simplifiée

---

#### 3.3 Structure de section avec bordures
**Problème** : Structure répétée pour les sections avec bordures top/bottom et background coloré.

**Fichiers concernés** :
- `src/components/DiagnosticDefinition.astro`
- `src/components/DiagnosticResults.astro`
- `src/components/SituationsObservables.astro`
- `src/components/SituationsIntervention.astro`
- `src/components/ApproachTriggers.astro`

**Structure répétée** :
```html
<section class="py-32 bg-[#COLOR]/X border-y border-black/5 relative overflow-hidden">
```

**Solution** : Créer un composant `SectionWithBorders.astro` avec props pour background color, padding, etc.

**Impact** : Réduction de la duplication, cohérence.

---

### 🟡 Priorité Moyenne

#### 3.4 Structure de footer avec blob
**Problème** : Structure similaire dans plusieurs footers de page.

**Fichiers concernés** :
- `src/components/ArticlesFooter.astro`
- `src/components/SituationsFooter.astro`
- `src/components/DiagnosticFooter.astro`
- `src/components/ApproachFooter.astro`

**Solution** : Analyser si une abstraction est possible sans perdre en flexibilité.

---

## 4. Styles à nettoyer dans global.css

### 🔴 Priorité Haute

#### 4.1 Duplication `.dropcap::first-letter`
**Problème** : La règle `.dropcap::first-letter` est définie deux fois (lignes 184-194 et 196-205).

**Fichier concerné** :
- `src/styles/global.css` (lignes 184-205)

**Solution** : Supprimer la duplication, garder une seule définition.

**Impact** : Réduction de ~20 lignes, meilleure maintenabilité.

---

#### 4.2 Duplication `blockquote`
**Problème** : La règle `blockquote` est définie deux fois (lignes 207-217 et 301-311).

**Fichier concerné** :
- `src/styles/global.css` (lignes 207-217 et 301-311)

**Solution** : Supprimer la duplication dans `.article-content blockquote` et utiliser la règle globale avec spécificité si nécessaire.

**Impact** : Réduction de ~10 lignes.

---

#### 4.3 Duplication `.full-width-section`
**Problème** : La règle `.full-width-section` est définie deux fois (lignes 232-237 et 329-334).

**Fichier concerné** :
- `src/styles/global.css` (lignes 232-237 et 329-334)

**Solution** : Supprimer la duplication.

**Impact** : Réduction de ~6 lignes.

---

#### 4.4 Classes de délai d'animation nombreuses
**Problème** : Nombreuses classes utilitaires pour les délais d'animation qui pourraient être générées dynamiquement.

**Fichier concerné** :
- `src/styles/global.css` (lignes 429-439)

**Classes concernées** :
- `.article-item-delay-0` à `.article-item-delay-5`
- `.reveal-delay-1` à `.reveal-delay-3`
- `.blob-delay-negative`, `.blob-delay-1`
- `.hero-reveal-delay`

**Solution** : 
- Option 1 : Utiliser des variables CSS avec `calc()` et `attr(data-delay)`
- Option 2 : Générer ces classes via Tailwind si possible
- Option 3 : Garder mais documenter pourquoi elles existent

**Impact** : Réduction potentielle de ~15 lignes, mais nécessite réflexion sur l'approche.

---

### 🟡 Priorité Moyenne

#### 4.5 Styles d'article redondants
**Problème** : Certains styles dans `.article-content` pourraient être remplacés par des classes Tailwind.

**Exemples** :
- `.article-content h2`, `.article-content h3` : pourraient utiliser des classes Tailwind directement dans les composants MDX
- `.article-content p` : pourrait être appliqué directement

**Solution** : Analyser si la migration vers Tailwind pur est bénéfique ou si les styles CSS sont nécessaires pour la spécificité.

**Impact** : Réduction potentielle du CSS, mais nécessite refactoring des composants MDX.

---

#### 4.6 Classes de couleur redondantes
**Problème** : Classes de couleur définies dans CSS alors que Tailwind pourrait les gérer.

**Classes concernées** :
- `.text-brand-sand`, `.text-clay`, `.text-sand` (lignes 345-355)
- `.bg-sand`, `.bg-sand-light`, `.bg-blue-light`, `.bg-clay`, `.bg-blue` (lignes 357-375)
- `.border-sand`, `.border-clay`, `.border-blue` (lignes 377-387)

**Solution** : 
- Option 1 : Définir ces couleurs dans la config Tailwind et utiliser les classes Tailwind natives
- Option 2 : Garder si nécessaire pour la spécificité CSS

**Impact** : Réduction potentielle de ~30 lignes, meilleure cohérence avec Tailwind.

---

## 5. Composants à créer

### 🔴 Priorité Haute

#### 5.1 `ArticleMetadata.astro`
**Raison** : Éliminer la duplication de la structure métadonnées d'articles.

**Props** :
```typescript
interface Props {
  date: string;
  category: string;
  readingTime?: number;
  variant?: 'list' | 'page'; // Pour différencier l'affichage liste vs page
}
```

**Utilisation** :
```astro
<ArticleMetadata 
  date={article.data.date} 
  category={article.data.category}
  readingTime={readingTime}
  variant="page"
/>
```

**Fichiers à modifier** :
- `src/components/ArticlesList.astro`
- `src/pages/articles/[...slug].astro`

---

#### 5.2 `Blob.astro`
**Raison** : Éliminer la duplication massive des blobs décoratifs.

**Props** :
```typescript
interface Props {
  size?: 'small' | 'medium' | 'large' | 'custom';
  width?: string; // Pour custom
  height?: string; // Pour custom
  color?: 'sand' | 'blue' | 'clay' | 'custom';
  customColor?: string; // Pour custom
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  opacity?: number;
  animationDelay?: string;
  className?: string;
}
```

**Utilisation** :
```astro
<Blob 
  size="large" 
  color="sand" 
  position={{ top: '-10%', right: '-10%' }}
/>
```

**Fichiers à modifier** : Tous les composants contenant des blobs (voir section 3.2).

---

### 🟡 Priorité Moyenne

#### 5.3 `SectionWithBorders.astro`
**Raison** : Éliminer la duplication des sections avec bordures.

**Props** :
```typescript
interface Props {
  bgColor?: 'sand' | 'blue' | 'clay';
  bgOpacity?: number;
  padding?: 'small' | 'medium' | 'large';
  className?: string;
}
```

**Utilisation** :
```astro
<SectionWithBorders bgColor="blue" bgOpacity={10}>
  <!-- Contenu -->
</SectionWithBorders>
```

**Fichiers à modifier** : Voir section 3.3.

---

#### 5.4 `ArticleCard.astro` (optionnel)
**Raison** : Encapsuler la structure complète d'une carte d'article dans `ArticlesList.astro`.

**Props** :
```typescript
interface Props {
  article: Article;
  index: number;
  thumbnailColor: { bg: string; shape: string };
  isEven: boolean;
}
```

**Impact** : Réduction de la complexité de `ArticlesList.astro`, meilleure réutilisabilité.

---

## 6. Scripts à déplacer

### 🔴 Priorité Haute

#### 6.1 Scripts d'animation → `/src/utils/animations.ts`
**Scripts concernés** :
- IntersectionObserver pour `.reveal` (Layout.astro)
- IntersectionObserver pour `.section-fade` (Layout.astro)
- Parallaxe sur `.blob-parallax` (Layout.astro)

**Structure proposée** :
```
src/
  utils/
    animations.ts
```

**Fonctions à créer** :
- `initRevealAnimations()`
- `initSectionFadeAnimations()`
- `initParallaxBlobs()`
- `initAllAnimations()` (orchestrateur)

---

#### 6.2 Script de filtrage → `/src/utils/articleFilters.ts`
**Script concerné** :
- Filtrage des articles par catégorie (ArticlesList.astro)

**Fonctions à créer** :
- `initArticleFilters()`

---

#### 6.3 Script menu mobile → `/src/utils/mobileMenu.ts`
**Script concerné** :
- Toggle du menu mobile (Navbar.astro)

**Fonctions à créer** :
- `initMobileMenu()`

---

#### 6.4 Script reading progress → `/src/utils/readingProgress.ts`
**Script concerné** :
- Barre de progression de lecture (ReadingProgress.astro)

**Fonctions à créer** :
- `initReadingProgress()`

---

### 🟢 Structure proposée

```
src/
  utils/
    animations.ts
    articleFilters.ts
    mobileMenu.ts
    readingProgress.ts
```

**Avantages** :
- Code organisé et réutilisable
- Meilleure testabilité
- Meilleure mise en cache par le navigateur
- Séparation claire des préoccupations

---

## 7. Couleurs hardcodées

### 🔴 Priorité Haute

#### 7.1 Couleurs répétées dans les classes Tailwind
**Problème** : Nombreuses couleurs hardcodées dans les classes Tailwind arbitraires (`bg-[#E5BAAD]`, `text-[#C5A070]`, etc.).

**Couleurs identifiées** :
- `#FDFCFB` (background principal)
- `#F2E9E1` (sand)
- `#D7E5E5` (sage-blue)
- `#E5BAAD` (clay)
- `#C5A070` (logo-sand)
- `#1A1A1A` (texte principal)
- `#D4D4D4` (texte code)
- `#FAFAF9` (background clair)

**Solution** : Définir ces couleurs dans la configuration Tailwind (`tailwind.config.mjs` ou via CSS variables).

**Exemple de configuration** :
```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        background: '#FDFCFB',
        sand: {
          DEFAULT: '#F2E9E1',
          light: 'rgba(242, 233, 225, 0.4)',
        },
        'sage-blue': {
          DEFAULT: '#D7E5E5',
          light: 'rgba(215, 229, 229, 0.2)',
        },
        clay: '#E5BAAD',
        'logo-sand': '#C5A070',
        // etc.
      }
    }
  }
}
```

**Impact** : 
- Cohérence garantie
- Maintenance simplifiée
- Meilleure autocomplétion dans l'IDE
- Possibilité de thèmes futurs

**Fichiers à modifier** : Tous les composants utilisant des couleurs hardcodées (voir grep résultats section 1).

---

## 8. Fonctions dupliquées

### 🔴 Priorité Haute

#### 8.1 `formatDate()`
**Problème** : Fonction dupliquée dans 3 fichiers.

**Fichiers concernés** :
- `src/components/ArticlesList.astro` (ligne 14)
- `src/pages/articles/[...slug].astro` (ligne 60)
- `src/pages/og/[...slug].ts` (ligne 59)

**Solution** : Créer `/src/utils/date.ts` avec :
```typescript
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
```

**Impact** : DRY, maintenance simplifiée.

---

#### 8.2 `getCategoryLabel()`
**Problème** : Fonction dupliquée dans 3 fichiers.

**Fichiers concernés** :
- `src/components/ArticlesList.astro` (ligne 20)
- `src/pages/articles/[...slug].astro` (ligne 66)
- `src/pages/og/[...slug].ts` (ligne 66)

**Solution** : Ajouter à `/src/utils/date.ts` ou créer `/src/utils/articles.ts` :
```typescript
export function getCategoryLabel(category: string): string {
  return category === 'reflexion' ? 'Réflexion' : 'Analyse';
}
```

**Impact** : DRY, maintenance simplifiée.

---

#### 8.3 `calculateReadingTime()`
**Problème** : Fonction dupliquée dans 2 fichiers.

**Fichiers concernés** :
- `src/components/ArticlesList.astro` (ligne 25)
- `src/pages/articles/[...slug].astro` (ligne 71)

**Solution** : Ajouter à `/src/utils/articles.ts` :
```typescript
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
}
```

**Impact** : DRY, maintenance simplifiée.

---

## 9. Résumé des priorités

### 🔴 Priorité Haute (À faire en premier)

1. **Créer composant `ArticleMetadata.astro`** (élimine duplication HTML)
2. **Créer composant `Blob.astro`** (élimine duplication massive)
3. **Déplacer scripts inline vers `/src/utils/`** (4 scripts)
4. **Extraire fonctions dupliquées vers `/src/utils/`** (3 fonctions)
5. **Supprimer styles inline** (border-radius organique, font-family)
6. **Nettoyer duplications CSS** (dropcap, blockquote, full-width-section)
7. **Configurer couleurs Tailwind** (élimine hardcoding)

**Impact estimé** : 
- Réduction de ~200-300 lignes de code dupliqué
- Meilleure maintenabilité
- Code plus testable
- Cohérence visuelle garantie

---

### 🟡 Priorité Moyenne (À faire ensuite)

1. **Créer composant `SectionWithBorders.astro`**
2. **Optimiser classes de délai d'animation**
3. **Analyser migration styles article vers Tailwind pur**
4. **Créer composant `ArticleCard.astro`** (optionnel)

**Impact estimé** : 
- Réduction supplémentaire de ~100-150 lignes
- Amélioration de l'organisation

---

### 🟢 Priorité Basse (Améliorations futures)

1. **Analyser consolidation des composants de page** (Approach*, Situations*, Diagnostic*)
2. **Documenter les choix de design** (pourquoi certaines abstractions ne sont pas faites)
3. **Créer un guide de style** pour les futurs développements

---

## 📊 Métriques

### Avant optimisation (estimation)
- **Lignes de code dupliquées** : ~300-400
- **Scripts inline** : 4 scripts (~150 lignes)
- **Styles inline** : ~10-15 occurrences
- **Fonctions dupliquées** : 3 fonctions (3x duplication)
- **CSS redondant** : ~50-70 lignes

### Après optimisation (objectif)
- **Lignes de code dupliquées** : ~0-50 (réduction 85-90%)
- **Scripts inline** : 0 (tous dans `/src/utils/`)
- **Styles inline** : 0-2 (seulement si vraiment nécessaire)
- **Fonctions dupliquées** : 0 (toutes dans `/src/utils/`)
- **CSS redondant** : ~0-10 lignes (réduction 80-90%)

---

## 🎯 Plan d'action recommandé

### Phase 1 : Utilitaires et fonctions (1-2h)
1. Créer `/src/utils/date.ts` avec `formatDate()`
2. Créer `/src/utils/articles.ts` avec `getCategoryLabel()` et `calculateReadingTime()`
3. Mettre à jour tous les fichiers pour utiliser ces utilitaires

### Phase 2 : Scripts (2-3h)
1. Créer `/src/utils/animations.ts`
2. Créer `/src/utils/articleFilters.ts`
3. Créer `/src/utils/mobileMenu.ts`
4. Créer `/src/utils/readingProgress.ts`
5. Mettre à jour les composants pour importer ces utilitaires

### Phase 3 : Composants (3-4h)
1. Créer `ArticleMetadata.astro`
2. Créer `Blob.astro`
3. Mettre à jour tous les fichiers utilisant ces patterns

### Phase 4 : Styles et CSS (2-3h)
1. Supprimer styles inline (border-radius, font-family)
2. Nettoyer duplications CSS (dropcap, blockquote, full-width-section)
3. Configurer couleurs Tailwind

### Phase 5 : Nettoyage final (1h)
1. Vérifier que tout fonctionne
2. Tester le build
3. Documenter les changements

**Temps total estimé** : 9-13 heures

---

## 📝 Notes importantes

- **Ne pas over-engineer** : Certaines duplications peuvent être justifiées si elles simplifient la lecture du code
- **Tester après chaque phase** : S'assurer que le build fonctionne et que rien n'est cassé
- **Documenter les choix** : Si une duplication est gardée, expliquer pourquoi
- **Prioriser la lisibilité** : Parfois, un peu de duplication vaut mieux qu'une abstraction complexe

---

**Fin de l'audit**
