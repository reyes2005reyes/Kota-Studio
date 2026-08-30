import { createElement } from '../utils/helpers.js';

export function renderCatalogo(productos, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  productos.forEach((producto) => {
    const card = createElement('article', 'producto-card');

    const image = document.createElement('img');
    image.src = producto.imagen;
    image.alt = producto.nombre;

    const content = createElement('div', 'producto-card-content');
    const title = createElement('h3', '', producto.nombre);
    const price = createElement('div', 'precio', producto.precio);
    const description = createElement('p', 'descripcion', producto.descripcion);
    const button = createElement('a', 'btn btn-primary', 'Solicitar');
    button.href = 'https://wa.me/521234567890?text=Hola%2C%20quiero%20más%20información%20sobre%20' + encodeURIComponent(producto.nombre);
    button.target = '_blank';
    button.rel = 'noreferrer';

    content.append(title, price, description, button);
    card.append(image, content);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}
