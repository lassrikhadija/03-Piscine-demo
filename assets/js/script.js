/* ============================================================
   AQUA ÉLITE — script.js
   Vanilla JS · zero dependency · fonctionne FR + EN
   ============================================================ */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  // i18n minimal pour les messages alert (en lit la lang du <html>)
  const isEN = document.documentElement.lang.startsWith('en');
  const T = {
    formOk:   isEN ? 'Thank you! This is a demo form. In production, your request would be sent to Aqua Élite.\n\n— Powered by Nextiweb.ca' :
                     'Merci ! Ce formulaire est une démo. En production, votre demande serait envoyée à Aqua Élite.\n\n— Conçu par Nextiweb.ca',
    formErr:  isEN ? 'Please complete all required fields correctly.' :
                     'Veuillez remplir correctement tous les champs requis.',
  };

  /* ---------- 1. Header scrolled ---------- */
  const header = $('#header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile nav ---------- */
  const navToggle = $('.nav-toggle');
  const mobileNav = $('#mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      mobileNav.hidden = open;
    });
    // Ferme au clic sur un lien
    $$('a', mobileNav).forEach(a => a.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    }));
  }

  /* ---------- 3. Cursor lumineux (desktop) ---------- */
  const cursor = $('.cursor-glow');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let raf = null, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add('active');
      if (!raf) raf = requestAnimationFrame(() => {
        cursor.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
        raf = null;
      });
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  }

  /* ---------- 4. Bento spotlight (suit la souris dans la card) ---------- */
  $$('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- 5. Filtre galerie ---------- */
  const filterBtns = $$('.filters .chip');
  const cards = $$('.gcard');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      const f = btn.dataset.filter;
      cards.forEach(c => {
        const cats = (c.dataset.cat || '').split(/\s+/);
        const show = f === 'all' || cats.includes(f);
        c.classList.toggle('hidden', !show);
      });
    });
  });

  /* ---------- 6. FAQ : accordion exclusif ---------- */
  const faqItems = $$('.faq-item');
  faqItems.forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) faqItems.forEach(o => { if (o !== d) o.open = false; });
    });
  });

  /* ---------- 7. Scroll reveal ---------- */
  const targets = $$('.section-head, .bento-card, .gcard, .step, .review, .faq-item, .cta-text, .cta-form');
  targets.forEach(t => t.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
  } else {
    targets.forEach(t => t.classList.add('in'));
  }

  /* ---------- 8. Smooth anchor avec offset header ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- 9. Form devis (démo) ---------- */
  const form = $('#quoteForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // Simu envoi
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = isEN ? 'Sending…' : 'Envoi…';
      setTimeout(() => {
        alert(T.formOk);
        form.reset();
        btn.disabled = false;
        btn.innerHTML = original;
      }, 600);
    });
  }

  /* ---------- 10. Année footer (si placeholder) ---------- */
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
