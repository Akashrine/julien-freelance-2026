/**
 * La porte. Le site n'a qu'une action et c'est celle-ci.
 *
 * La lettre est déjà commencée : des intitulés, et des lignes vides dessous.
 * Le visiteur remplit ou efface. C'est son brouillon, dans son client mail,
 * pas un formulaire.
 *
 * Trois objets, et seulement trois. Ils servent de mesure : on sait d'où
 * vient chaque mail sans formulaire ni traceur. Ne pas les banaliser.
 * Libellés validés le 11/10/2026, lettre Mission longue complétée le 13/10/2026
 * (site-architecture.md, section Contact).
 */
export const EMAIL = 'julien.brionne@gmail.com';

export type Porte = 'generique' | 'mission' | 'miseAuClair';

const PORTES: Record<Porte, { sujet: string; lignes: string[] }> = {
  generique: {
    sujet: 'Un sujet produit',
    lignes: ['Le sujet :', 'L’explication qu’on en donne aujourd’hui :', 'Qui tranche chez nous :'],
  },
  mission: {
    sujet: 'Mission longue',
    // Démarrage et rythme (13/10/2026) : la ligne « en mission chez Back Market »
    // peut se lire comme une indisponibilité. On demande plutôt que d'afficher une date.
    lignes: ['Le sujet :', 'L’équipe :', 'Le rôle attendu :', 'Démarrage souhaité :', 'Rythme envisagé :'],
  },
  miseAuClair: {
    sujet: 'La Mise au clair',
    lignes: [
      'La question à trancher :',
      'L’explication qu’on en donne aujourd’hui :',
      'Qui doit décider chez vous :',
    ],
  },
};

/** CRLF : c'est le retour à la ligne que les clients mail lisent tous. */
const lettre = (lignes: string[]) => lignes.flatMap((l) => [l, '', '']).join('\r\n');

// encodeURIComponent laisse passer l'apostrophe droite ; certains clients
// tronquent dessus. On l'encode nous-mêmes, sujet comme corps.
const encoder = (valeur: string) => encodeURIComponent(valeur).replace(/'/g, '%27');

export const mailto = (porte: Porte = 'generique') => {
  const { sujet, lignes } = PORTES[porte];
  return `mailto:${EMAIL}?subject=${encoder(sujet)}&body=${encoder(lettre(lignes))}`;
};
