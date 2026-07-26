-- project_type era un CHECK excluyente ('web' | 'mobile') y no soportaba
-- proyectos que son las dos cosas. platforms es un array: un proyecto puede
-- vivir en varias plataformas y agregar una nueva no rompe los filtros.
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS platforms TEXT[] NOT NULL DEFAULT '{web}';

-- Backfill desde la columna vieja antes de que nadie escriba en la nueva.
UPDATE public.projects
SET platforms = ARRAY[project_type]::text[]
WHERE project_type IS NOT NULL;

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_platforms_valid;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_platforms_valid CHECK (
    platforms <@ ARRAY['web', 'mobile']::text[]
    AND COALESCE(array_length(platforms, 1), 0) >= 1
  );

COMMENT ON COLUMN public.projects.platforms IS
  'Plataformas del proyecto: {web}, {mobile} o {web,mobile}. Reemplaza a project_type.';

-- Filtrar por plataforma es una operación de contención sobre el array.
CREATE INDEX IF NOT EXISTS idx_projects_platforms ON public.projects USING GIN (platforms);
