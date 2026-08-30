import { CONFIG } from '../config/constants.js';

export function buildWhatsappLink() {
  const message = encodeURIComponent(CONFIG.whatsappMessage);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
}
