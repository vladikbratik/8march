import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

// ===========================
// SECTION 1: HERO — TIMELINE
// ===========================

// Начальные состояния — всё скрыто
gsap.set('.hero__frame',       { opacity: 0 });
gsap.set('.hero__corner',      { opacity: 0, scale: 0 });
gsap.set('.hero__label',       { opacity: 0, y: 16 });
gsap.set('.hero__sep',         { opacity: 0, scaleX: 0 });
gsap.set('.hero__title',       { opacity: 0, y: 24 });
gsap.set('.hero__date',        { opacity: 0, y: 16 });
gsap.set('.hero__scroll',      { opacity: 0 });

// Timeline — как открытие советской киноафиши
const heroTl = gsap.timeline({ delay: 0.3 });

// 1. Рамка проявляется
heroTl.to('.hero__frame', {
  opacity: 1,
  duration: 1.6,
  ease: 'power2.inOut',
});

// 2. Угловые орнаменты «вырастают» с stagger
heroTl.to('.hero__corner', {
  opacity: 1,
  scale: 1,
  duration: 0.55,
  stagger: 0.1,
  ease: 'back.out(2.2)',
  transformOrigin: 'center center',
}, '-=1.1');

// 3. Лейбл студии
heroTl.to('.hero__label', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power2.out',
}, '-=0.3');

// 4. Разделитель раскрывается над заголовком
heroTl.to('.hero__sep--above', {
  opacity: 1,
  scaleX: 1,
  duration: 0.65,
  ease: 'power2.out',
  transformOrigin: 'center center',
}, '-=0.1');

// 5. Главный заголовок
heroTl.to('.hero__title', {
  opacity: 1,
  y: 0,
  duration: 1.0,
  ease: 'power2.out',
}, '-=0.2');

// 6. Разделитель раскрывается под заголовком
heroTl.to('.hero__sep--below', {
  opacity: 1,
  scaleX: 1,
  duration: 0.65,
  ease: 'power2.out',
  transformOrigin: 'center center',
}, '-=0.6');

// 7. Дата
heroTl.to('.hero__date', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power2.out',
}, '-=0.2');

// 8. Индикатор скролла
heroTl.to('.hero__scroll', {
  opacity: 1,
  duration: 0.8,
  ease: 'power2.out',
}, '-=0.3');

// Пульсация индикатора скролла — после завершения timeline
gsap.to('.scroll-indicator', {
  opacity: 0.1,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
  delay: heroTl.totalDuration() + 0.5,
});

// ===========================
// SECTION 2: ВИДЕО
// ===========================

gsap.fromTo(
  ['.video-section__label', '.video-wrapper', '.video-section__year'],
  { opacity: 0, y: 24 },
  {
    opacity: 1,
    y: 0,
    duration: 1.0,
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.video-section',
      start: 'top 78%',
    },
  }
);

// ===========================
// SECTION 3: ТИТРЫ
// ===========================

gsap.utils.toArray('.credits__chapter').forEach((chapter) => {
  const header = chapter.querySelector('.chapter__header');
  const cards = chapter.querySelectorAll('.person-card');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: chapter,
      start: 'top 80%',
    },
  });

  // Название главы — fade + лёгкий scale
  tl.fromTo(
    header,
    { opacity: 0, scale: 0.97 },
    { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
  );

  // Карточки — stagger 0.15s, y: 30 → 0
  tl.fromTo(
    cards,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.15,
      ease: 'power2.out',
    },
    '-=0.3'
  );
});

// ===========================
// SECTION 4: ФИНАЛЬНЫЙ КАДР
// ===========================

// Скрываем контент финала до триггера
gsap.set(['.final__sub', '.final__date', '.final__time', '.final__sign'], {
  opacity: 0,
  y: 20,
});

ScrollTrigger.create({
  trigger: '.final',
  start: 'top 60%',
  once: true,
  onEnter: () => {
    const tl = gsap.timeline();

    // Экран темнеет до полного чёрного — как fade out в кино
    tl.to('.final__overlay', {
      opacity: 1,
      duration: 1.6,
      ease: 'power2.inOut',
    });

    // Строки появляются поочерёдно как финальные титры
    tl.to(
      '.final__sub',
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      '+=0.3'
    );
    tl.to(
      '.final__date',
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      '+=0.6'
    );
    tl.to(
      '.final__time',
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      '+=0.6'
    );
    tl.to(
      '.final__sign',
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      '+=0.8'
    );
  },
});

// ===========================
// АУДИО
// ===========================

const audioBtn = document.getElementById('audio-btn');
const audio    = document.getElementById('ambient-audio');
let audioStarted = false;

function startAudio() {
  if (audioStarted || !audio) return;
  audio.volume = 0;
  audio.play().then(() => {
    // Браузер разрешил — плавный fade-in
    gsap.to(audio, { volume: 0.3, duration: 3, ease: 'power2.out' });
    audioStarted = true;
    if (audioBtn) audioBtn.textContent = '♫';
  }).catch(() => {
    // Autoplay заблокирован — ждём первого касания/клика
    const unlock = () => {
      audio.volume = 0;
      audio.play().then(() => {
        gsap.to(audio, { volume: 0.3, duration: 3, ease: 'power2.out' });
        audioStarted = true;
        if (audioBtn) audioBtn.textContent = '♫';
      }).catch(() => {});
    };
    document.addEventListener('click',      unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('scroll',     unlock, { once: true, passive: true });
  });
}

// Пробуем запустить сразу
startAudio();

if (audioBtn) {
  audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audioStarted) { startAudio(); return; }
    audio.muted = !audio.muted;
    audioBtn.textContent = audio.muted ? '♪' : '♫';
  });
}

