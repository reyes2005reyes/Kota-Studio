import { db, auth } from './config/firebase.js';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import {
  doc, getDoc, setDoc, updateDoc, increment, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

// ==== CONFIGURACIÓN EMAILJS ====
// Reemplaza estos 3 valores con los que te dio EmailJS
const EMAILJS_PUBLIC_KEY = 'w-UJuUuAddV7_-7Tz';
const EMAILJS_SERVICE_ID = 'service_11909t2';
const EMAILJS_TEMPLATE_ID = 'template_o61py0p';

const MAX_INTENTOS = 3;
const BLOQUEO_MINUTOS = 15;

const loginBox = document.querySelector('#login-box');
const adminPanel = document.querySelector('#admin-panel');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const estrellaForm = document.querySelector('#estrella-form');
const resultado = document.querySelector('#estrella-resultado');
const emailInput = document.querySelector('#admin-email');
const passwordInput = document.querySelector('#admin-password');
const submitBtn = loginForm.querySelector('button[type="submit"]');

// Inicializar EmailJS
if (window.emailjs) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// ==== CONTROL DE INTENTOS (localStorage) ====
function getIntentos() {
  const data = JSON.parse(localStorage.getItem('loginIntentos') || '{"count":0,"bloqueadoHasta":null}');
  return data;
}

function guardarIntentos(data) {
  localStorage.setItem('loginIntentos', JSON.stringify(data));
}

function estaBloqueado() {
  const data = getIntentos();
  if (!data.bloqueadoHasta) return false;
  return Date.now() < data.bloqueadoHasta;
}

function minutosRestantes() {
  const data = getIntentos();
  return Math.ceil((data.bloqueadoHasta - Date.now()) / 60000);
}

function actualizarUIBloqueo() {
  if (estaBloqueado()) {
    emailInput.disabled = true;
    passwordInput.disabled = true;
    submitBtn.disabled = true;
    loginError.textContent = `Demasiados intentos. Intenta de nuevo en ${minutosRestantes()} minuto(s).`;
  } else {
    emailInput.disabled = false;
    passwordInput.disabled = false;
    submitBtn.disabled = false;
  }
}

function enviarAlertaSeguridad(emailIntentado) {
  if (!window.emailjs) {
    console.warn('EmailJS no está cargado, no se pudo enviar la alerta.');
    return;
  }

  const params = {
    mensaje: `Se detectaron ${MAX_INTENTOS} intentos fallidos de acceso al panel admin de Kota Studio.`,
    correo_intentado: emailIntentado,
    fecha: new Date().toLocaleString('es-EC'),
    navegador: navigator.userAgent
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(() => console.log('Alerta de seguridad enviada.'))
    .catch((err) => console.error('Error enviando alerta:', err));
}

// Revisar bloqueo al cargar la página
actualizarUIBloqueo();
if (estaBloqueado()) {
  const intervalo = setInterval(() => {
    if (!estaBloqueado()) {
      actualizarUIBloqueo();
      loginError.textContent = '';
      clearInterval(intervalo);
    } else {
      actualizarUIBloqueo();
    }
  }, 30000); // revisa cada 30s
}

// Mostrar panel solo si hay sesión activa
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBox.classList.add('d-none');
    adminPanel.classList.remove('d-none');
  } else {
    loginBox.classList.remove('d-none');
    adminPanel.classList.add('d-none');
  }
});

// Login con control de intentos
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  if (estaBloqueado()) {
    actualizarUIBloqueo();
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Login exitoso: resetea el contador
    guardarIntentos({ count: 0, bloqueadoHasta: null });
  } catch (err) {
    const data = getIntentos();
    data.count += 1;

    if (data.count >= MAX_INTENTOS) {
      data.bloqueadoHasta = Date.now() + BLOQUEO_MINUTOS * 60000;
      guardarIntentos(data);
      actualizarUIBloqueo();
      enviarAlertaSeguridad(email);
    } else {
      guardarIntentos(data);
      loginError.textContent = `Correo o contraseña incorrectos. Intento ${data.count} de ${MAX_INTENTOS}.`;
    }
  }
});

// Logout
document.querySelector('#logout-btn').addEventListener('click', () => signOut(auth));

// Sumar estrella
estrellaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const telRaw = document.querySelector('#cliente-telefono').value;
  const telefono = telRaw.replace(/\s+|\+/g, '');
  const nombre = document.querySelector('#cliente-nombre').value;

  resultado.textContent = 'Guardando...';

  const ref = doc(db, 'clientes', telefono);

  try {
    const snap = await getDoc(ref);

    if (snap.exists()) {
      await updateDoc(ref, {
        estrellas: increment(1),
        ultimaCompra: serverTimestamp()
      });
    } else {
      await setDoc(ref, {
        nombre: nombre || 'Cliente',
        estrellas: 1,
        ultimaCompra: serverTimestamp()
      });
    }
    resultado.textContent = '¡Estrella sumada correctamente!';
    estrellaForm.reset();
  } catch (err) {
    resultado.textContent = 'Error al guardar. Intenta de nuevo.';
    console.error(err);
  }
});