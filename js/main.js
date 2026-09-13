const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function loadStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// Keep visual refinements layered so the base stylesheet stays easy to reason about.
loadStylesheet('css/refinements.css');
loadStylesheet('css/hero-refresh.css');

function enhanceHero() {
  const heroProof = document.querySelector('.hero-proof');
  if (!heroProof || heroProof.dataset.enhanced === 'true') return;
  heroProof.dataset.enhanced = 'true';

  const intro = document.createElement('div');
  intro.className = 'hero-side-intro';
  intro.innerHTML = `
    <div class="hero-headshot-wrap">
      <img
        class="hero-headshot"
        src="https://avatars.githubusercontent.com/u/129882343?v=4"
        alt="Derek Wydra"
        width="82"
        height="82"
        loading="eager"
        decoding="async"
      >
    </div>
    <div class="hero-side-copy">
      <span class="hero-side-kicker">Selected results</span>
      <p>Hands-on work across acquisition, conversion, subscription products and technical systems.</p>
    </div>
  `;
  heroProof.prepend(intro);

  const metrics = Array.from(heroProof.querySelectorAll('.metric'));

  // The AI Book Finder result is already featured prominently in its own case study below,
  // so keep the hero focused on broader career-level proof.
  metrics.forEach((metric) => {
    const value = metric.querySelector('strong')?.textContent?.trim() || '';
    if (value === '99K') metric.remove();
  });

  const iconMap = new Map([
    ['44K–49K', 'search'],
    ['+62%', 'trending-up'],
    ['3–5K', 'users']
  ]);

  heroProof.querySelectorAll('.metric').forEach((metric) => {
    const value = metric.querySelector('strong')?.textContent?.trim() || '';
    const iconName = iconMap.get(value) || 'sparkles';
    const icon = document.createElement('span');
    icon.className = 'hero-metric-icon';
    icon.innerHTML = `<i data-lucide="${iconName}" aria-hidden="true"></i>`;
    metric.prepend(icon);
  });
}

enhanceHero();

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
  document.querySelectorAll('[data-motion="metrics"] > *').forEach((el, i) => animateIn(el, 130 + i * 55));

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
