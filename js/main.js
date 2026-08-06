// ── Active nav link ─────────────────────────────────────────
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── Sticky header ────────────────────────────────────────────
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Mobile nav toggle ─────────────────────────────────────────
const toggle = document.querySelector('.nav__toggle');
const menu   = document.querySelector('.nav__links');
if (toggle && menu) {
  const usesTouchDropdown = window.matchMedia('(hover: none) and (pointer: coarse)');
  const setMenuState = isOpen => {
    menu.classList.toggle('is-open', isOpen);
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.style.overflow = isOpen && !usesTouchDropdown.matches ? 'hidden' : '';
    header?.classList.toggle('nav-open', isOpen);
  };

  toggle.addEventListener('click', () => {
    setMenuState(!menu.classList.contains('is-open'));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('click', event => {
    if (!menu.classList.contains('is-open')) return;
    if (menu.contains(event.target) || toggle.contains(event.target)) return;
    setMenuState(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenuState(false);
      toggle.focus();
    }
  });
}

// ── Scroll reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Progress bar animation ────────────────────────────────────
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.progress-bar__fill');
      if (fill) {
        const target = fill.dataset.width || '0%';
        setTimeout(() => { fill.style.width = target; }, 200);
      }
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.progress-wrap').forEach(el => progressObserver.observe(el));

// ── Smooth scroll for anchor links ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Contact form (prevent default, show success) ───────────────
const contactForm = document.querySelector('.js-contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ Message sent — we\'ll be in touch soon!';
    btn.disabled = true;
    btn.style.background = 'var(--green)';
    btn.style.borderColor = 'var(--green)';
  });
}
