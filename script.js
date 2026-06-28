/* ============================================================
   PORTFOLIO — script.js
   Mohnad Waleed
   ============================================================ */

'use strict';

/* Scroll Progress */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ── Loading Screen ─────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1600);
  });
})();

/* ── Dark Mode ──────────────────────────────────────────── */
(function initTheme() {
  const root   = document.documentElement;
  const btn    = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  root.setAttribute('data-theme', stored || prefer);

  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ── Sticky Nav ─────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Active Nav Link on Scroll ──────────────────────────── */
(function initActiveLinks() {
  const links    = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main section[id]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const toggle = (open) => {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggle(!hamburger.classList.contains('open')));

  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) toggle(false);
  });
})();

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id  = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('revealed'), delay);
        observer.unobserve(el);
      });
    },
    { threshold: 0.12 }
  );

  els.forEach(el => observer.observe(el));
})();

(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const tick = () => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current);
      if (current < target) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect  = this.getBoundingClientRect();
      const size  = Math.max(rect.width, rect.height);
      const x     = e.clientX - rect.left - size / 2;
      const y     = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      Object.assign(ripple.style, {
        width:  `${size}px`,
        height: `${size}px`,
        left:   `${x}px`,
        top:    `${y}px`,
      });

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();

(function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) img.src = img.dataset.src;
      observer.unobserve(img);
    });
  });

  imgs.forEach(img => observer.observe(img));
})();

(function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('tel') || link.target === '_blank') return;

    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      document.body.classList.add('page-out');
      setTimeout(() => { window.location.href = href; }, 300);
    });
  });
})();

(function initSkillPills() {
  const groups = document.querySelectorAll('.skill-group');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const pills = entry.target.querySelectorAll('.skill-pill');
      pills.forEach((pill, i) => {
        setTimeout(() => {
          pill.style.opacity = '1';
          pill.style.transform = 'translateY(0)';
        }, i * 60);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  groups.forEach(group => {
    group.querySelectorAll('.skill-pill').forEach(pill => {
      pill.style.opacity = '0';
      pill.style.transform = 'translateY(10px)';
      pill.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    });
    observer.observe(group);
  });
})();
