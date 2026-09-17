/**
 * Les offres, et ce qui les définit en un mot.
 *
 * Le format de La Mise au clair était écrit à la main dans neuf endroits :
 * l'accueil, la page d'offre, la page diagnostic (quatre fois, dont trois
 * métadonnées qu'on ne relit jamais), la page PME et les données structurées.
 * Le jour où la durée change — et elle a failli passer à deux semaines le
 * 17/09 — il en manquait forcément un, et le site annonçait deux durées pour
 * la même chose, une troisième à Google.
 *
 * Les phrases autour restent écrites à la main, page par page : c'est de la
 * copy, elle appartient à sa page. Seul l'atome factuel vit ici.
 *
 * Les ancres sont définitives (PRODUCT.md) : des liens partent dessus depuis
 * LinkedIn et des messages privés. Elles ne se renomment pas.
 */
export const MISE_AU_CLAIR = {
  nom: 'La Mise au clair',
  ancre: '/ce-que-je-fais#la-mise-au-clair',
  format: 'Six demi-journées sur trois semaines',
  resultat: 'Une décision prise avec vous, le cadre écrit, les trois prochains mois séquencés.',
} as const;

export const COPILOTE = {
  nom: 'Le Copilote',
  ancre: '/ce-que-je-fais#le-copilote',
  format: 'Huit semaines au maximum',
  resultat: "Faire sortir un MVP qui ne sort pas, avec la méthode que l'équipe garde après mon départ.",
} as const;

/**
 * Retiré de l'offre le 18/09/2026. On garde l'ancre, pas le format : des liens
 * partent dessus depuis LinkedIn et des messages privés. Elle mène désormais à
 * deux lignes qui expliquent le retrait.
 */
export const RENDEZ_VOUS_RETIRE = {
  nom: 'Le Rendez-vous produit',
  ancre: '/ce-que-je-fais#le-rendez-vous-produit',
} as const;
