import { WHATSAPP_NUMBER } from '../config/constants.js';
import { buildWhatsappLink } from '../services/contactoService.js';

export function initWhatsappButton(selector) {
  const btn = document.querySelector(selector);
  btn.href = buildWhatsappLink(WHATSAPP_NUMBER, 'Hola, quiero hacer un pedido');
  btn.textContent = 'Pedir por WhatsApp';
}