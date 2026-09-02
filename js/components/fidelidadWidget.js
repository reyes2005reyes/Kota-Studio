import { consultarEstrellas } from '../services/fidelidad.js';

const META_ESTRELLAS = 10; // cuántas estrellas se necesitan para el descuento

export function initFidelidadWidget() {
  const form = document.querySelector('#fidelidad-form');
  const input = document.querySelector('#fidelidad-telefono');
  const resultado = document.querySelector('#fidelidad-resultado');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultado.innerHTML = 'Consultando...';

    try {
      const cliente = await consultarEstrellas(input.value);

      if (!cliente) {
        resultado.innerHTML = `<p class="text-muted">No encontramos ese número. Verifica o contáctanos por WhatsApp.</p>`;
        return;
      }

      const estrellas = cliente.estrellas || 0;
      const faltan = Math.max(META_ESTRELLAS - estrellas, 0);

      resultado.innerHTML = `
        <p>¡Hola, ${cliente.nombre}!</p>
        <p class="fidelidad-estrellas">${'★'.repeat(estrellas)}${'☆'.repeat(Math.max(META_ESTRELLAS - estrellas, 0))}</p>
        <p>${faltan > 0
          ? `Te faltan ${faltan} estrella(s) para tu descuento.`
          : '¡Ya alcanzaste tu descuento! Escríbenos por WhatsApp para reclamarlo.'}</p>
      `;
    } catch (err) {
      resultado.innerHTML = `<p class="text-danger">Ocurrió un error, intenta de nuevo.</p>`;
      console.error(err);
    }
  });
}