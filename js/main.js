import { productos } from './data/productos.js';
import { renderCatalogo } from './components/renderCatalogo.js';
import { renderGaleria } from './components/renderGaleria.js';
import { initWhatsappButton } from './components/whatsappButton.js';

document.addEventListener('DOMContentLoaded', () => {
  renderCatalogo(productos, '#catalogo');
  renderGaleria('#galeria');
  initWhatsappButton('#btn-whatsapp');
});