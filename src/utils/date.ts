/**
 * Formate une date au format français.
 * Les noms de mois restent en minuscules : c'est la règle en français, et
 * les endroits qui les veulent en capitales le font en CSS.
 * @param dateString - Date au format ISO (YYYY-MM-DD)
 * @returns Date formatée en français (ex: "12 novembre 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
