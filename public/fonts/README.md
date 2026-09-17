# Fontes du site

Les deux familles sont auto-hébergées : aucun appel à Google au chargement
d'une page. Les woff2 viennent de Google Fonts et ne sont pas modifiés ;
les `unicode-range` déclarés dans `src/styles/global.css` sont ceux de Google,
donc un sous-ensemble ne se télécharge que si un caractère l'appelle.

**Instrument Sans** (variable 400–700, SIL OFL) — navigation, marque,
informations. Sous-ensembles latin et latin-ext, téléchargés le 01/09/2026.

**Newsreader** (variable 300–500 romain, 300–400 italique, SIL OFL) — titres,
récits, citations, logotype. Sous-ensembles latin et latin-ext, téléchargés le
17/09/2026. L'axe optique (`opsz 6..72`) est conservé : c'est lui qui accorde
le dessin des lettres à la taille du texte, du corps de lecture au grand titre.
Il pèse : les mêmes coupes sans cet axe tomberaient de 272 à 120 Ko.

Sa version statique TTF vit dans `src/og-fonts/` pour la génération des
images OG — ne pas confondre les deux jeux.

Seuls les sous-ensembles **latin** sont préchargés dans `src/layouts/Layout.astro` :
ce sont eux qui dessinent le premier écran.
