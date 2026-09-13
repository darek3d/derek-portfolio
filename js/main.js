const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function initIcons(attempt = 0) {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
    return;
  }
  if (attempt < 20) setTimeout(() => initIcons(attempt + 1), 120);
}
initIcons();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateIn(el, delay = 0) {
  if (!el || reducedMotion || typeof el.animate !== 'function') return;
  el.animate(
    [{ opacity: 0.8, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 420, delay, easing: 'cubic-bezier(.22,1,.36,1)' }
  );
}

if (!reducedMotion) {
  document.querySelectorAll('[data-motion="hero"] > *').forEach((el, i) => animateIn(el, i * 60));
  document.querySelectorAll('[data-motion="metrics"] > *').forEach((el, i) => animateIn(el, 140 + i * 55));

  if ('IntersectionObserver' in window) {
    const revealed = new WeakSet();
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || revealed.has(entry.target)) return;
        revealed.add(entry.target);
        animateIn(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
  }
}

const railSection = document.getElementById('capability-rail');
const railViewport = railSection?.querySelector('.capability-rail-viewport');
const railTrack = railSection?.querySelector('.capability-rail-track');
const progressBar = railSection?.querySelector('.rail-progress span');
let ticking = false;

function updateRail() {
  ticking = false;
  if (!railSection || !railViewport || !railTrack || reducedMotion || window.innerWidth < 760) return;
  const rect = railSection.getBoundingClientRect();
  const vh = window.innerHeight;
  const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
  const maxShift = Math.max(0, railTrack.scrollWidth - railViewport.clientWidth);
  railTrack.style.transform = `translate3d(${-maxShift * progress}px,0,0)`;
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
}

function requestRailUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateRail);
}

addEventListener('scroll', requestRailUpdate, { passive: true });
addEventListener('resize', requestRailUpdate);
requestRailUpdate();

const projectLinks = [...document.querySelectorAll('[data-project-link]')];
const projects = [...document.querySelectorAll('[data-project]')];

function setActiveProject(id) {
  projectLinks.forEach((link) => {
    const active = link.dataset.projectLink === id;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

if ('IntersectionObserver' in window && projects.length) {
  const projectObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (!visible.length) return;
    visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    setActiveProject(visible[0].target.dataset.project);
  }, { threshold: [0.2, 0.4], rootMargin: '-15% 0px -55% 0px' });
  projects.forEach((project) => projectObserver.observe(project));
}

projectLinks.forEach((link) => link.addEventListener('click', () => setActiveProject(link.dataset.projectLink)));
