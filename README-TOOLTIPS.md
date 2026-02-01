# 💬 Tooltips Interactifs

**Composant** : `Tooltip.astro`  
**Implémentation** : Vanilla JavaScript (CSS pur)  
**Taille** : ~2KB (CSS uniquement, pas de JS)

---

## Utilisation

### Dans les composants Astro

```astro
---
import Tooltip from '../components/Tooltip.astro';
---

<Tooltip text="Explication du concept" position="top">
  <span class="underline decoration-dotted">terme technique</span>
</Tooltip>
```

### Dans les articles MDX

```mdx
<Tooltip text="Un CPO (Chief Product Officer) est responsable de la stratégie produit" position="bottom">
  CPO
</Tooltip>
```

---

## Props

- **`text`** (requis) : Le texte à afficher dans le tooltip
- **`position`** (optionnel) : Position du tooltip (`'top'` | `'bottom'` | `'left'` | `'right'`)
  - Défaut : `'top'`
- **`className`** (optionnel) : Classes CSS supplémentaires pour le wrapper

---

## Exemples

### Tooltip simple
```astro
<Tooltip text="Cette fonctionnalité permet de filtrer les articles par catégorie">
  Filtres
</Tooltip>
```

### Tooltip avec position personnalisée
```astro
<Tooltip text="Cliquez pour voir plus d'informations" position="right">
  <button>Info</button>
</Tooltip>
```

### Tooltip sur un terme technique
```astro
<Tooltip text="La dette de décision est l'accumulation de choix restés ouverts" position="bottom">
  <span class="font-semibold text-[#C5A070]">dette de décision</span>
</Tooltip>
```

---

## Style

Les tooltips utilisent :
- Fond : `#1A1A1A` (noir graphite)
- Texte : `#FDFCFB` (ivory)
- Taille : `0.75rem`
- Animation : fade + slide subtil
- Ombre : légère pour la profondeur

---

## Accessibilité

- Le tooltip apparaît au survol (`:hover`)
- Compatible avec les lecteurs d'écran (le texte est dans `data-tooltip`)
- Le curseur change en `help` pour indiquer l'interactivité

---

## Notes

- Les tooltips sont purement CSS, pas de JavaScript nécessaire
- Fonctionnent sur tous les navigateurs modernes
- Responsive et s'adaptent automatiquement à l'espace disponible
- Max-width de 200px pour éviter les tooltips trop larges
