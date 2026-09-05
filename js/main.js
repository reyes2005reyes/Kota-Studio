import { initWhatsappButton } from './components/whatsappButton.js';
import { initChatWidget } from './components/chatWidget.js';
import { initFidelidadWidget } from './components/fidelidadWidget.js';
import { initContactForm } from './components/contactForm.js';

const pageLoaderStartedAt = performance.now();

function initHeroStars() {
  const canvas = document.querySelector('#hero-stars-canvas');
  const hero = canvas?.closest('.hero');
  if (!canvas || !hero) return;

  const context = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stars = [];
  let animationFrame;
  let lastTime = performance.now();

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = hero.clientWidth * ratio;
    canvas.height = hero.clientHeight * ratio;
    canvas.style.width = `${hero.clientWidth}px`;
    canvas.style.height = `${hero.clientHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(70, Math.round((hero.clientWidth * hero.clientHeight) / 8500));
    stars.length = 0;
    for (let index = 0; index < count; index += 1) {
      stars.push({
        x: Math.random() * hero.clientWidth,
        y: Math.random() * hero.clientHeight,
        radius: Math.random() * 1.8 + 0.7,
        speed: Math.random() * 10 + 5,
        color: index % 4 === 0 ? 'rgba(243, 162, 190, 0.95)' : 'rgba(0, 117, 153, 0.78)',
      });
    }
  };

  const draw = (time) => {
    const elapsed = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    context.clearRect(0, 0, hero.clientWidth, hero.clientHeight);

    stars.forEach((star) => {
      if (!reducedMotion) {
        star.y -= star.speed * elapsed;
        if (star.y < -4) star.y = hero.clientHeight + 4;
      }
      context.beginPath();
      context.fillStyle = star.color;
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    });

    if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  draw(lastTime);

  if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
  canvas.dataset.animationFrame = String(animationFrame || 'static');
}

document.addEventListener('DOMContentLoaded', () => {
  const pageLoader = document.querySelector('#page-loader');

  initWhatsappButton('#btn-whatsapp');
  initChatWidget();
  initFidelidadWidget();
  initContactForm();
  initHeroStars();

  if (pageLoader) {
    const minimumDisplayTime = 1800;
    const elapsedTime = performance.now() - pageLoaderStartedAt;
    const hideLoader = () => {
      pageLoader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      pageLoader.addEventListener('transitionend', () => pageLoader.remove(), { once: true });
    };

    window.setTimeout(hideLoader, Math.max(0, minimumDisplayTime - elapsedTime));
  }
});