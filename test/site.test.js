import test from 'node:test';
import assert from 'node:assert/strict';

import { WHATSAPP_NUMBER } from '../js/config/constants.js';
import { buildWhatsappLink } from '../js/services/contactoService.js';
import { maquinaGaleria } from '../js/data/productos.js';

test('config exporta el número de WhatsApp', () => {
  assert.equal(typeof WHATSAPP_NUMBER, 'string');
  assert.match(WHATSAPP_NUMBER, /^593/);
});

test('buildWhatsappLink arma el enlace correcto', () => {
  const link = buildWhatsappLink(WHATSAPP_NUMBER, 'Hola, necesito ayuda');
  assert.match(link, /^https:\/\/wa\.me\//);
  assert.match(link, /Hola%2C%20necesito%20ayuda/);
});

test('la landing incluye el video de la máquina', async () => {
  const html = await import('node:fs/promises').then((fs) => fs.readFile('index.html', 'utf8'));
  assert.match(html, /<video[^>]*src=["']assets\/img\/logo\/video\.mp4["'][^>]*>/i);
  assert.match(html, /autoplay/i);
  assert.match(html, /muted/i);
  assert.match(html, /loop/i);
});

test('la galería de la máquina incluye las imágenes de la máquina', async () => {
  const html = await import('node:fs/promises').then((fs) => fs.readFile('index.html', 'utf8'));
  assert.ok(maquinaGaleria.length >= 4);
  assert.ok(maquinaGaleria.every((src) => /assets\/img\/galeria\/maquina(?:1|2|3)?\.webp$/.test(src)));
  assert.match(html, /id=["']maquina-grid["']/i);
});
