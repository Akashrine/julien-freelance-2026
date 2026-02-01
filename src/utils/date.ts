/**
 * Formate une date au format français
 * @param dateString - Date au format ISO (YYYY-MM-DD)
 * @returns Date formatée en français (ex: "12 Novembre 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
