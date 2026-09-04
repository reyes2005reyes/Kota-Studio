import test from 'node:test';
import assert from 'node:assert/strict';

import { WHATSAPP_NUMBER } from '../js/config/constants.js';
import { buildWhatsappLink } from '../js/services/contactoService.js';
import { maquinaGaleria, productos } from '../js/data/productos.js';

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

test('la página de contacto incluye el formulario por correo', async () => {
  const html = await import('node:fs/promises').then((fs) => fs.readFile('contacto.html', 'utf8'));
  const componente = await import('node:fs/promises').then((fs) => fs.readFile('js/components/contactForm.js', 'utf8'));
  assert.match(html, /id=["']contact-form["']/i);
  assert.match(html, /name=["']email["']/i);
  assert.match(componente, /\/api\/contacto/);
});

test('el catálogo utiliza la lista de precios del Excel', () => {
  assert.ok(productos.some((producto) => producto.precio === '$8.00'));
  assert.ok(productos.some((producto) => producto.precio === '$30.00'));
  assert.ok(productos.some((producto) => producto.nombre === 'Servicio de impresión 3D'));
});

test('el catálogo tiene búsqueda y agrupación por categorías', async () => {
  const html = await import('node:fs/promises').then((fs) => fs.readFile('catalogo.html', 'utf8'));
  const componente = await import('node:fs/promises').then((fs) => fs.readFile('js/components/renderCatalogo.js', 'utf8'));
  assert.match(html, /id=["']catalogo-busqueda["']/i);
  assert.match(componente, /new Map\(\)/);
  assert.match(componente, /catalogo-table/);
  assert.doesNotMatch(componente, /image\.src/);
});

test('el catálogo vive en una página independiente', async () => {
  const pagina = await import('node:fs/promises').then((fs) => fs.readFile('catalogo.html', 'utf8'));
  const inicio = await import('node:fs/promises').then((fs) => fs.readFile('index.html', 'utf8'));
  assert.match(pagina, /id=["']catalogo-grid["']/i);
  assert.match(pagina, /id=["']catalogo-busqueda["']/i);
  assert.match(inicio, /href=["']catalogo\.html["']/i);
  assert.doesNotMatch(inicio, /id=["']catalogo-grid["']/i);
});
