/**
 * Initialise la logique de filtrage des articles par catégorie
 */
export function initArticleFilters(): void {
  const filterButtons = document.querySelectorAll<HTMLElement>('.filter-btn');
  const articles = document.querySelectorAll<HTMLElement>('.article-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Mise à jour de l'état visuel des boutons avec animation
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
        if (b !== btn) {
          b.classList.add('opacity-40');
        }
      });
      btn.classList.add('active');
      btn.classList.remove('opacity-40');
      btn.setAttribute('aria-pressed', 'true');

      // Filtrage des articles
      articles.forEach((article) => {
        const category = article.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          article.classList.remove('hidden');
          setTimeout(() => {
            article.style.opacity = "1";
          }, 10);
        } else {
          article.style.opacity = "0";
          setTimeout(() => {
            article.classList.add('hidden');
          }, 400);
        }
      });
    });
  });
}
