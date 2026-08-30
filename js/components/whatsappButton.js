import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '../config/constants.js';
import { buildWhatsappLink } from '../services/contactoService.js';

export function initWhatsappButton(selector) {
  const btn = document.querySelector(selector);
  if (!btn) return;

  btn.href = buildWhatsappLink(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);
  btn.innerHTML = '<i class="bi bi-whatsapp me-2"></i>Pedir por WhatsApp';
}