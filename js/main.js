import { productos, galeria } from './data/productos.js';
import { renderCatalogo } from './components/renderCatalogo.js';
import { renderGaleria } from './components/renderGaleria.js';
import { setupWhatsappButton } from './components/whatsappButton.js';

document.addEventListener('DOMContentLoaded', () => {
  renderCatalogo(productos, 'catalogoGrid');
  renderGaleria(galeria, 'galeriaGrid');
  setupWhatsappButton();
});
