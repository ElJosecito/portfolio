import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";

/**
 * Galería de un proyecto, ordenada por `sort_order`.
 *
 * Devuelve `refetch` porque el panel recarga después de subir, borrar o
 * reordenar.
 */
export function useProjectImages(projectId) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    if (!projectId) {
      setImages([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching project images:", error);
      toast.error("Error al cargar la galería");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loading, refetch: fetchImages };
}

/**
 * Persiste el orden completo de la galería.
 *
 * Va por una función de Postgres: reordenar reescribe el `sort_order` de todas
 * las imágenes del proyecto, y si eso se hiciera con updates sueltos, un fallo
 * a mitad dejaría la galería en un orden que no eligió nadie.
 */
export async function saveImageOrder(projectId, orderedIds) {
  const { error } = await supabase.rpc("set_project_image_order", {
    p_project_id: projectId,
    p_ids: orderedIds,
  });

  if (error) throw error;
}

export default useProjectImages;
