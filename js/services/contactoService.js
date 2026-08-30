export function buildWhatsappLink(numero, mensaje) {
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${numero}?text=${texto}`;
}