const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Load the visual refinements as a separate layer so the base stylesheet remains stable.
if (!document.querySelector('link[href="css/refinements.css"]')) {
  const refinements = document.createElement('link');
  refinements.rel = 'stylesheet';
  refinements.href = 'css/refinements.css';
  document.head.appendChild(refinements);
}

function initIcons() {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
  } else {
    window.setTimeout(initIcons, 100);
  }
}

initIcons();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateIn(element, delay = 0) {
  if (!element || reducedMotion || typeof element.animate !== 'function') return;
  element.animate(
    [
      { opacity: 0.72, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    {
      duration: 460,
      delay,
      easing: 'cubic-bezier(.22,1,.36,1)',
      fill: 'none'
    }
  );
}

if (!reducedMotion) {
  // Animate what is already visible on first paint, but never hide content in CSS.
  document.querySelectorAll('[data-motion="hero"] > *').forEach((el, i) => animateIn(el, i * 65));
  document.querySelectorAll('[data-motion="metrics"] .metric').forEach((el, i) => animateIn(el, 160 + i * 55));

  // Progressive enhancement: if IntersectionObserver fails or is unavailable,
  // every section remains fully visible because visibility is never JS-dependent.
  if ('IntersectionObserver' in window) {
    const seen = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);

        const target = entry.target;
        const staggerChildren = target.matches('.lane-grid, .gallery, .phone-gallery, .system-flow, .gtm-flow')
          ? Array.from(target.children).filter((el) => !el.matches('b'))
          : [];

        if (staggerChildren.length) {
          staggerChildren.forEach((el, i) => animateIn(el, i * 45));
        } else {
          animateIn(target);
        }

        observer.unobserve(target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -6% 0px'
    });

    document.querySelectorAll('[data-reveal], .lane-grid, .gallery, .phone-gallery, .system-flow, .gtm-flow')
      .forEach((el) => observer.observe(el));
  }
}
