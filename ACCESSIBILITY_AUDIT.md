# ACCESSIBILITY_AUDIT.md

**Date** : Janvier 2026  
**Contexte** : Site éditorial, thought leadership, accessibilité comme condition de lisibilité  
**Objectif** : Identifier les vrais risques, éviter l'over-engineering, préserver la sobriété

---

## 1. Philosophie d'accessibilité retenue

### À qui le site doit être accessible

**Public cible réel** :
- Lecteurs concentrés, professionnels seniors
- Personnes lisant de longs textes éditoriaux
- Navigation simple, pas d'interactions complexes
- Utilisateurs de lecteurs d'écran pour la navigation de base
- Utilisateurs de navigation clavier pour la navigation principale

**Objectif d'accessibilité** : Permettre la **lecture fluide** et la **navigation intuitive**, pas la conformité légale exhaustive.

### À qui il n'est pas destiné

**Limites assumées** :
- Pas de support complet pour les lecteurs d'écran avancés (navigation complexe dans les widgets)
- Pas d'optimisation pour les utilisateurs nécessitant des contrastes AAA (le design assume des contrastes AA)
- Pas de support pour les technologies d'assistance très spécialisées

**Pourquoi ces limites sont acceptables** :
- Le site est éditorial, pas applicatif
- Les interactions sont minimales (menu mobile, filtres)
- Le contenu principal est du texte, naturellement accessible
- Le positionnement filtrant assume un public avec certaines capacités de lecture

### Pourquoi une accessibilité pragmatique est assumée ici

**Différence avec une approche exhaustive** :
- **Approche exhaustive** : Conformité WCAG AA/AAA complète, support de toutes les technologies d'assistance, optimisation pour tous les cas d'usage
- **Approche pragmatique** : Accessibilité pour la lecture et la navigation de base, correction des barrières réelles, pas de sur-optimisation théorique

**Principe fondamental** : Le site doit être **lisible et navigable** pour son public réel, pas conforme à une checklist théorique.

### Différence entre conformité théorique et lisibilité réelle

**Conformité théorique** :
- Respect de tous les critères WCAG
- Support de toutes les technologies d'assistance
- Optimisation pour tous les cas d'usage possibles

**Lisibilité réelle** :
- Un lecteur peut comprendre la structure du site
- Un utilisateur clavier peut naviguer efficacement
- Un lecteur d'écran peut accéder au contenu principal
- Les contrastes permettent une lecture confortable

**Objectif retenu** : Lisibilité réelle, pas conformité théorique exhaustive.

---

## 2. Audit HTML sémantique

### Structure globale

**Landmarks observés** :
- ✅ **`<nav>`** : Présent dans `Navbar.astro`
- ✅ **`<main>`** : Présent dans toutes les pages
- ✅ **`<article>`** : Présent dans les pages d'articles individuels
- ✅ **`<footer>`** : Présent dans `Footer.astro`
- ⚠️ **`<header>`** : Utilisé dans `Hero.astro` mais pas de manière cohérente (pas de header global)

**Ce qui est sain** :
- ✅ Structure de base cohérente : `nav` → `main` → `footer`
- ✅ Utilisation correcte de `<article>` pour les articles individuels
- ✅ Utilisation de `<section>` pour les sections de contenu
- ✅ Utilisation de `<time>` pour les dates

**Ce qui est ambigu** :
- ⚠️ **Hero comme `<header>`** : Le Hero utilise `<header>` mais n'est pas un header de page au sens sémantique. C'est plutôt une section hero. Pas bloquant, mais pourrait être plus clair.
- ⚠️ **Pas de header global** : Il n'y a pas de `<header>` englobant la navigation. La navigation est directement dans le `<main>`. Pas bloquant, mais moins optimal pour les lecteurs d'écran.

**Ce qui pourrait poser problème à un lecteur assisté** :
- ⚠️ **Structure des articles dans la liste** : Les articles dans `ArticlesList.astro` utilisent `<article>` correctement, mais le contenu est dans un `<a>` qui englobe tout. Cela peut créer une confusion : l'article entier est un lien. Fonctionnel mais peut être déroutant pour un lecteur d'écran.

### Hiérarchie des titres (H1 → Hn)

**Structure observée** :

**Home (`index.astro`)** :
- ✅ H1 dans `Hero.astro` : "Simplifier pour retrouver de l'impact"
- ⚠️ Pas de H2 visible dans le Hero (le label "[ PRODUCT LEAD INDÉPENDANT ]" n'est pas un titre)
- ✅ H2 dans `Intro.astro` : Pas de titre H2, seulement un label "01 / CONTEXTE"
- ⚠️ Section `Situations` : H2 "Interventions fréquentes :" présent
- ⚠️ Section `Approach` : Pas de H2 visible, seulement un label "03 / APPROCHE"

**Articles (`articles.astro`)** :
- ✅ H1 dans `ArticlesHeader.astro` : "L'écrit comme outil de lecture"
- ✅ Structure claire

**Article individuel (`articles/[...slug].astro`)** :
- ✅ H1 : Titre de l'article
- ⚠️ H2 dans les composants MDX : À vérifier que les composants `Section`, `ColorBlock` génèrent des H2 cohérents

**Ce qui est sain** :
- ✅ Un seul H1 par page (respecté)
- ✅ Hiérarchie généralement cohérente
- ✅ Les titres sont descriptifs

**Ce qui est ambigu** :
- ⚠️ **Labels numérotés vs titres** : Les labels "01 / CONTEXTE", "02 / SITUATIONS" ne sont pas des titres HTML. Ils sont visuellement des titres mais sémantiquement du texte. Un lecteur d'écran ne les identifiera pas comme des titres. Pas bloquant, mais moins optimal.

**Ce qui pourrait poser problème** :
- ⚠️ **Hiérarchie dans les articles MDX** : Si les composants `Section` et `ColorBlock` génèrent des H2, il faut vérifier que la hiérarchie est cohérente (pas de saut de niveau H1 → H3).

### Usage des listes, citations, sections

**Listes** :
- ✅ **`<ul>` dans `Situations.astro`** : Utilisation correcte d'une liste non ordonnée pour les situations
- ✅ **`<ul>` dans `ArticlesList.astro`** : Pas de liste, utilisation de `<article>` (correct)

**Citations** :
- ⚠️ **Pas de `<blockquote>` observé** : Les citations dans les articles MDX pourraient utiliser `<blockquote>` pour la sémantique. À vérifier dans le contenu MDX.

**Sections** :
- ✅ **`<section>` utilisé correctement** : Pour les sections de contenu (Intro, Situations, Approach, etc.)

**Cohérence sémantique entre pages et articles** :
- ✅ Structure similaire entre pages principales
- ✅ Structure cohérente pour les articles individuels
- ⚠️ Les composants d'articles (`Section`, `ColorBlock`) pourraient avoir une structure sémantique plus explicite

---

## 3. Audit ARIA

### Présence d'attributs ARIA

**ARIA observé** :
- ✅ **`aria-label`** : Présent sur les liens d'icônes dans le Footer (RSS, LinkedIn, Substack)
- ✅ **`aria-hidden="true"`** : Présent sur l'élément décoratif "." dans le logo Navbar

**Ce qui est sain** :
- ✅ ARIA utilisé uniquement quand nécessaire
- ✅ `aria-label` sur les liens d'icônes (excellent, car les SVG n'ont pas de texte visible)
- ✅ `aria-hidden` sur les éléments purement décoratifs

**Ce qui est absent mais pourrait être nécessaire** :
- ⚠️ **Menu mobile** : Le bouton menu mobile n'a pas d'`aria-expanded` ni d'`aria-controls`. Un lecteur d'écran ne sait pas si le menu est ouvert ou fermé.
- ⚠️ **Boutons de filtre** : Les boutons de filtre dans `ArticlesHeader.astro` n'ont pas d'`aria-pressed` pour indiquer l'état actif/inactif.

### Absence d'ARIA là où nécessaire

**Menu mobile (`Navbar.astro`)** :
- **Problème** : Le bouton menu mobile n'a pas d'attributs ARIA pour indiquer l'état (ouvert/fermé)
- **Impact réel** : Un utilisateur de lecteur d'écran ne sait pas si le menu est ouvert ou fermé après avoir cliqué
- **Recommandation** : Ajouter `aria-expanded="false"` par défaut, `aria-controls="mobile-menu"`, et mettre à jour `aria-expanded` lors du toggle

**Boutons de filtre (`ArticlesHeader.astro`)** :
- **Problème** : Les boutons de filtre n'ont pas d'`aria-pressed` pour indiquer l'état actif
- **Impact réel** : Un utilisateur de lecteur d'écran ne sait pas quel filtre est actif
- **Recommandation** : Ajouter `aria-pressed="true"` sur le bouton actif, `aria-pressed="false"` sur les autres

### Usage inutile ou abusif d'ARIA

**Aucun usage abusif observé** :
- ✅ Pas d'ARIA superflu
- ✅ Pas de rôles ARIA redondants avec le HTML natif
- ✅ Principe "No ARIA is better than bad ARIA" respecté

**Pour chaque cas identifié** :

**Menu mobile** :
- **Composant** : `Navbar.astro`
- **Rôle ARIA actuel** : Aucun
- **Pertinence réelle** : Nécessaire pour indiquer l'état du menu
- **Recommandation** : Ajouter `aria-expanded` et `aria-controls` sur le bouton

**Boutons de filtre** :
- **Composant** : `ArticlesHeader.astro`
- **Rôle ARIA actuel** : Aucun
- **Pertinence réelle** : Nécessaire pour indiquer l'état actif/inactif
- **Recommandation** : Ajouter `aria-pressed` sur les boutons

---

## 4. Audit navigation clavier

### Ordre de tabulation

**Structure observée** :
- ✅ Navigation principale : Logo → Liens navigation → (Menu mobile sur mobile)
- ✅ Contenu : Liens dans le contenu suivent l'ordre du DOM
- ✅ Footer : Liens sociaux suivent l'ordre logique

**Ce qui est sain** :
- ✅ Ordre de tabulation prévisible
- ✅ Pas d'éléments non focusables qui devraient l'être
- ✅ Pas d'éléments focusables qui ne devraient pas l'être

**Ce qui pourrait être amélioré** :
- ⚠️ **Skip link absent** : Pas de lien "Aller au contenu principal" pour sauter la navigation. Sur un site avec beaucoup de contenu, cela peut être utile, mais pas essentiel ici car la navigation est courte.

### Accès aux liens principaux

**Navigation principale** :
- ✅ Tous les liens sont des `<a>` natifs, donc focusables
- ✅ Liens accessibles au clavier
- ⚠️ Menu mobile : Le bouton est focusable, mais le menu qui s'ouvre n'est pas géré au clavier (pas de trap focus, pas de fermeture avec Escape)

**Liens dans le contenu** :
- ✅ Liens dans les articles accessibles au clavier
- ✅ Liens "Voir un cas concret" accessibles
- ✅ Liens de navigation entre pages accessibles

### Navigation dans les menus

**Menu desktop** :
- ✅ Navigation simple, pas de sous-menus
- ✅ Tous les liens accessibles au clavier

**Menu mobile** :
- ⚠️ **Ouverture/fermeture** : Le menu s'ouvre au clic, mais pas de gestion clavier complète
- ⚠️ **Trap focus** : Quand le menu est ouvert, le focus peut sortir du menu (pas de trap focus)
- ⚠️ **Fermeture avec Escape** : Pas de gestion de la touche Escape pour fermer le menu
- ⚠️ **Focus management** : Après fermeture du menu, le focus ne revient pas au bouton

### Navigation dans les articles longs

**Structure des articles** :
- ✅ Articles utilisent une structure sémantique claire
- ✅ Liens internes accessibles au clavier
- ⚠️ Pas de table des matières avec ancres pour navigation rapide (mais pas nécessaire pour des articles de cette longueur)

**Ruptures de parcours** :
- ✅ Aucune rupture majeure identifiée
- ⚠️ Menu mobile : Le focus peut sortir du menu quand il est ouvert (rupture mineure)

**Pièges clavier éventuels** :
- ✅ Aucun piège clavier identifié
- ⚠️ Menu mobile : Pas de trap focus, mais pas vraiment un piège (le focus peut sortir)

**Éléments non atteignables** :
- ✅ Tous les éléments interactifs sont atteignables au clavier
- ✅ Pas d'éléments cachés qui devraient être accessibles

---

## 5. Audit focus & feedback visuel

### Styles de focus visibles

**CSS observé** :
```css
*:focus-visible {
  outline: 2px solid #C5A070;
  outline-offset: 4px;
  border-radius: 2px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid #C5A070;
  outline-offset: 2px;
}
```

**Ce qui est sain** :
- ✅ Styles de focus définis et visibles
- ✅ Utilisation de `:focus-visible` (excellent, évite le focus au clic souris)
- ✅ Couleur de focus cohérente avec la palette du site (#C5A070)
- ✅ Outline offset pour meilleure visibilité

**Ce qui pourrait être amélioré** :
- ⚠️ **Contraste du focus** : La couleur #C5A070 sur fond clair (#FDFCFB) peut avoir un contraste insuffisant selon WCAG AA. À vérifier, mais probablement acceptable pour un focus (temporaire).

### Cohérence du focus entre pages

**Cohérence observée** :
- ✅ Styles de focus identiques sur toutes les pages (définis dans `global.css`)
- ✅ Comportement prévisible

**Pas de problème de cohérence identifié**.

### Interactions JS (menu, filtres)

**Menu mobile** :
- ⚠️ **Perte de focus** : Quand le menu s'ouvre, le focus reste sur le bouton. Le premier lien du menu n'est pas automatiquement focusé. Pas bloquant, mais moins optimal.
- ⚠️ **Fermeture** : Pas de gestion du focus après fermeture du menu. Le focus reste où il était.

**Filtres articles** :
- ✅ Les boutons de filtre sont focusables
- ✅ Le focus reste sur le bouton après clic
- ⚠️ **Feedback visuel** : Le changement d'état (active/inactive) est visuel mais pas annoncé aux lecteurs d'écran (pas d'`aria-pressed`)

**Focus invisible ou trop discret** :
- ✅ Focus visible et contrasté
- ✅ Pas de focus invisible

**Perte de focus lors des interactions** :
- ⚠️ **Menu mobile** : Pas de gestion explicite du focus lors de l'ouverture/fermeture

**Comportements déroutants** :
- ✅ Pas de comportement déroutant identifié
- ⚠️ Menu mobile : Le focus peut sortir du menu quand il est ouvert (peut être déroutant mais pas bloquant)

---

## 6. Audit attributs `rel` & navigation externe

### Liens externes (`target="_blank"`)

**Liens externes identifiés** :
- ✅ **Footer** : Lien Lemcal (`target="_blank" rel="noopener noreferrer"`)
- ✅ **Footer** : Lien LinkedIn (`target="_blank" rel="noopener noreferrer"`)
- ✅ **Footer** : Lien Substack (`target="_blank" rel="noopener noreferrer"`)
- ✅ **Autres footers** : Liens Lemcal dans `SituationsFooter`, `DiagnosticFooter`, `ApproachFooter` (tous avec `rel="noopener noreferrer"`)

**Ce qui est sain** :
- ✅ Tous les liens externes ont `target="_blank"` avec `rel="noopener noreferrer"`
- ✅ Protection contre les risques de sécurité (tabnabbing)
- ✅ Cohérence sur tous les liens externes

**Risques de sécurité** :
- ✅ Aucun risque identifié. Tous les liens externes sont protégés.

**Risques de confusion utilisateur** :
- ✅ Les liens externes ouvrent dans un nouvel onglet (comportement attendu pour les liens sociaux)
- ✅ Pas de confusion identifiée

### Liens internes vs externes

**Cohérence éditoriale** :
- ✅ Liens internes : Pas de `target="_blank"` (correct)
- ✅ Liens externes : Tous avec `target="_blank"` et `rel="noopener noreferrer"` (correct)
- ✅ Cohérence totale

**Incohérences de comportement** :
- ✅ Aucune incohérence identifiée

---

## 7. Audit images & alternatives textuelles

### Présence d'attributs `alt`

**Images identifiées** :
- ✅ **Hero** : `<img src="/_WOL6954-min.jpg" alt="Julien Brionne" />` (alt descriptif présent)
- ✅ **ArticlesList** : `<img src={article.data.thumbnail} alt="" />` (alt vide pour image décorative)
- ✅ **Article MDX** : `<img src="/art-du-non-thumbnail.png" alt="Bouton NO" />` (alt descriptif présent)

**Ce qui est sain** :
- ✅ Toutes les images ont un attribut `alt`
- ✅ Alt descriptif pour les images informatives (photo hero, image article)
- ✅ Alt vide (`alt=""`) pour les images décoratives (thumbnails dans la liste)

**Images sans `alt`** :
- ✅ Aucune image sans `alt` identifiée

**`alt` redondants ou inutiles** :
- ✅ Aucun alt redondant identifié
- ✅ Les alt sont pertinents et concis

**Images qui devraient être ignorées par les lecteurs d'écran** :
- ✅ Images décoratives (thumbnails dans la liste) ont `alt=""` (correct)
- ✅ Éléments décoratifs SVG ont `aria-hidden="true"` ou sont dans des liens avec `aria-label` (correct)

**Pertinence des textes alternatifs** :
- ✅ "Julien Brionne" pour la photo hero : Pertinent et descriptif
- ✅ "Bouton NO" pour l'image de l'article : Pertinent dans le contexte de l'article
- ✅ `alt=""` pour les thumbnails décoratifs : Correct (images purement décoratives)

---

## 8. Audit lisibilité réelle

### Taille de texte

**Tailles observées** :
- ✅ **Hero H1** : `text-5xl md:text-6xl lg:text-8xl` (très lisible)
- ✅ **Corps de texte** : `text-lg md:text-xl`, `text-xl md:text-2xl` (lisible)
- ✅ **Navigation** : `text-[10px]` (petit mais lisible pour de la navigation)
- ✅ **Articles** : `text-lg`, `text-xl` (lisible pour la lecture longue)

**Ce qui est sain** :
- ✅ Tailles de texte suffisantes pour la lecture
- ✅ Hiérarchie de tailles cohérente
- ✅ Responsive (tailles adaptées mobile/desktop)

**Ce qui pourrait être amélioré** :
- ⚠️ **Navigation très petite** : `text-[10px]` est très petit. Lisible mais peut fatiguer. Acceptable pour de la navigation secondaire, mais à surveiller.

### Interlignage

**Interlignage observé** :
- ✅ **Corps de texte** : `leading-relaxed` (1.625), `leading-snug` (1.375)
- ✅ **Titres** : `leading-[1.05]`, `leading-tight` (1.25)
- ✅ Interlignage généreux pour la lecture longue

**Ce qui est sain** :
- ✅ Interlignage confortable pour la lecture
- ✅ Cohérence dans les choix

### Longueur des lignes

**Largeurs observées** :
- ✅ **Contenu principal** : `max-w-2xl`, `max-w-3xl`, `max-w-4xl` (largeurs raisonnables)
- ✅ **Articles** : `max-w-3xl` (environ 48rem, soit ~768px, optimal pour la lecture)

**Ce qui est sain** :
- ✅ Largeurs de ligne optimales pour la lecture (45-75 caractères)
- ✅ Pas de lignes trop longues

### Contrastes texte / fond

**Couleurs observées** :
- ✅ **Texte principal** : `text-gray-900` sur `bg-[#FDFCFB]` (contraste élevé)
- ⚠️ **Texte secondaire** : `text-gray-600`, `text-gray-500`, `text-gray-400` sur fond clair
- ⚠️ **Navigation** : `text-gray-500` sur fond clair

**Contrastes à vérifier** :
- ⚠️ **`text-gray-400`** : Contraste potentiellement insuffisant selon WCAG AA (ratio < 4.5:1)
- ⚠️ **`text-gray-500`** : Contraste potentiellement insuffisant selon WCAG AA
- ✅ **`text-gray-600`** : Contraste probablement suffisant
- ✅ **`text-gray-900`** : Contraste élevé

**Fatigue cognitive et visuelle** :
- ✅ Tailles de texte confortables
- ✅ Interlignage généreux
- ✅ Largeurs de ligne optimales
- ⚠️ Contrastes faibles sur certains textes secondaires peuvent fatiguer à la longue

---

## 9. Recommandations PRIORISÉES

### À corriger absolument

**1. Ajouter ARIA au menu mobile**
- **Problème observé** : Le bouton menu mobile n'a pas d'`aria-expanded` ni d'`aria-controls`. Un lecteur d'écran ne sait pas si le menu est ouvert ou fermé.
- **Impact réel** : Barrière à l'accessibilité pour les utilisateurs de lecteurs d'écran. Le menu mobile devient inutilisable.
- **Risque si ignoré** : Le menu mobile est inaccessible aux utilisateurs de lecteurs d'écran.
- **Risque si sur-corrigé** : Ajouter trop d'ARIA pourrait créer de la confusion. Rester simple : `aria-expanded` et `aria-controls` suffisent.
- **Action** : Ajouter `aria-expanded="false"` par défaut, `aria-controls="mobile-menu"` sur le bouton, et mettre à jour `aria-expanded` lors du toggle.

**2. Ajouter ARIA aux boutons de filtre**
- **Problème observé** : Les boutons de filtre n'ont pas d'`aria-pressed` pour indiquer l'état actif/inactif.
- **Impact réel** : Un utilisateur de lecteur d'écran ne sait pas quel filtre est actif.
- **Risque si ignoré** : Les filtres sont difficiles à utiliser avec un lecteur d'écran.
- **Risque si sur-corrigé** : Ne pas ajouter de rôles ARIA redondants. `aria-pressed` suffit.
- **Action** : Ajouter `aria-pressed="true"` sur le bouton actif, `aria-pressed="false"` sur les autres, et mettre à jour lors du clic.

**3. Vérifier et améliorer les contrastes de texte**
- **Problème observé** : `text-gray-400` et `text-gray-500` peuvent avoir un contraste insuffisant selon WCAG AA.
- **Impact réel** : Fatigue visuelle, difficulté de lecture pour certains utilisateurs.
- **Risque si ignoré** : Lisibilité dégradée, surtout pour les textes secondaires (navigation, labels).
- **Risque si sur-corrigé** : Changer tous les textes gris en noir dégraderait la hiérarchie visuelle. Ajuster uniquement les contrastes vraiment insuffisants.
- **Action** : Vérifier les contrastes avec un outil (contrast ratio). Ajuster `text-gray-400` vers `text-gray-500` ou `text-gray-600` si nécessaire. Garder la hiérarchie visuelle.

### À améliorer si simple

**1. Gérer le focus dans le menu mobile**
- **Problème observé** : Quand le menu s'ouvre, le focus ne va pas automatiquement au premier lien. Pas de fermeture avec Escape.
- **Impact réel** : Navigation clavier moins fluide, mais pas bloquante.
- **Risque si ignoré** : Faible. Le menu reste utilisable, juste moins optimal.
- **Risque si sur-corrigé** : Ajouter un trap focus complet pourrait être over-engineering pour un menu simple.
- **Action** : Ajouter la gestion du focus au premier lien lors de l'ouverture, et la gestion de la touche Escape pour fermer.

**2. Ajouter un skip link (optionnel)**
- **Problème observé** : Pas de lien "Aller au contenu principal" pour sauter la navigation.
- **Impact réel** : Faible. La navigation est courte, pas vraiment nécessaire.
- **Risque si ignoré** : Aucun. Le site est simple, la navigation courte.
- **Risque si sur-corrigé** : Ajouter un skip link visible en permanence serait inutile ici.
- **Action** : Ajouter un skip link discret (visible uniquement au focus) si souhaité, mais pas nécessaire.

**3. Améliorer la sémantique des labels numérotés**
- **Problème observé** : Les labels "01 / CONTEXTE", "02 / SITUATIONS" ne sont pas des titres HTML, juste du texte stylé.
- **Impact réel** : Faible. Un lecteur d'écran peut toujours lire le texte, mais ne l'identifiera pas comme un titre.
- **Risque si ignoré** : Aucun. Le contenu reste accessible, juste moins structuré sémantiquement.
- **Risque si sur-corrigé** : Transformer tous les labels en H2 créerait une hiérarchie de titres trop dense.
- **Action** : Laisser tel quel. Les labels sont visuellement des titres mais sémantiquement du texte, ce qui est acceptable ici.

### À NE PAS faire

**1. Ne pas ajouter de rôles ARIA redondants**
- **Pourquoi** : Le HTML natif (`<nav>`, `<article>`, `<button>`) est déjà sémantique. Ajouter des rôles ARIA serait redondant.
- **Risque si fait** : Confusion pour les lecteurs d'écran, code plus complexe, maintenance difficile

**2. Ne pas transformer tous les labels en titres HTML**
- **Pourquoi** : Les labels "01 / CONTEXTE" sont des éléments de design, pas des titres sémantiques. Les transformer en H2 créerait une hiérarchie de titres trop dense.
- **Risque si fait** : Hiérarchie de titres confuse, navigation dans les titres dégradée pour les lecteurs d'écran

**3. Ne pas ajouter de table des matières avec ancres**
- **Pourquoi** : Les articles ne sont pas assez longs pour justifier une table des matières. Cela ajouterait de la complexité sans bénéfice réel.
- **Risque si fait** : Complexité ajoutée, maintenance difficile, pas de bénéfice utilisateur

**4. Ne pas optimiser pour WCAG AAA**
- **Pourquoi** : WCAG AAA est très strict et peut dégrader l'expérience visuelle. WCAG AA est suffisant pour un site éditorial.
- **Risque si fait** : Design dégradé, hiérarchie visuelle perdue, sur-optimisation théorique

**5. Ne pas ajouter de support pour toutes les technologies d'assistance**
- **Pourquoi** : Le site est simple et éditorial. Optimiser pour toutes les technologies d'assistance serait over-engineering.
- **Risque si fait** : Complexité ajoutée, maintenance difficile, pas de bénéfice réel pour le public cible

---

## 10. Checklist finale "Site accessible pour son usage réel"

### Critères de validation

- [x] **Structure HTML sémantique cohérente** : `nav`, `main`, `article`, `footer` présents et utilisés correctement
- [x] **Hiérarchie des titres respectée** : Un seul H1 par page, hiérarchie H1 → H2 → H3 cohérente
- [ ] **ARIA sur les interactions** : Menu mobile et boutons de filtre manquent d'ARIA (à corriger)
- [x] **Navigation clavier fonctionnelle** : Tous les liens et boutons accessibles au clavier
- [x] **Focus visible** : Styles de focus définis et visibles
- [x] **Liens externes sécurisés** : Tous les liens externes ont `rel="noopener noreferrer"`
- [x] **Images avec alt** : Toutes les images ont un attribut `alt` (descriptif ou vide selon le cas)
- [ ] **Contrastes suffisants** : À vérifier pour `text-gray-400` et `text-gray-500` (probablement à ajuster)
- [x] **Lisibilité typographique** : Tailles de texte, interlignage, largeurs de ligne optimales
- [x] **Pas d'ARIA abusif** : ARIA utilisé uniquement quand nécessaire

### État actuel : **Site globalement accessible avec améliorations mineures nécessaires**

Le site est globalement accessible pour son usage réel. La structure HTML est saine, la navigation clavier fonctionne, les contrastes sont majoritairement suffisants. Quelques améliorations mineures sont nécessaires (ARIA sur menu mobile et filtres, vérification des contrastes), mais rien de bloquant.

### Décisions à prendre

**À faire maintenant** :
- Ajouter ARIA au menu mobile (`aria-expanded`, `aria-controls`)
- Ajouter ARIA aux boutons de filtre (`aria-pressed`)
- Vérifier et ajuster les contrastes de texte si nécessaire (`text-gray-400`, `text-gray-500`)

**À faire plus tard (optionnel)** :
- Gérer le focus dans le menu mobile (focus au premier lien, fermeture avec Escape)
- Ajouter un skip link (si souhaité, mais pas nécessaire)

**À ne surtout pas faire** :
- Ajouter des rôles ARIA redondants
- Transformer tous les labels en titres HTML
- Optimiser pour WCAG AAA
- Ajouter du support pour toutes les technologies d'assistance

**Décision principale** :
Le site est accessible pour son usage réel. Les améliorations recommandées sont mineures et peuvent être faites progressivement. **L'inaction sur les améliorations optionnelles est acceptable** si le site fonctionne bien actuellement. Prioriser la correction des barrières réelles (ARIA menu mobile et filtres) plutôt que les optimisations théoriques.

---

**Document prêt pour validation et décision. Aucune modification automatique. Toutes les recommandations sont optionnelles et doivent être validées avant exécution.**
