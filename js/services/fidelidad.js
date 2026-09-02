const BACKEND_URL = 'https://kota-studio-tqh7.onrender.com';

export async function consultarEstrellas(telefono) {
  const telefonoLimpio = telefono.replace(/\s+|\+/g, '');

  const res = await fetch(`${BACKEND_URL}/api/estrellas/${telefonoLimpio}`);

  if (res.status === 404) {
    return null; // cliente no encontrado
  }

  if (!res.ok) {
    throw new Error('Error al consultar estrellas');
  }

  return res.json(); // { nombre, estrellas, ultimaCompra }
}