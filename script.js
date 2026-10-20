const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const year = document.querySelector('#year');
const hero = document.querySelector('.hero');
const purpose = document.querySelector('.purpose');
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

year.textContent = new Date().getFullYear();

function syncHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 30);
  header.classList.toggle('is-light', window.scrollY >= purpose.offsetTop);
  if (window.scrollY < hero.offsetHeight * 0.42) setActiveSection(null);
}

function setActiveSection(id) {
  sectionLinks.forEach((link) => {
    const active = id && link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', Boolean(active));
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function closeMenu() {
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
}

menuButton.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    if (window.scrollY < hero.offsetHeight * 0.42) {
      setActiveSection(null);
      return;
    }
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    setActiveSection(visible.target.id);
  }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5] });
  sections.forEach((section) => sectionObserver.observe(section));
}

const reveals = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -45px 0px', threshold: 0.05 });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('is-visible'));
}
