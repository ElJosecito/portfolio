/**
 * Junta clases ignorando falsy. Reemplaza a clsx + tailwind-merge.
 *
 * Ojo: NO resuelve conflictos entre clases de Tailwind. Si un componente trae
 * `px-4` y le pasás `px-2`, quedan las dos en el atributo y gana la que esté
 * después en la hoja de estilos, no la que pasaste. Por eso los componentes de
 * acá exponen props (`size`, `variant`, `block`) en vez de esperar que les
 * pisen las clases desde afuera. `className` es para agregar, no para corregir.
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default cn;
