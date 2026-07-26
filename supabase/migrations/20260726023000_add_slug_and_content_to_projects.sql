-- slug para URLs compartibles (/projects/gestipol en vez de un UUID) y
-- content/content_en para el texto largo del caso de estudio, en markdown.
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS content_en TEXT;

-- Backfill desde el título antes de exigir NOT NULL. Los cinco títulos
-- existentes son ASCII, así que no hace falta desacentuar.
UPDATE public.projects
SET slug = TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(title), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Único: es la clave por la que se busca el proyecto desde la URL.
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

ALTER TABLE public.projects ALTER COLUMN slug SET NOT NULL;

COMMENT ON COLUMN public.projects.slug IS 'Identificador para la URL /projects/:slug. Único.';
COMMENT ON COLUMN public.projects.content IS 'Texto largo del proyecto en markdown (español)';
COMMENT ON COLUMN public.projects.content_en IS 'Texto largo en inglés; si está vacío el front cae al español';
