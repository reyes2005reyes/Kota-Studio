import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';

// ==== INICIALIZAR FIREBASE ADMIN (usa la Service Account Key, NUNCA en el frontend) ====
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// ==== CONFIGURACIÓN ====
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const MAX_INTENTOS = 3;
const BLOQUEO_MINUTOS = 15;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN; // ej: https://reyes2005reyes.github.io

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

// Control de intentos en memoria (simple, suficiente para 1 solo admin)
let intentosFallidos = 0;
let bloqueadoHasta = null;

// ==== TRANSPORTE DE CORREO (usa tu propio SMTP, ej. Gmail con App Password) ====
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD
  }
});

async function enviarAlertaSeguridad(datos) {
  try {
    await transporter.sendMail({
      from: `"Kota Space - Alertas" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: '⚠️ Alerta de seguridad - Panel Admin',
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color:#F4A300; background:#0D1117; padding:16px; border-radius:8px 8px 0 0;">⚠️ Alerta de Seguridad</h2>
          <div style="background:#fff; padding:16px; border:1px solid #eee; border-radius:0 0 8px 8px;">
            <p>Se detectaron ${MAX_INTENTOS} intentos fallidos de acceso al panel administrador.</p>
            <p><strong>Fecha:</strong> ${datos.fecha}</p>
            <p><strong>IP:</strong> ${datos.ip}</p>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.error('Error enviando correo:', err);
  }
}

// ==== RUTA: LOGIN ADMIN ====
app.post('/api/login', async (req, res) => {
  const { password } = req.body;

  if (bloqueadoHasta && Date.now() < bloqueadoHasta) {
    const minutosRestantes = Math.ceil((bloqueadoHasta - Date.now()) / 60000);
    return res.status(429).json({ error: `Bloqueado. Intenta en ${minutosRestantes} minuto(s).` });
  }

  if (password !== ADMIN_PASSWORD) {
    intentosFallidos++;

    if (intentosFallidos >= MAX_INTENTOS) {
      bloqueadoHasta = Date.now() + BLOQUEO_MINUTOS * 60000;
      await enviarAlertaSeguridad({
        fecha: new Date().toLocaleString('es-EC'),
        ip: req.ip
      });
      return res.status(429).json({ error: `Demasiados intentos. Bloqueado ${BLOQUEO_MINUTOS} minutos.` });
    }

    return res.status(401).json({ error: `Contraseña incorrecta. Intento ${intentosFallidos} de ${MAX_INTENTOS}.` });
  }

  // Login correcto: resetea intentos y da un token válido por 2 horas
  intentosFallidos = 0;
  bloqueadoHasta = null;
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// ==== MIDDLEWARE: verificar token en rutas protegidas ====
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// ==== RUTA: SUMAR ESTRELLA (protegida) ====
app.post('/api/sumar-estrella', verificarToken, async (req, res) => {
  const { telefono, nombre } = req.body;
  if (!telefono) return res.status(400).json({ error: 'Falta el teléfono' });

  const telefonoLimpio = telefono.replace(/\s+|\+/g, '');
  const ref = db.collection('clientes').doc(telefonoLimpio);

  try {
    const snap = await ref.get();

    if (snap.exists) {
      await ref.update({
        estrellas: admin.firestore.FieldValue.increment(1),
        ultimaCompra: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await ref.set({
        nombre: nombre || 'Cliente',
        estrellas: 1,
        ultimaCompra: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.json({ ok: true, mensaje: 'Estrella sumada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar en la base de datos' });
  }
});

// ==== RUTA: CONSULTAR ESTRELLAS (pública, la usa index.html) ====
app.get('/api/estrellas/:telefono', async (req, res) => {
  const telefonoLimpio = req.params.telefono.replace(/\s+|\+/g, '');
  const ref = db.collection('clientes').doc(telefonoLimpio);

  try {
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(snap.data());
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar' });
  }
});

app.get('/', (req, res) => res.send('Kota Space backend activo ✅'));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));