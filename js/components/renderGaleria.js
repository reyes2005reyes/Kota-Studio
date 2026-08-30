import { createElement } from '../utils/helpers.js';

export function renderGaleria(imagenes, containerId) {
  const container = document.querySelector(containerId.startsWith('#') ? containerId : `#${containerId}`);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  imagenes.forEach((src) => {
    const item = createElement('figure', 'galeria-item');
    const image = document.createElement('img');
    image.src = src;
    image.alt = 'Proyecto de Mundo Láser EC';
    image.loading = 'lazy';
    item.appendChild(image);
    fragment.appendChild(item);
  });

  container.appendChild(fragment);
}
