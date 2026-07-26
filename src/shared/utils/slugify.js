/**
 * Convierte un título en un slug apto para URL.
 *
 * Normaliza a NFD y quita los diacríticos para que "Aplicación Móvil" salga
 * como "aplicacion-movil" y no pierda letras por el camino.
 */
export function slugify(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default slugify;
