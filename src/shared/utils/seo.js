export const SITE_URL = "https://josecito.dev";
export const SITE_NAME = "Jose Martinez";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const SOCIAL_LINKS = [
  "https://github.com/Eljosecito",
  "https://www.linkedin.com/in/jose-martinez-dev/",
];

// WhatsApp va aparte de SOCIAL_LINKS: esa lista también se usa como `sameAs`
// en el structured data (perfiles públicos), y un número de teléfono no es
// un perfil. Formato internacional sin "+" ni guiones (wa.me lo exige):
// 1 (República Dominicana) + 829-465-8484.
const WHATSAPP_NUMBER = "18294658484";

export function whatsappUrl(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Arma una URL absoluta del sitio.
 *
 * Los crawlers necesitan absolutas en `canonical` y `og:*`; una relativa la
 * resuelven contra el host que estén usando y terminás con canonicals apuntando
 * a un dominio que no es el tuyo.
 */
export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Recorta una descripción al largo que muestran los buscadores.
 *
 * Google corta alrededor de los 160 caracteres. Cortar acá y no allá evita que
 * la frase quede partida a la mitad: se corta en el último espacio.
 */
export function truncate(text, max = 158) {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}
