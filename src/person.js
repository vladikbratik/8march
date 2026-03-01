import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { persons }       from './data/persons.js';
import { event }         from './data/event.js';
import { launchConfetti } from './components/confetti.js';

gsap.registerPlugin(ScrollTrigger);

// Читаем slug из URL (?slug=tarasova)
const params = new URLSearchParams(window.location.search);
const slug   = params.get('slug');
const person = persons[slug];

// Применяем палитру как CSS-переменные
function applyPalette(palette) {
  const root = document.documentElement;
  root.style.setProperty('--p-bg',        palette.bg);
  root.style.setProperty('--p-accent',    palette.accent);
  root.style.setProperty('--p-secondary', palette.secondary);
  root.style.setProperty('--p-text',      palette.text);
}

// Извлекаем имя (формат: Фамилия Имя [Отчество])
function firstName(fullName) {
  return fullName.split(' ')[1] ?? fullName;
}

// ===========================
// 404 — персона не найдена
// ===========================
if (!person) {
  applyPalette({ bg: '#0a0a0a', accent: '#c9a84c', secondary: '#1a1a1a', text: '#f5f0e4' });
  document.querySelector('.p-hero').innerHTML = `
    <div class="p-not-found">
      <h1>СТРАНИЦА<br>НЕ НАЙДЕНА</h1>
      <p>Вернитесь на <a href="/" style="color:var(--p-accent)">главную</a></p>
    </div>
  `;
  gsap.to('.p-not-found', { opacity: 1, duration: 0.8, delay: 0.3 });
  gsap.to('.p-header', { opacity: 1, duration: 0.6, delay: 0.2 });

} else {

  // ===========================
  // Применяем данные
  // ===========================
  applyPalette(person.palette);

  document.title = `${person.name} — 8 марта 2026`;

  document.getElementById('p-title').textContent = person.title;
  document.getElementById('p-name').textContent  = person.name;
  document.getElementById('p-dept').textContent  = person.department;

  const photoEl = document.getElementById('p-photo');
  photoEl.src = `/assets/photos/${person.photo}`;
  photoEl.alt = person.name;
  if (person.photoPosition) photoEl.style.objectPosition = person.photoPosition;

  // Points
  document.getElementById('p-points').innerHTML = person.points
    .map(p => `<span class="p-point">${p}</span>`)
    .join('');

  // Секция 2 — тёплые слова
  document.getElementById('p-invite-dear').textContent = `Дорогая ${firstName(person.name)},`;
  document.getElementById('p-invite-date').textContent = event.date.toUpperCase();
  document.getElementById('p-invite-time').textContent = `${event.time} · ${event.location}`;

  // ===========================
  // СЕКЦИЯ 1 — GSAP анимация
  // ===========================
  gsap.set('.p-frame',       { opacity: 0, scale: 0.97 });
  gsap.set('.p-corner',      { opacity: 0, scale: 0 });
  gsap.set('.p-header',      { opacity: 0, y: -12 });
  gsap.set('.p-photo-wrap',  { opacity: 0, scale: 0.88 });
  gsap.set('.p-title',       { opacity: 0, y: 28 });
  gsap.set('.p-points',      { opacity: 0, y: 12 });
  gsap.set('.p-sep',         { opacity: 0, scaleX: 0 });
  gsap.set('.p-identity',    { opacity: 0, y: 16 });
  gsap.set('.p-scroll-hint', { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.15 });

  tl.to('.p-frame', { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' });

  tl.to('.p-corner', {
    opacity: 1, scale: 1,
    duration: 0.45, stagger: 0.08,
    ease: 'back.out(2)',
    transformOrigin: 'center center',
  }, '-=0.5');

  tl.to('.p-header',     { opacity: 1, y: 0,    duration: 0.55, ease: 'power2.out' }, '-=0.2');
  tl.to('.p-photo-wrap', { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.4)' }, '-=0.1');
  tl.to('.p-title',      { opacity: 1, y: 0,    duration: 0.9,  ease: 'power2.out' }, '-=0.35');
  tl.to('.p-points',     { opacity: 1, y: 0,    duration: 0.6,  ease: 'power2.out' }, '-=0.45');

  tl.to('.p-sep', {
    opacity: 1, scaleX: 1,
    duration: 0.5, ease: 'power2.out',
    transformOrigin: 'center center',
  }, '-=0.3');

  tl.to('.p-identity',    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.25');
  tl.to('.p-scroll-hint', { opacity: 0.45,    duration: 0.8, ease: 'power2.out' }, '-=0.1');

  tl.eventCallback('onComplete', () => launchConfetti());

  // ===========================
  // СЕКЦИЯ 2 — Приглашение
  // ===========================
  gsap.set('.p-invite__frame',    { opacity: 0 });
  gsap.set('.p-invite__dear',     { opacity: 0, y: 20 });
  gsap.set('.p-invite__rule',     { opacity: 0, scaleX: 0 });
  gsap.set('.p-invite__words',    { opacity: 0, y: 16 });
  gsap.set('.p-invite__card',     { opacity: 0, y: 20 });
  gsap.set('.p-invite__sign',     { opacity: 0 });

  ScrollTrigger.create({
    trigger: '.p-section--invite',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      const tl2 = gsap.timeline();
      tl2.to('.p-invite__frame', { opacity: 1, duration: 0.8, ease: 'power2.out' });
      tl2.to('.p-invite__dear',  { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.4');
      tl2.to('.p-invite__rule',  {
        opacity: 1, scaleX: 1,
        duration: 0.6, stagger: 0.2,
        ease: 'power2.out', transformOrigin: 'center center',
      }, '-=0.3');
      tl2.to('.p-invite__words', { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5');
      tl2.to('.p-invite__card',  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');
      tl2.to('.p-invite__sign',  { opacity: 1,       duration: 0.7, ease: 'power2.out' }, '-=0.2');
    },
  });

  // ===========================
  // СЕКЦИЯ 3 — Видео
  // ===========================
  gsap.set(['.p-video__label', '.p-video__wrap', '.p-video__year'], { opacity: 0, y: 24 });

  ScrollTrigger.create({
    trigger: '.p-section--video',
    start: 'top 78%',
    once: true,
    onEnter: () => {
      gsap.to(['.p-video__label', '.p-video__wrap', '.p-video__year'], {
        opacity: 1, y: 0,
        duration: 0.9, stagger: 0.2,
        ease: 'power2.out',
      });
    },
  });
}
