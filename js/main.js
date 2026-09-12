document.getElementById('year').textContent = new Date().getFullYear();

const supportsObserver = 'IntersectionObserver' in window;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (supportsObserver && !reducedMotion) {
  const targets = document.querySelectorAll('.project, .capabilities, .closing');

  targets.forEach((target) => target.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach((target) => observer.observe(target));
}
