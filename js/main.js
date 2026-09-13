const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function ensureStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

ensureStylesheet('css/polish-pass.css');

function initIcons(attempt = 0) {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
    return;
  }
  if (attempt < 20) setTimeout(() => initIcons(attempt + 1), 120);
}

function enhanceTopNav() {
  const links = [...document.querySelectorAll('.site-nav a')];
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === '#work') link.textContent = 'Projects';
    if (href === '#systems') link.textContent = 'Systems';
    if (href?.startsWith('mailto:')) {
      link.textContent = 'Email me';
      link.classList.add('nav-cta');
    }
  });
}

function enhanceHeroIdentity() {
  const heroCopy = document.querySelector('.hero-copy');
  const heroSide = document.querySelector('.hero-side');
  const photo = heroSide?.querySelector('.profile-photo');
  const lede = heroCopy?.querySelector('.hero-lede');
  if (!heroCopy || !photo || !lede || heroCopy.querySelector('.hero-identity')) return;

  const identity = document.createElement('div');
  identity.className = 'hero-identity';

  const photoClone = photo.cloneNode(true);
  const copy = document.createElement('div');
  copy.className = 'hero-identity-copy';
  copy.innerHTML = `
    <strong>Derek Wydra</strong>
    <span>Oshawa, Ontario</span>
    <a href="mailto:derekwydra@gmail.com">derekwydra@gmail.com</a>
  `;

  identity.append(photoClone, copy);
  lede.insertAdjacentElement('afterend', identity);

  const heroMeta = heroCopy.querySelector('.hero-meta');
  if (heroMeta) heroMeta.hidden = true;
}

enhanceTopNav();
enhanceHeroIdentity();
initIcons();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateIn(el, delay = 0) {
  if (!el || reducedMotion || typeof el.animate !== 'function') return;
  el.animate(
    [{ opacity: 0.84, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 380, delay, easing: 'cubic-bezier(.22,1,.36,1)' }
  );
}

if (!reducedMotion) {
  document.querySelectorAll('[data-motion="hero"] > *').forEach((el, i) => animateIn(el, i * 50));
  document.querySelectorAll('[data-motion="metrics"] > *').forEach((el, i) => animateIn(el, 100 + i * 45));

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

/* Capability rail: leave a comfortable dwell at both ends and move more gently. */
const railSection = document.getElementById('capability-rail');
const railViewport = railSection?.querySelector('.capability-rail-viewport');
const railTrack = railSection?.querySelector('.capability-rail-track');
const progressBar = railSection?.querySelector('.rail-progress span');
let railTicking = false;

function updateRail() {
  railTicking = false;
  if (!railSection || !railViewport || !railTrack || reducedMotion || window.innerWidth < 760) return;

  const rect = railSection.getBoundingClientRect();
  const vh = window.innerHeight;

  // Start after the section has meaningfully entered and finish only after it is mostly past.
  const raw = (vh * 0.72 - rect.top) / (vh * 0.95 + rect.height);
  const progress = Math.max(0, Math.min(1, raw));
  const eased = progress * progress * (3 - 2 * progress);
  const maxShift = Math.max(0, railTrack.scrollWidth - railViewport.clientWidth);

  railTrack.style.transform = `translate3d(${-maxShift * eased}px,0,0)`;
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
}

function requestRailUpdate() {
  if (railTicking) return;
  railTicking = true;
  requestAnimationFrame(updateRail);
}

addEventListener('scroll', requestRailUpdate, { passive: true });
addEventListener('resize', requestRailUpdate);
requestRailUpdate();

/* Project nav: deterministic activation based on a fixed line below the sticky nav. */
const projectLinks = [...document.querySelectorAll('[data-project-link]')];
const projects = [...document.querySelectorAll('[data-project]')];
const projectNav = document.querySelector('.project-nav');
let projectTicking = false;
let activeProjectId = null;

function setActiveProject(id, scrollNav = true) {
  if (!id || activeProjectId === id) return;
  activeProjectId = id;

  projectLinks.forEach((link) => {
    const active = link.dataset.projectLink === id;
    link.classList.toggle('is-active', active);
    if (active) {
      link.setAttribute('aria-current', 'true');
      if (scrollNav) link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function updateActiveProject() {
  projectTicking = false;
  if (!projects.length) return;

  const navBottom = projectNav?.getBoundingClientRect().bottom ?? 72;
  const activationLine = navBottom + 34;

  let current = projects[0];
  for (const project of projects) {
    const top = project.getBoundingClientRect().top;
    if (top <= activationLine) current = project;
    else break;
  }

  // Before the first project crosses the line, explicitly keep Braintoon Web active.
  setActiveProject(current.dataset.project);
}

function requestProjectUpdate() {
  if (projectTicking) return;
  projectTicking = true;
  requestAnimationFrame(updateActiveProject);
}

addEventListener('scroll', requestProjectUpdate, { passive: true });
addEventListener('resize', requestProjectUpdate);
projectLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setActiveProject(link.dataset.projectLink, false);
  });
});
setActiveProject(projects[0]?.dataset.project, false);
requestProjectUpdate();
