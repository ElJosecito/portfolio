/**
 * Copiar al portapapeles: `navigator.clipboard.writeText` primero (API
 * moderna, requiere contexto seguro), con un fallback de `document.execCommand`
 * (ya deprecado, pero todavía necesario para contextos/navegadores sin
 * Clipboard API). Antes esta misma función estaba copiada y pegada en
 * Footer.jsx, ContactSection.jsx y Hero.jsx — cada copia disparaba su propio
 * warning de deprecación en consola. Centralizada acá: el warning vive en un
 * solo lugar, y si el fallback deja de hacer falta el día de mañana, se borra
 * en un solo sitio.
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // sigue al fallback de abajo (contexto inseguro, permiso denegado, etc.)
  }

  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999);
    // eslint-disable-next-line deprecation/deprecation -- único lugar donde
    // se llama; ver comentario de arriba.
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  } catch {
    return false;
  }
}
