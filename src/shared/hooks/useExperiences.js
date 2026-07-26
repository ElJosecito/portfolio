import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";

/**
 * Trae la experiencia laboral ordenada por `sort_order`, que es el orden manual
 * que se define desde el panel.
 *
 * Devuelve `refetch` porque el admin necesita recargar después de crear,
 * editar, borrar o reordenar.
 */
export function useExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExperiences = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error("Error al cargar la experiencia");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return { experiences, loading, refetch: fetchExperiences };
}

/**
 * Intercambia el `sort_order` de dos experiencias.
 *
 * Va por una función de Postgres y no por dos updates desde el cliente: los dos
 * cambios tienen que ocurrir en la misma transacción o la lista puede quedar
 * con dos filas compartiendo posición.
 */
export async function swapExperienceOrder(a, b) {
  const { error } = await supabase.rpc("swap_experience_order", {
    a_id: a.id,
    b_id: b.id,
  });

  if (error) throw error;
}

export default useExperiences;
