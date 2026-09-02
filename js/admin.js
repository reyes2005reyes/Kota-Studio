const BACKEND_URL = 'https://kota-studio-tqh7.onrender.com';

const loginBox = document.querySelector('#login-box');
const adminPanel = document.querySelector('#admin-panel');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const estrellaForm = document.querySelector('#estrella-form');
const resultado = document.querySelector('#estrella-resultado');
const passwordInput = document.querySelector('#admin-password');
const submitBtn = loginForm.querySelector('button[type="submit"]');

// ==== SESIÓN (guarda el token en el navegador mientras dura, 2h) ====
function getToken() {
  return sessionStorage.getItem('adminToken');
}

function setToken(token) {
  sessionStorage.setItem('adminToken', token);
}

function clearToken() {
  sessionStorage.removeItem('adminToken');
}

function mostrarPanel() {
  loginBox.classList.add('d-none');
  adminPanel.classList.remove('d-none');
}

function mostrarLogin() {
  loginBox.classList.remove('d-none');
  adminPanel.classList.add('d-none');
}

// Si ya hay un token guardado (sesión previa), muestra el panel directo
if (getToken()) {
  mostrarPanel();
}

// ==== LOGIN ====
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verificando...';

  try {
    const res = await fetch(`${BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput.value })
    });

    const data = await res.json();

    if (!res.ok) {
      loginError.textContent = data.error || 'Error al iniciar sesión.';
      if (res.status === 429) {
        passwordInput.disabled = true;
        submitBtn.disabled = true;
      }
      return;
    }

    setToken(data.token);
    mostrarPanel();
  } catch (err) {
    loginError.textContent = 'No se pudo conectar al servidor. Intenta de nuevo en unos segundos (el servidor puede tardar en despertar).';
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Iniciar sesión';
  }
});

// ==== LOGOUT ====
document.querySelector('#logout-btn').addEventListener('click', () => {
  clearToken();
  mostrarLogin();
});

// ==== SUMAR ESTRELLA ====
estrellaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const telefono = document.querySelector('#cliente-telefono').value;
  const nombre = document.querySelector('#cliente-nombre').value;

  resultado.textContent = 'Guardando...';

  try {
    const res = await fetch(`${BACKEND_URL}/api/sumar-estrella`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ telefono, nombre })
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        resultado.textContent = 'Tu sesión expiró, vuelve a iniciar sesión.';
        clearToken();
        mostrarLogin();
        return;
      }
      resultado.textContent = data.error || 'Error al guardar.';
      return;
    }

    resultado.textContent = '¡Estrella sumada correctamente!';
    estrellaForm.reset();
  } catch (err) {
    resultado.textContent = 'No se pudo conectar al servidor. Intenta de nuevo.';
    console.error(err);
  }
});