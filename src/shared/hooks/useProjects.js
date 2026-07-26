import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";

const PROJECT_SELECT = `
  *,
  project_technologies (
    technologies (
      name,
      icon_url,
      class_name
    )
  )
`;

function formatProject(project) {
  const technologies =
    project.project_technologies?.filter((pt) => pt?.technologies) || [];

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    title_en: project.title_en,
    description: project.description,
    description_en: project.description_en,
    content: project.content,
    content_en: project.content_en,
    image: project.image_url,
    urls: project.urls || [],
    size: project.featured_size,
    platforms: project.platforms || [],
    techIcons: technologies.map((pt) => ({
      name: pt.technologies.name,
      icon: pt.technologies.icon_url,
      className: pt.technologies.class_name,
    })),
  };
}

/**
 * Trae los proyectos desde Supabase con sus tecnologías.
 * @param {{featuredOnly?: boolean}} options - featuredOnly limita a los destacados,
 * ordenados por featured_order (el resto va por fecha de creación).
 */
export function useProjects({ featuredOnly = false } = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchProjects = async () => {
      try {
        const base = supabase.from("projects").select(PROJECT_SELECT);
        const query = featuredOnly
          ? base.eq("is_featured", true).order("featured_order", { ascending: true })
          : base.order("created_at", { ascending: false });

        const { data, error } = await query;
        if (error) throw error;
        if (!active) return;

        setProjects((data || []).map(formatProject));
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (active) toast.error("Error al cargar proyectos");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      active = false;
    };
  }, [featuredOnly]);

  return { projects, loading };
}

/**
 * Trae un proyecto por su slug para la página de detalle.
 *
 * `notFound` se distingue de `loading` a propósito: sin eso, un slug inventado
 * se vería igual que uno que todavía está cargando.
 */
export function useProject(slug) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchProject = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const { data, error } = await supabase
          .from("projects")
          .select(PROJECT_SELECT)
          .eq("slug", slug)
          // maybeSingle en vez de single: si no hay fila, single lo trata como
          // error y se pierde la diferencia entre "no existe" y "falló".
          .maybeSingle();

        if (error) throw error;
        if (!active) return;

        if (!data) {
          setNotFound(true);
          setProject(null);
          return;
        }

        setProject(formatProject(data));
      } catch (error) {
        console.error("Error fetching project:", error);
        if (active) toast.error("Error al cargar el proyecto");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (slug) fetchProject();

    return () => {
      active = false;
    };
  }, [slug]);

  return { project, loading, notFound };
}

export default useProjects;
