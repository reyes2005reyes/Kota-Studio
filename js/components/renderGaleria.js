import { createElement } from '../utils/helpers.js';

export function renderGaleria(imagenes, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  imagenes.forEach((src) => {
    const item = createElement('figure', 'galeria-item');
    const image = document.createElement('img');
    image.src = src;
    image.alt = 'Imagen de la galería';
    item.appendChild(image);
    fragment.appendChild(item);
  });

  container.appendChild(fragment);
}
