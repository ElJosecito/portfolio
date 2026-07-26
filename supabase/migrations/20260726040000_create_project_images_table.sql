CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  -- Ruta dentro del bucket. Se guarda aparte de la URL para poder borrar el
  -- archivo sin tener que adivinarla parseando la URL pública.
  storage_path TEXT,
  -- Dimensiones reales, leídas del archivo al subirlo. Sin esto el masonry no
  -- puede reservar el alto de cada hueco y la galería salta entera mientras
  -- cargan las imágenes.
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  caption TEXT,
  caption_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT project_images_dimensions_positive CHECK (width > 0 AND height > 0)
);

COMMENT ON TABLE public.project_images IS 'Galería de imágenes de cada proyecto';
COMMENT ON COLUMN public.project_images.width IS 'Ancho en píxeles; lo necesita el masonry para reservar espacio';
COMMENT ON COLUMN public.project_images.height IS 'Alto en píxeles; lo necesita el masonry para reservar espacio';
COMMENT ON COLUMN public.project_images.storage_path IS 'Ruta en el bucket project-images, para poder borrar el archivo';

CREATE INDEX IF NOT EXISTS idx_project_images_project
  ON public.project_images(project_id, sort_order);

ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Imagenes publicas para lectura" ON public.project_images;
CREATE POLICY "Imagenes publicas para lectura"
ON public.project_images FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden escribir imagenes" ON public.project_images;
CREATE POLICY "Solo autenticados pueden escribir imagenes"
ON public.project_images FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Reordenar la galería reescribe el orden de todas las imágenes del proyecto.
-- Va en una función para que ocurra en una transacción: con updates sueltos,
-- un fallo a mitad deja la galería en un orden que no eligió nadie.
CREATE OR REPLACE FUNCTION public.set_project_image_order(p_project_id UUID, p_ids UUID[])
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.project_images AS pi
  SET sort_order = ordered.position - 1
  FROM (
    SELECT UNNEST(p_ids) AS id, GENERATE_SUBSCRIPTS(p_ids, 1) AS position
  ) AS ordered
  WHERE pi.id = ordered.id
    AND pi.project_id = p_project_id;
END;
$$;

REVOKE ALL ON FUNCTION public.set_project_image_order(UUID, UUID[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_project_image_order(UUID, UUID[]) TO authenticated;
