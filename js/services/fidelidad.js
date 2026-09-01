import { db } from '../config/firebase.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

export async function consultarEstrellas(telefono) {
  const telefonoLimpio = telefono.replace(/\s+|\+/g, '');
  const ref = doc(db, 'clientes', telefonoLimpio);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null; // cliente no encontrado
  }

  return snap.data(); // { nombre, estrellas, ultimaCompra }
}