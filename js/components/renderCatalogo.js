import { createElement } from '../utils/helpers.js';

export function renderCatalogo(productos, containerId) {
  const container = document.querySelector(containerId.startsWith('#') ? containerId : `#${containerId}`);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  productos.forEach((producto) => {
    const card = createElement('article', 'producto-card col-md-6 col-xl-4');

    const image = document.createElement('img');
    image.src = producto.imagen;
    image.alt = producto.nombre;

    const content = createElement('div', 'producto-card-content');
    const title = createElement('h3', '', producto.nombre);
    const price = createElement('div', 'precio', producto.precio);
    const description = createElement('p', 'descripcion', producto.descripcion);
    const button = createElement('a', 'btn btn-primary', 'Solicitar');
    button.href = 'https://wa.me/593987426825?text=' + encodeURIComponent(`Hola, quiero más información sobre ${producto.nombre}`);
    button.target = '_blank';
    button.rel = 'noreferrer';

    content.append(title, price, description, button);
    card.append(image, content);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}
