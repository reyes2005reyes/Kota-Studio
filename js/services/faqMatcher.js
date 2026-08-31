import { faqData } from '../data/faq.js';

export function buscarRespuesta(pregunta) {
  const texto = pregunta.toLowerCase();

  const match = faqData.find(item =>
    item.keywords.some(palabra => texto.includes(palabra))
  );

  return match
    ? match.respuesta
    : 'No tengo esa respuesta exacta, pero puedes escribirnos directo por WhatsApp y te ayudamos enseguida.';
}
