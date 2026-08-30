import { buildWhatsappLink } from '../services/contactoService.js';

export function setupWhatsappButton(selector = '.whatsapp-button') {
  const button = document.querySelector(selector);
  if (!button) return;

  button.href = buildWhatsappLink();
}
