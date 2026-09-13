import { animate, inView, stagger } from 'https://cdn.jsdelivr.net/npm/motion/+esm';

document.getElementById('year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initIcons() {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
  } else {
    window.setTimeout(initIcons, 80);
  }
}

initIcons();

if (!reducedMotion) {
  document.documentElement.classList.add('motion-ready');

  const heroParts = document.querySelectorAll('[data-motion="hero"] > *');
  if (heroParts.length) {
    animate(heroParts, { opacity: [0, 1], y: [18, 0] }, { duration: .65, delay: stagger(.075), ease: [0.22, 1, 0.36, 1] });
  }

  const metrics = document.querySelectorAll('[data-motion="metrics"] .metric');
  if (metrics.length) {
    animate(metrics, { opacity: [0, 1], x: [14, 0] }, { duration: .5, delay: stagger(.07, { startDelay: .2 }), ease: [0.22, 1, 0.36, 1] });
  }

  const lanes = document.querySelectorAll('.lane-card');
  if (lanes.length) {
    inView('.lane-grid', () => {
      animate(lanes, { opacity: [0, 1], y: [12, 0] }, { duration: .45, delay: stagger(.055), ease: 'ease-out' });
    }, { amount: .25 });
  }

  document.querySelectorAll('[data-reveal]').forEach((section) => {
    inView(section, () => {
      animate(section, { opacity: [0, 1], y: [18, 0] }, { duration: .58, ease: [0.22, 1, 0.36, 1] });
    }, { amount: .08 });
  });

  document.querySelectorAll('.gallery, .phone-gallery, .system-flow, .gtm-flow').forEach((group) => {
    const children = Array.from(group.children).filter((el) => !el.matches('b'));
    if (!children.length) return;
    inView(group, () => {
      animate(children, { opacity: [0, 1], y: [14, 0] }, { duration: .48, delay: stagger(.05), ease: 'ease-out' });
    }, { amount: .15 });
  });
}
