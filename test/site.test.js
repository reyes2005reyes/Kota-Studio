import test from 'node:test';
import assert from 'node:assert/strict';

import { WHATSAPP_NUMBER } from '../js/config/constants.js';
import { buildWhatsappLink } from '../js/services/contactoService.js';

test('config exporta el número de WhatsApp', () => {
  assert.equal(typeof WHATSAPP_NUMBER, 'string');
  assert.match(WHATSAPP_NUMBER, /^593/);
});

test('buildWhatsappLink arma el enlace correcto', () => {
  const link = buildWhatsappLink(WHATSAPP_NUMBER, 'Hola, necesito ayuda');
  assert.match(link, /^https:\/\/wa\.me\//);
  assert.match(link, /Hola%2C%20necesito%20ayuda/);
});
