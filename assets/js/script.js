(() => {
 'use strict';
 const $ = (s, c = document) => c.querySelector(s);
 const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
 const isEN = document.documentElement.lang.startsWith('en');
 const T = {
 formOk: isEN ? 'Thank you! This is a demo form. In production, your request would be sent to Aqua Élite.\n\n— Powered by Nextiweb.ca' :
 'Merci ! Ce formulaire est une démo. En production, votre demande serait envoyée à Aqua Élite.\n\n— Conçu par Nextiweb.ca',
 formErr: isEN ? 'Please complete all required fields correctly.' :
 'Veuillez remplir correctement tous les champs requis.',
 };
 const header = $('#header');
 const onScroll = () => {
 if (!header) return;
 header.classList.toggle('scrolled', window.scrollY > 20);
 };
 window.addEventListener('scroll', onScroll, { passive: true });
 onScroll();
 const navToggle = $('.nav-toggle');
 const mobileNav = $('#mobile-nav');
 if (navToggle && mobileNav) {
 navToggle.addEventListener('click', () => {
 const open = navToggle.getAttribute('aria-expanded') === 'true';
 navToggle.setAttribute('aria-expanded', String(!open));
 mobileNav.hidden = open;
 });
 $$('a', mobileNav).forEach(a => a.addEventListener('click', () => {
 navToggle.setAttribute('aria-expanded', 'false');
 mobileNav.hidden = true;
 }));
 }
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
 if (window.matchMedia('(hover:hover)').matches) {
 const cardRects = new WeakMap();
 const cacheRect = card => cardRects.set(card, card.getBoundingClientRect());
 $$('.bento-card, .partner-card').forEach(card => {
 cacheRect(card);
 card.addEventListener('mousemove', e => {
 const r = cardRects.get(card);
 card.style.setProperty('--mx', `${e.clientX - r.left}px`);
 card.style.setProperty('--my', `${e.clientY - r.top}px`);
 });
 });
 window.addEventListener('resize', () => { $$('.bento-card, .partner-card').forEach(cacheRect); }, {passive:true});
 }
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
 const faqItems = $$('.faq-item');
 faqItems.forEach(d => {
 d.addEventListener('toggle', () => {
 if (d.open) faqItems.forEach(o => { if (o !== d) o.open = false; });
 });
 });
 const targets = $$('.section-head, .bento-card, .gcard, .step, .review, .faq-item, .cta-text, .cta-form, .partner-card');
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
 const form = $('#quoteForm');
 if (form) {
 form.addEventListener('submit', e => {
 e.preventDefault();
 if (!form.checkValidity()) {
 form.reportValidity();
 return;
 }
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
 const y = $('#year');
 if (y) y.textContent = new Date().getFullYear();
 const cookieBanner = $('#cookieBanner');
 if (cookieBanner) {
 const STORAGE_KEY = 'aquaElite_cookieConsent';
 let dismissed = false;
 try { dismissed = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { }
 if (!dismissed) {
 setTimeout(() => {
 cookieBanner.hidden = false;
 requestAnimationFrame(() => cookieBanner.classList.add('visible'));
 }, 1400);
 const dismiss = () => {
 cookieBanner.classList.remove('visible');
 setTimeout(() => { cookieBanner.hidden = true; }, 500);
 try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { }
 };
 $('#cookieAccept')?.addEventListener('click', dismiss);
 $('#cookieClose')?.addEventListener('click', dismiss);
 }
 }
})();