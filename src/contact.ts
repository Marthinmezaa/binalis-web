const WHATSAPP_NUMBER = "595983755161";

export const email = "contacto@binalis.com.py";

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const whatsappUrl = whatsappLink("Hola, quiero cotizar un proyecto.");

export const whatsappNeeds = [
  {
    label: "Necesito una página web",
    url: whatsappLink("Hola, necesito una página web."),
  },
  {
    label: "Necesito un sistema",
    url: whatsappLink("Hola, necesito un sistema a medida."),
  },
  {
    label: "Necesito una landing",
    url: whatsappLink("Hola, necesito una landing page."),
  },
];

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
