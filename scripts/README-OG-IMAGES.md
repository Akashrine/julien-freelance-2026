# Génération des images Open Graph WebP

## Installation

Le script utilise `cwebp` qui doit être installé sur votre système :

```bash
brew install webp
```

## Usage

### Convertir tous les PNG Open Graph en WebP

```bash
npm run og:convert
```

ou directement :

```bash
node scripts/generate-og-images.js --all
```

Cette commande :
- Trouve tous les fichiers PNG dans `public/` qui commencent par `og-`
- Les convertit en WebP avec une qualité de 90%
- Ignore les fichiers déjà convertis et à jour

### Convertir un fichier spécifique

```bash
npm run og:convert:single [input-file] [output-name]
```

Exemples :

```bash
# Convertir un PNG dans public/
node scripts/generate-og-images.js og-approche.png og-approche.webp

# Convertir depuis un chemin absolu
node scripts/generate-og-images.js /path/to/image.png og-custom.webp
```

## Structure recommandée

Pour chaque page qui nécessite une image Open Graph :

1. **Créer l'image PNG** dans `public/` avec le préfixe `og-` :
   - `og-home.png` → `og-home.webp`
   - `og-approche.png` → `og-approche.webp`
   - `og-diagnostic.png` → `og-diagnostic.webp`
   - etc.

2. **Convertir en WebP** :
   ```bash
   npm run og:convert
   ```

3. **Utiliser dans les pages** :
   ```astro
   <Layout
     ogImage="/og-approche.webp"
     ...
   />
   ```

## Format recommandé pour les images OG

- **Dimensions** : 1200x630px (ratio 1.91:1, standard Open Graph)
- **Format source** : PNG avec transparence si nécessaire
- **Format final** : WebP (qualité 90%)
- **Taille cible** : < 200KB pour de bonnes performances

## Notes

- Le script vérifie automatiquement si le WebP existe déjà et est plus récent que le PNG
- Si le PNG est modifié, le WebP sera régénéré automatiquement
- Les fichiers sont sauvegardés dans `public/` pour être servis statiquement
