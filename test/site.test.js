import test from 'node:test';
import assert from 'node:assert/strict';

import { WHATSAPP_NUMBER } from '../js/config/constants.js';
import { buildWhatsappLink } from '../js/services/contactoService.js';
import { maquinaGaleria, productos } from '../js/data/productos.js';
import { buscarRespuesta } from '../js/services/faqMatcher.js';

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

test('el sitio muestra la nueva dirección', async () => {
  const inicio = await import('node:fs/promises').then((fs) => fs.readFile('index.html', 'utf8'));
  const contacto = await import('node:fs/promises').then((fs) => fs.readFile('contacto.html', 'utf8'));
  assert.match(inicio, /Miguel de Santiago, y C\. 4, 170806 Quito/);
  assert.match(contacto, /Miguel de Santiago, y C\. 4, 170806 Quito/);
  assert.doesNotMatch(inicio, /La Gasca|Mena de Valenzuela|Equifrio/);
  assert.doesNotMatch(contacto, /La Gasca|Mena de Valenzuela/);
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

test('el panel admin incluye dashboard y gestión de clientes', async () => {
  const html = await import('node:fs/promises').then((fs) => fs.readFile('admin.html', 'utf8'));
  const script = await import('node:fs/promises').then((fs) => fs.readFile('js/admin.js', 'utf8'));
  const backend = await import('node:fs/promises').then((fs) => fs.readFile('backend/server.js', 'utf8'));
  assert.match(html, /id=["']clientes-lista["']/i);
  assert.match(html, /id=["']refresh-stats["']/i);
  assert.match(script, /\/api\/clientes/);
  assert.match(backend, /app\.get\(['"]\/api\/clientes['"], verificarToken/);
});

test('la barra lateral del admin requiere una sesión autenticada', async () => {
  const html = await import('node:fs/promises').then((fs) => fs.readFile('admin.html', 'utf8'));
  const estilos = await import('node:fs/promises').then((fs) => fs.readFile('css/main.css', 'utf8'));
  const script = await import('node:fs/promises').then((fs) => fs.readFile('js/admin.js', 'utf8'));
  assert.match(html, /class="admin-sidebar"/);
  assert.match(estilos, /\.admin-sidebar\s*\{\s*display:\s*none/);
  assert.match(estilos, /\.admin-page\.is-authenticated \.admin-sidebar/);
  assert.match(script, /document\.body\.classList\.add\('is-authenticated'\)/);
});

test('el asistente responde con los datos actuales del catálogo', () => {
  assert.match(buscarRespuesta('¿Cuánto cuestan los planos de 400 m2?'), /Básico \$8\.00, Pro \$13\.00 y Full \$50\.00/);
  assert.match(buscarRespuesta('¿Qué materiales tienen?'), /MDF, balsa, paja, corrugado, microcorrugado, acrílicos y corcho/);
  assert.match(buscarRespuesta('¿Cuál es el horario?'), /lunes a sábado, de 9:00 a 18:00/);
  assert.match(buscarRespuesta('¿Dónde están ubicados?'), /Miguel de Santiago, y C\. 4, 170806 Quito/);
});
