# Brief Design : adapter les pages /ressources au design julien-brionne.fr

## Le problème

Les pages migrées depuis productcopilot.fr utilisent le design system Product Copilot (dark mode, accent neon, sans-serif). Elles doivent adopter le design system julien-brionne.fr (light mode, serif, accents sand/clay).

## Design system julien-brionne.fr (source de vérité)

### Couleurs

Fond : #FDFCFB (ivory)
Texte principal : gray-900
Texte secondaire : gray-600, gray-500
Labels : gray-400
Accent chaud : #C5A070 (gold, point du logo)
Accent doux : #E5BAAD (clay, soulignements, bordures)
Fond décoratif : #F2E9E1 (sand, halos, blobs)

### Typographie

Labels de section :
font-mono text-[10px] tracking-[0.3em] text-gray-400 uppercase
Exemple : [ RESSOURCES ]

Titres H1 :
font-serif text-5xl md:text-6xl lg:text-7xl (voire text-8xl sur /approche)
Italique pour la deuxième partie : italic text-gray-600

Sous-titres / descriptions :
text-xl md:text-2xl text-gray-600 font-light leading-relaxed
Parfois : italic font-serif

Corps de texte :
text-lg text-gray-500 font-light

Petits labels et CTAs :
font-mono text-[10px] tracking-widest

### Layout

Container : max-w-[1150px] mx-auto px-8
Sections numérotées : 01 / TITRE, 02 / TITRE (font-mono)
Spacing header : pt-24 pb-20 (ou pt-32 pb-16 selon les pages)
Spacing entre sections : mb-32 ou py-20
Entrées animées : class "reveal" sur les blocs

### Composants récurrents

Bouton principal : class "btn-cta" + font-mono tracking-widest text-[10px]
Bouton secondaire : font-mono text-[10px] tracking-widest text-gray-600 border border-gray-300 px-8 py-4
Séparateur : class "editorial-rule" (ligne fine décorative)
Halos décoratifs : div.halo-sand (fond radial gradient #F2E9E1 en position absolue, opacity-50)
Blobs : div.blob (forme organique, bg-[#F2E9E1])

### Exemples de headers existants (à reproduire)

Page /approche :
```html
<div class="font-mono mb-8 text-gray-400 tracking-[0.2em]">[ CE QUE JE FAIS ]</div>
<h1 class="text-5xl md:text-6xl lg:text-8xl leading-[1.05] mb-12 font-serif">
  Je m'immerge dans l'équipe<br>
  <span class="italic text-gray-800">pour remettre de l'ordre.</span>
</h1>
```

Page /references :
```html
<div class="font-mono mb-6 text-gray-400">RÉFÉRENCES</div>
<div class="editorial-rule mb-10"></div>
<h1 class="text-4xl md:text-5xl lg:text-6xl leading-tight font-serif text-gray-900 mb-8">
  Quelques missions.<br>
  <span class="italic text-gray-600">Le même problème de fond.</span>
</h1>
```

Page 404 :
```html
<div class="font-mono mb-8 text-gray-400 tracking-[0.2em]">[ 404 ]</div>
<h1 class="text-5xl md:text-6xl lg:text-7xl font-serif mb-8">
  Cette page <span class="italic text-gray-600">n'existe pas.</span>
</h1>
```

## Mapping Product Copilot → julien-brionne.fr

### Couleurs à remplacer

| Product Copilot | julien-brionne.fr |
|---|---|
| bg-[#0F0F0F] (fond dark) | Supprimer (fond ivory du Layout) |
| text-[#F5F5F5] (texte light) | text-gray-900 |
| text-[#A3A3A3] (texte secondaire) | text-gray-500 |
| bg-[#E8FF8B] (accent neon) | Utiliser btn-cta existant ou bg-[#C5A070] |
| text-[#E8FF8B] (accent texte) | text-[#C5A070] ou text-gray-900 |
| border-[#E8FF8B]/20 | border-[#E5BAAD] ou border-gray-200 |
| bg-[#E8FF8B]/10 | bg-[#F2E9E1] |
| bg-[#141414] | Supprimer |
| card-glass | Remplacer par border border-gray-200 bg-white/50 ou fond transparent |

### Typographie à remplacer

| Product Copilot | julien-brionne.fr |
|---|---|
| font-sans (Inter) pour les titres | font-serif pour les H1/H2 |
| text-3xl font-bold tracking-tighter | text-5xl font-serif |
| font-semibold uppercase tracking-widest (badges) | font-mono text-[10px] tracking-[0.3em] text-gray-400 |

### Structure de page type (page intérieure /ressources/*)

```
<Layout title="..." description="...">
  <Navbar currentPage="ressources" />
  <Breadcrumb items={[
    { name: 'Accueil', url: '/' },
    { name: 'Ressources', url: '/ressources' },
    { name: 'Nom de la page' }
  ]} />
  <main>
    <header class="relative max-w-[1150px] mx-auto px-8 pt-24 pb-20">
      <div class="max-w-3xl reveal">
        <div class="font-mono mb-6 text-gray-400 tracking-[0.2em]">[ LABEL ]</div>
        <div class="editorial-rule mb-10"></div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-8">
          Titre principal.<br>
          <span class="italic text-gray-600">Deuxième partie.</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl">
          Description.
        </p>
      </div>
    </header>

    <!-- Contenu spécifique (outil interactif, page de vente, etc.) -->

    <ReferencesFooter />   <!-- CTA "Discuter d'une situation" -->
    <Footer />
  </main>
</Layout>
```

## Adaptation par page

### /ressources/generateur-prd

Header :
- Label : [ OUTIL GRATUIT ]
- H1 : "Génère un PRD structuré" + "en 5 minutes." en italic
- Description : texte existant adapté

Corps :
- Le formulaire PRDGenerator garde sa logique mais perd le dark mode
- Inputs : border border-gray-300 bg-white, focus:border-[#C5A070]
- Bouton submit : btn-cta
- Zone de résultat (prompt généré) : bg-[#F2E9E1] p-6 font-mono text-sm

Section "Comment ça marche" :
- Numérotation 01 / 02 / 03 en font-mono text-gray-400
- Pas de cards dark, juste du texte structuré

### /ressources/prompts-discovery

Header :
- Label : [ PROMPTS DISCOVERY ]
- H1 : "10 prompts pour structurer" + "ton discovery." en italic

Corps :
- Le prompt explorer (tabs, contenu, variables) garde sa logique
- Tabs : font-mono text-[10px], actif = text-gray-900 border-b border-[#C5A070], inactif = text-gray-400
- Zone prompt : bg-[#F2E9E1] ou bg-white border border-gray-200
- Badge "Pro tip" : text-[#C5A070] font-semibold
- Email gate : formulaire sobre, btn-cta pour le submit

### /ressources/vibe-coding-pm

Header :
- Label : [ PACK ]
- H1 : "De l'idée au produit" + "qui tourne." en italic
- Prix : 29€ en font-mono

Corps :
- Les 4 phases : numérotées 01-04 en font-mono
- Cards de contenu : border border-gray-200 p-6
- Badges "Phase 1" etc. : font-mono text-[10px] tracking-[0.3em] text-gray-400
- Section FAQ : style accordéon sobre
- CTA achat : btn-cta pointant vers LemonSqueezy

### /ressources/systeme-discovery

Header :
- Label : [ PACK · BIENTÔT DISPONIBLE ]
- H1 : "Le système complet" + "pour ton discovery." en italic

Corps :
- Cards "Ce que le pack inclut" : border border-gray-200 p-6
- Badge "Nouveau" : font-mono text-[10px] text-[#C5A070]
- Formulaire email : sobre, btn-cta
- Comparaison "Gratuit vs Pack" : deux colonnes, pas de card-glass

## Points d'attention

1. Les composants React (PRDGenerator, PackDiscovery, PackSystemeForm) s'intègrent dans Astro via client:load. Leur styling interne doit passer en light mode.

2. Ne pas utiliser les classes card-glass, divider-shimmer, btn-glow de Product Copilot. Elles n'existent pas dans le design system JB.

3. Le fond de page est géré par le Layout. Les composants ne doivent pas définir de background global.

4. Les animations "reveal" sont déjà gérées par le JS existant du site JB. Ajouter la class "reveal" sur les blocs pour qu'ils apparaissent au scroll.

5. Les OG images doivent être générées pour les nouvelles pages (ajouter les entrées dans src/pages/og/[...slug].ts).