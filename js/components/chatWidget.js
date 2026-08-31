import { buscarRespuesta } from '../services/faqMatcher.js';

export function initChatWidget() {
  const form = document.querySelector('#chat-form');
  const input = document.querySelector('#chat-input');
  const mensajes = document.querySelector('#chat-mensajes');
  const chatToggle = document.querySelector('#chat-toggle');
  const chatWidget = document.querySelector('#chat-widget');

  // Abrir/cerrar widget
  chatToggle.addEventListener('click', () => {
    chatWidget.classList.toggle('chat-open');
  });

  // Enviar mensaje
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pregunta = input.value.trim();
    if (!pregunta) return;

    agregarMensaje(pregunta, 'usuario');
    const respuesta = buscarRespuesta(pregunta);
    setTimeout(() => agregarMensaje(respuesta, 'bot'), 400);

    input.value = '';
  });

  function agregarMensaje(texto, tipo) {
    const burbuja = document.createElement('div');
    burbuja.className = `chat-msg chat-msg-${tipo}`;
    burbuja.textContent = texto;
    mensajes.appendChild(burbuja);
    mensajes.scrollTop = mensajes.scrollHeight;
  }
}
