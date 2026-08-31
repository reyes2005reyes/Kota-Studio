import { productos, galeria } from './data/productos.js';
import { renderCatalogo } from './components/renderCatalogo.js';
import { renderGaleria } from './components/renderGaleria.js';
import { initWhatsappButton } from './components/whatsappButton.js';
import { initChatWidget } from './components/chatWidget.js';

document.addEventListener('DOMContentLoaded', () => {
  renderCatalogo(productos, 'catalogo-grid');
  renderGaleria(galeria, 'galeria-grid');
  initWhatsappButton('#btn-whatsapp');
  initChatWidget();
});