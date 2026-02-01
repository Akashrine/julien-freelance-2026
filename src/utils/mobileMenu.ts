/**
 * Initialise le menu mobile avec toggle et gestion du clavier
 */
export function initMobileMenu(): void {
  const button = document.getElementById('mobile-menu-button') as HTMLButtonElement;
  const menu = document.getElementById('mobile-menu') as HTMLElement;
  const firstLink = menu?.querySelector('a') as HTMLAnchorElement;
  
  if (!button || !menu) {
    return;
  }

  button.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    
    if (isHidden) {
      menu.classList.remove('hidden');
      button.setAttribute('aria-expanded', 'true');
      // Focus sur le premier lien pour améliorer la navigation clavier
      setTimeout(() => firstLink?.focus(), 100);
    } else {
      menu.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  // Fermeture avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    }
  });
}
