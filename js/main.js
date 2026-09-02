import { productos, galeria, maquinaGaleria } from './data/productos.js';
import { renderCatalogo } from './components/renderCatalogo.js';
import { renderGaleria } from './components/renderGaleria.js';
import { initWhatsappButton } from './components/whatsappButton.js';
import { initChatWidget } from './components/chatWidget.js';
import { initFidelidadWidget } from './components/fidelidadWidget.js';

const pageLoaderStartedAt = performance.now();

document.addEventListener('DOMContentLoaded', () => {
  const pageLoader = document.querySelector('#page-loader');

  renderCatalogo(productos, 'catalogo-grid');
  renderGaleria(galeria, 'galeria-grid');
  renderGaleria(maquinaGaleria, 'maquina-grid');
  initWhatsappButton('#btn-whatsapp');
  initChatWidget();
  initFidelidadWidget();

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