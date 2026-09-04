import { BACKEND_URL } from '../config/constants.js';

export function initContactForm() {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-form-status');

  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.className = 'contact-form-status';
    status.textContent = 'Enviando mensaje...';

    try {
      const response = await fetch(`${BACKEND_URL}/api/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'No se pudo enviar el mensaje');

      form.reset();
      status.classList.add('is-success');
      status.textContent = 'Mensaje enviado. Te responderemos pronto.';
    } catch (error) {
      status.classList.add('is-error');
      status.textContent = 'No pudimos enviar el mensaje. Intenta nuevamente o escríbenos por WhatsApp.';
      console.error(error);
    } finally {
      button.disabled = false;
    }
  });
}