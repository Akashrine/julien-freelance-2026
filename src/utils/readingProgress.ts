/**
 * Initialise la barre de progression de lecture
 * Ne s'affiche que sur les pages d'articles individuels
 */
export function initReadingProgress(): void {
  const progressBar = document.getElementById('reading-progress') as HTMLElement;
  if (!progressBar) return;

  // Ne montrer que sur les pages d'articles
  const isArticlePage = window.location.pathname.startsWith('/articles/') && 
                        window.location.pathname !== '/articles';
  
  if (!isArticlePage) {
    progressBar.style.display = 'none';
    return;
  }

  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculer le pourcentage de scroll
    const scrollableHeight = documentHeight - windowHeight;
    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
    
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  // Mettre à jour au scroll avec throttling
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  updateProgress(); // Initialiser
}
