const COLORS = [
  '#8b4513', // терракотовый
  '#c9a96e', // золото
  '#f5f0e4', // крем
  '#d6cbaf', // тёплый беж
  '#a0522d', // сиена
  '#e8c98a', // светлое золото
  '#c17f3a', // янтарь
];

const GRAVITY    = 0.28;
const DRAG       = 0.985;
const DURATION   = 4000; // мс до полного угасания

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function makeParticle(x, y, angle, speed) {
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    color:  COLORS[Math.floor(Math.random() * COLORS.length)],
    w:      randomBetween(5, 12),
    h:      randomBetween(3,  6),
    rot:    randomBetween(0, Math.PI * 2),
    rotV:   randomBetween(-0.18, 0.18),
    shape:  Math.random() > 0.35 ? 'rect' : 'circle',
    opacity: 1,
  };
}

export function launchConfetti() {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position:      'fixed',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '9999',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const W   = canvas.width  = window.innerWidth;
  const H   = canvas.height = window.innerHeight;

  // Два залпа — из нижних углов вверх, как хлопушки
  const particles = [];

  const addBurst = (bx, by, baseAngle, spread, count) => {
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + randomBetween(-spread / 2, spread / 2);
      const speed = randomBetween(9, 22);
      particles.push(makeParticle(bx, by, angle, speed));
    }
  };

  // Левая хлопушка — из левого нижнего угла, вверх-вправо
  addBurst(W * 0.05, H * 0.7, -Math.PI / 3, Math.PI / 2.2, 70);
  // Правая хлопушка — из правого нижнего угла, вверх-влево
  addBurst(W * 0.95, H * 0.7, -Math.PI * 2 / 3, Math.PI / 2.2, 70);

  let startTime = null;

  function tick(ts) {
    if (!startTime) startTime = ts;
    const elapsed  = ts - startTime;
    const fadeRatio = Math.max(0, 1 - elapsed / DURATION);

    ctx.clearRect(0, 0, W, H);

    let alive = false;

    for (const p of particles) {
      p.vy  += GRAVITY;
      p.vx  *= DRAG;
      p.vy  *= DRAG;
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;
      p.opacity = fadeRatio;

      if (p.y < H + 40 && p.opacity > 0.01) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      }
    }

    if (alive) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(tick);
}
