const WHATSAPP_NUMBER = "595983755161";

export const email = "contacto@binalis.com.py";

export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, quiero cotizar un proyecto.",
)}`;

// RFC 6068: mailto needs %20 (not "+") and CRLF line breaks, which encodeURIComponent gives.
const quoteSubject = "Cotización de proyecto";
const quoteBody = [
  "Hola, quiero cotizar un proyecto.",
  "",
  "Nombre:",
  "Empresa:",
  "Qué necesito:",
  "Para cuándo:",
].join("\r\n");

export const emailQuoteUrl = `mailto:${email}?subject=${encodeURIComponent(
  quoteSubject,
)}&body=${encodeURIComponent(quoteBody)}`;
