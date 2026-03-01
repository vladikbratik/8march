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
  if (!fullName) return 'коллега';
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

  const photoEl = document.getElementById('p-photo');
  photoEl.src = `/assets/photos/${person.photo}`;
  photoEl.alt = person.name;
  if (person.photoPosition) photoEl.style.objectPosition = person.photoPosition;

  document.getElementById('p-dear').textContent      = `Дорогая ${firstName(person.name)},`;
  document.getElementById('p-card-date').textContent = event.date.toUpperCase();
  document.getElementById('p-card-time').textContent = `${event.time} · ${event.location}`;

  // ===========================
  // СЕКЦИЯ 1 — GSAP анимация
  // ===========================
  gsap.set('.p-frame',       { opacity: 0, scale: 0.97 });
  gsap.set('.p-corner',      { opacity: 0, scale: 0 });
  gsap.set('.p-header',      { opacity: 0, y: -12 });
  gsap.set('.p-photo-wrap',  { opacity: 0, scale: 0.88 });
  gsap.set('.p-divider',     { opacity: 0, scaleX: 0 });
  gsap.set('.p-dear',        { opacity: 0, y: 20 });
  gsap.set('.p-words',       { opacity: 0, y: 16 });
  gsap.set('.p-card',        { opacity: 0, y: 20 });
  gsap.set('.p-sign',        { opacity: 0 });
  gsap.set('.p-scroll-hint', { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.15 });

  tl.to('.p-frame', { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' });

  tl.to('.p-corner', {
    opacity: 1, scale: 1,
    duration: 0.45, stagger: 0.08,
    ease: 'back.out(2)',
    transformOrigin: 'center center',
  }, '-=0.5');

  tl.to('.p-header',     { opacity: 1, y: 0,    duration: 0.5,  ease: 'power2.out' }, '-=0.2');
  tl.to('.p-photo-wrap', { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.4)' }, '-=0.1');

  tl.to('.p-divider', {
    opacity: 1, scaleX: 1,
    duration: 0.5, stagger: 0.18,
    ease: 'power2.out',
    transformOrigin: 'center center',
  }, '-=0.2');

  tl.to('.p-dear',  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.55');
  tl.to('.p-words', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
  tl.to('.p-card',  { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3');
  tl.to('.p-sign',  { opacity: 1,       duration: 0.6, ease: 'power2.out' }, '-=0.2');
  tl.to('.p-scroll-hint', { opacity: 0.45, duration: 0.8, ease: 'power2.out' }, '-=0.1');

  tl.eventCallback('onComplete', () => launchConfetti());

  // ===========================
  // СЕКЦИЯ 2 — Видео
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
