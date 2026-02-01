/**
 * Initialise les animations reveal avec IntersectionObserver
 */
export function initRevealAnimations(): void {
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));
}

/**
 * Initialise les animations de fade-in progressif pour les sections
 */
export function initSectionFadeAnimations(): void {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  const sectionFadeElements = document.querySelectorAll('.section-fade');
  sectionFadeElements.forEach(el => sectionObserver.observe(el));
}

/**
 * Initialise l'effet de parallaxe sur les blobs
 */
export function initParallaxBlobs(): void {
  // Vérifier si l'utilisateur préfère les animations réduites
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    return;
  }

  const parallaxBlobs = document.querySelectorAll('.blob-parallax');
  
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    parallaxBlobs.forEach((blob, index) => {
      const speed = (index % 2 === 0 ? 0.3 : 0.5);
      const yPos = -(scrolled * speed);
      (blob as HTMLElement).style.transform = `translateY(${yPos}px)`;
    });
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);
}

/**
 * Initialise toutes les animations
 */
export function initAllAnimations(): void {
  initRevealAnimations();
  initSectionFadeAnimations();
  initParallaxBlobs();
}
