/**
 * La porte. Le site n'a qu'une action et c'est celle-ci.
 *
 * Écrire ce mail est plus dur qu'il n'y paraît : il faut admettre qu'un sujet
 * traîne, dire depuis quand, et nommer qui peut trancher — ce dernier point
 * est politique. Devant une fenêtre vide, ça se remet à plus tard.
 *
 * Alors la lettre est déjà commencée. Trois intitulés, ceux que Julien demande
 * mot pour mot sur l'accueil, et des lignes vides dessous. Le visiteur remplit
 * ou efface : c'est son brouillon, dans son client mail, pas un formulaire.
 *
 * L'objet, lui, ne se banalise pas : il reste la seule mesure de conversion
 * par offre (PRODUCT.md). Le corps ne le touche pas.
 */
export const EMAIL = 'julien.brionne@gmail.com';

// Apostrophe droite, pas typographique : cet objet est la mesure de conversion
// et des mails portant exactement cette chaîne sont déjà partis. Il ne bouge pas.
export const SUJET_GENERIQUE = "Un sujet qui n'avance pas";

/** CRLF : c'est le retour à la ligne que les clients mail lisent tous. */
const LETTRE = [
  'Ce qui n’avance pas :',
  '',
  '',
  'Depuis combien de temps :',
  '',
  '',
  'Qui peut trancher chez nous :',
  '',
  '',
].join('\r\n');

// encodeURIComponent laisse passer l'apostrophe droite ; certains clients
// tronquent dessus. On l'encode nous-mêmes, sujet comme corps.
const encoder = (valeur: string) => encodeURIComponent(valeur).replace(/'/g, '%27');

export const mailto = (sujet: string = SUJET_GENERIQUE) =>
  `mailto:${EMAIL}?subject=${encoder(sujet)}&body=${encoder(LETTRE)}`;
