/**
 * Retourne le label français d'une catégorie d'article
 * @param category - Catégorie de l'article ('reflexion' | 'analyse')
 * @returns Label français de la catégorie
 */
export function getCategoryLabel(category: string): string {
  return category === 'reflexion' ? 'Réflexion' : 'Analyse';
}

/**
 * Calcule le temps de lecture estimé d'un article
 * @param content - Contenu de l'article (texte brut)
 * @returns Temps de lecture estimé en minutes
 */
export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
}
