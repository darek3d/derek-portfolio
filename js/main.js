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
ensureStylesheet('css/hero-proof-band.css');

function initIcons(attempt = 0) {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
    return;
  }
  if (attempt < 20) setTimeout(() => initIcons(attempt + 1), 120);
}

function getContactEmail() {
  const local = ['derek', 'wydra'].join('');
  const domain = ['gmail', 'com'].join('.');
  return `${local}@${domain}`;
}

function hydrateEmailLinks() {
  const email = getContactEmail();
  document.querySelectorAll('[data-email-link]').forEach((link) => {
    link.href = `mailto:${email}`;
  });
  document.querySelectorAll('[data-email-text]').forEach((el) => {
    el.textContent = email;
  });
}

function enhanceTopNav() {
  const links = [...document.querySelectorAll('.site-nav a')];
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === '#work') link.textContent = 'Projects';
    if (href === '#systems') link.textContent = 'Systems';
    if (link.matches('[data-email-link]')) {
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
    <span>Ontario, Canada</span>
    <a href="#" data-email-link data-email-text aria-label="Email Derek"></a>
  `;

  identity.append(photoClone, copy);
  lede.insertAdjacentElement('afterend', identity);

  const heroMeta = heroCopy.querySelector('.hero-meta');
  if (heroMeta) heroMeta.hidden = true;
}

function refreshHeroCopy() {
  const headline = document.querySelector('.hero-copy h1');
  const lede = document.querySelector('.hero-lede');

  if (headline) headline.textContent = 'I build digital growth systems that turn attention into customers.';

  if (lede) {
    lede.innerHTML = `
      <span class="lede-line">15+ years building and growing digital products through organic acquisition, conversion optimization, marketing automation and subscription business models.</span>
      <span class="lede-line">I improve how prospects are <strong>acquired, nurtured, converted and retained</strong> by connecting web experiences, CMS and CRM systems, AI automation, analytics, customer data and APIs, with hands-on development experience when custom solutions are needed.</span>
    `;
  }
}

function buildResultsBand() {
  const hero = document.querySelector('.hero');
  const existing = document.querySelector('.results-band');
  if (!hero || existing) return;

  const section = document.createElement('section');
  section.className = 'results-band';
  section.setAttribute('aria-label', 'Selected results');
  section.innerHTML = `
    <div class="shell">
      <div class="results-band-header">
        <p class="eyebrow">Selected results</p>
        <p>Evidence across acquisition, conversion and customer lifecycle work.</p>
      </div>
      <div class="results-grid">
        <article class="result-card">
          <div class="result-card-icon"><i data-lucide="search-check" aria-hidden="true"></i></div>
          <span class="result-card-kicker">Organic acquisition</span>
          <strong>44K–49K</strong>
          <p class="result-card-description">Monthly Google organic clicks at peak on a search-driven web property.</p>
          <div class="result-card-tags">SEO · Search Console · Ahrefs</div>
        </article>
        <article class="result-card">
          <div class="result-card-icon"><i data-lucide="trending-up" aria-hidden="true"></i></div>
          <span class="result-card-kicker">Conversion optimization</span>
          <strong>+62%</strong>
          <p class="result-card-description">Email opt-in lift in one CRO experiment.</p>
          <div class="result-card-tags">CRO · Funnel testing · Analytics</div>
        </article>
        <article class="result-card">
          <div class="result-card-icon"><i data-lucide="users" aria-hidden="true"></i></div>
          <span class="result-card-kicker">Customer lifecycle</span>
          <strong>4–5K</strong>
          <p class="result-card-description">Paying customers supported across earlier digital products.</p>
          <div class="result-card-tags">Email · Lifecycle · Payments</div>
        </article>
      </div>
    </div>
  `;

  hero.insertAdjacentElement('afterend', section);
}

function removeOldHeroSide() {
  const heroSide = document.querySelector('.hero-side');
  if (heroSide) heroSide.remove();
}

enhanceTopNav();
refreshHeroCopy();
enhanceHeroIdentity();
buildResultsBand();
hydrateEmailLinks();
removeOldHeroSide();
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
  document.querySelectorAll('.result-card').forEach((el, i) => animateIn(el, 90 + i * 55));

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

/* Capability rail: align the first card to the content shell, start movement a little later, and finish with card 06 aligned to the normal right content gutter. */
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

  // Begin once the rail has moved well into the viewport, then complete before
  // the section reaches the top so card 06 remains on-screen for a readable dwell.
  const startLine = vh * 0.58;
  const finishLine = vh * 0.12;
  const raw = (startLine - rect.top) / (startLine - finishLine);
  const progress = Math.max(0, Math.min(1, raw));
  const eased = progress * progress * (3 - 2 * progress);

  const cards = railTrack.querySelectorAll('.rail-card');
  const lastCard = cards[cards.length - 1];
  const contentGutter = Math.max(20, (window.innerWidth - 1180) / 2);
  const lastCardRight = lastCard ? lastCard.offsetLeft + lastCard.offsetWidth : railTrack.scrollWidth;
  const maxShift = Math.max(0, lastCardRight - (railViewport.clientWidth - contentGutter));

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
