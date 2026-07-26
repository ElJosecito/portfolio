import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// La tabla es de una sola fila y la clave es conocida, así que el panel puede
// hacer UPSERT sin leer primero.
const ROW_ID = true;

/**
 * Ajustes del sitio: lo que se puede cambiar desde el panel sin redeploy.
 *
 * No muestra un toast si falla. Es la diferencia con los otros hooks: un error
 * acá no es algo que el visitante pueda accionar, y el sitio sigue funcionando
 * con los valores que trae el código. Avisarle que "no se pudo cargar la
 * configuración" a alguien que solo vino a ver el portfolio no aporta nada.
 *
 * Devuelve `refetch` porque el panel necesita recargar después de guardar.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        // maybeSingle y no single: si la fila todavía no existe, single lo trata
        // como error y no hay diferencia entre "está vacío" y "falló".
        .maybeSingle();

      if (error) throw error;
      setSettings(data || null);
    } catch (error) {
      console.error("Error fetching site settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, refetch: fetchSettings };
}

/**
 * Guarda los ajustes. Va por UPSERT y no por UPDATE para que funcione igual
 * aunque la fila no exista, sin tener que ramificar entre insertar y actualizar.
 */
export async function saveSiteSettings(values) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: ROW_ID, ...values });

  if (error) throw error;
}

export default useSiteSettings;
