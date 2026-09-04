const BACKEND_URL = 'https://kota-studio-tqh7.onrender.com';

const loginBox = document.querySelector('#login-box');
const adminPanel = document.querySelector('#admin-panel');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const estrellaForm = document.querySelector('#estrella-form');
const resultado = document.querySelector('#estrella-resultado');
const passwordInput = document.querySelector('#admin-password');
const submitBtn = loginForm.querySelector('button[type="submit"]');
const statsResultado = document.querySelector('#stats-resultado');
const clientesLista = document.querySelector('#clientes-lista');
const clientesBusqueda = document.querySelector('#clientes-busqueda');
const clientCount = document.querySelector('#client-count');
let clientes = [];

function formatoFecha(fecha) {
  if (!fecha) return 'Sin registros';
  return new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(fecha));
}

function renderClientes(lista) {
  clientCount.textContent = `${lista.length} ${lista.length === 1 ? 'cliente' : 'clientes'}`;
  if (!lista.length) {
    clientesLista.innerHTML = '<tr><td colspan="4" class="admin-table-empty">No se encontraron clientes.</td></tr>';
    return;
  }

  clientesLista.replaceChildren(...lista.map((cliente) => {
    const row = document.createElement('tr');
    row.innerHTML = `<th scope="row">${cliente.nombre}</th><td>${cliente.telefono}</td><td><strong>${cliente.estrellas}</strong> / 10</td><td>${formatoFecha(cliente.ultimaCompra)}</td>`;
    return row;
  }));
}

async function cargarClientes() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/clientes`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (res.status === 401) {
      clearToken();
      mostrarLogin();
      return;
    }
    if (!res.ok) throw new Error(data.error || 'Error al cargar clientes');
    clientes = data.clientes;
    renderClientes(clientes);
  } catch (err) {
    clientesLista.innerHTML = '<tr><td colspan="4" class="admin-table-empty">No se pudieron cargar los clientes.</td></tr>';
    console.error(err);
  }
}

async function cargarEstadisticas() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/estadisticas`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();

    if (res.status === 401) {
      clearToken();
      mostrarLogin();
      return;
    }
    if (!res.ok) throw new Error(data.error || 'Error al cargar estadísticas');

    document.querySelector('#stats-clientes').textContent = data.clientes;
    document.querySelector('#stats-estrellas').textContent = data.estrellas;
    document.querySelector('#stats-recompensas').textContent = data.clientesConRecompensa;
    statsResultado.textContent = '';
  } catch (err) {
    statsResultado.textContent = 'No se pudieron cargar las estadísticas.';
    console.error(err);
  }
}

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
  cargarEstadisticas();
  cargarClientes();
}

clientesBusqueda.addEventListener('input', () => {
  const query = clientesBusqueda.value.trim().toLocaleLowerCase();
  renderClientes(clientes.filter((cliente) => `${cliente.nombre} ${cliente.telefono}`.toLocaleLowerCase().includes(query)));
});

document.querySelector('#refresh-stats').addEventListener('click', () => {
  cargarEstadisticas();
  cargarClientes();
});

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
    cargarEstadisticas();
    cargarClientes();
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
    cargarEstadisticas();
  } catch (err) {
    resultado.textContent = 'No se pudo conectar al servidor. Intenta de nuevo.';
    console.error(err);
  }
});