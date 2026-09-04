import { createElement } from '../utils/helpers.js';

export function renderCatalogo(productos, containerId) {
  const container = document.querySelector(containerId.startsWith('#') ? containerId : `#${containerId}`);
  if (!container) return;

  const render = (lista) => {
    container.replaceChildren();

    if (!lista.length) {
      const empty = createElement('p', 'catalogo-empty', 'No encontramos resultados para tu búsqueda.');
      container.appendChild(empty);
      return;
    }

    const grupos = lista.reduce((resultado, producto) => {
      const categoria = producto.categoria || 'Otros';
      if (!resultado.has(categoria)) resultado.set(categoria, []);
      resultado.get(categoria).push(producto);
      return resultado;
    }, new Map());

    grupos.forEach((grupo, categoria) => {
      const section = createElement('section', 'catalogo-grupo');
      const heading = createElement('h3', 'catalogo-grupo-title', categoria);
      const tableWrapper = createElement('div', 'catalogo-table-wrapper');
      const table = document.createElement('table');
      table.className = 'catalogo-table';
      const caption = document.createElement('caption');
      caption.className = 'visually-hidden';
      caption.textContent = categoria;
      const head = document.createElement('thead');
      const headRow = document.createElement('tr');
      ['Servicio o producto', 'Precio', 'Detalle', ''].forEach((texto) => {
        const cell = document.createElement('th');
        cell.scope = 'col';
        cell.textContent = texto;
        headRow.appendChild(cell);
      });
      head.appendChild(headRow);
      const body = document.createElement('tbody');

      grupo.forEach((producto) => {
        const row = document.createElement('tr');
        const title = document.createElement('th');
        title.scope = 'row';
        title.textContent = producto.nombre;
        const price = createElement('td', 'precio', producto.precio);
        const description = createElement('td', 'descripcion', producto.descripcion);
        const actionCell = document.createElement('td');
        const button = createElement('a', 'btn btn-primary btn-sm', 'Solicitar');
        button.href = 'https://wa.me/593987426825?text=' + encodeURIComponent(`Hola, quiero más información sobre ${producto.nombre}`);
        button.target = '_blank';
        button.rel = 'noreferrer';

        actionCell.appendChild(button);
        row.append(title, price, description, actionCell);
        body.appendChild(row);
      });

      table.append(caption, head, body);
      tableWrapper.appendChild(table);
      section.append(heading, tableWrapper);
      container.appendChild(section);
    });
  };

  render(productos);

  const search = document.querySelector('#catalogo-busqueda');
  if (search) {
    search.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase();
      const filtrados = productos.filter((producto) =>
        [producto.categoria, producto.nombre, producto.precio, producto.descripcion]
          .some((valor) => valor.toLocaleLowerCase().includes(query))
      );
      render(filtrados);
    });
  }
}
