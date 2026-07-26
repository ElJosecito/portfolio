-- Ajustes del sitio que hoy viven como archivos importados en el código y que
-- el panel tiene que poder cambiar sin un redeploy.
--
-- La tabla es de una sola fila. `id BOOLEAN PRIMARY KEY DEFAULT TRUE` con el
-- CHECK que lo obliga a ser TRUE hace que una segunda inserción choque contra
-- la clave primaria: no hay forma de terminar con dos filas de configuración
-- discutiendo cuál es la buena. Y al ser una clave conocida, el panel puede
-- hacer UPSERT sin leer primero.
CREATE TABLE IF NOT EXISTS public.site_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  -- URL pública de la foto de la card principal del Hero. NULL significa "usá
  -- la que viene con el código", así el sitio nunca queda sin foto.
  hero_image_url TEXT,
  -- Ruta dentro del bucket, guardada aparte de la URL para poder borrar el
  -- archivo anterior sin tener que adivinarla parseando la URL pública. Mismo
  -- criterio que project_images.storage_path.
  hero_image_path TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT site_settings_single_row CHECK (id)
);

COMMENT ON TABLE public.site_settings IS 'Configuración del sitio. Siempre una sola fila.';
COMMENT ON COLUMN public.site_settings.hero_image_url IS 'Foto de la card principal del Hero. NULL usa la imagen incluida en el bundle.';
COMMENT ON COLUMN public.site_settings.hero_image_path IS 'Ruta en el bucket project-images, para poder borrar el archivo reemplazado';

-- La fila existe desde el principio y con las columnas en NULL, así el panel
-- siempre tiene algo que actualizar y el front siempre tiene algo que leer.
INSERT INTO public.site_settings (id)
VALUES (TRUE)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ajustes publicos para lectura" ON public.site_settings;
CREATE POLICY "Ajustes publicos para lectura"
ON public.site_settings FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden escribir ajustes" ON public.site_settings;
CREATE POLICY "Solo autenticados pueden escribir ajustes"
ON public.site_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
