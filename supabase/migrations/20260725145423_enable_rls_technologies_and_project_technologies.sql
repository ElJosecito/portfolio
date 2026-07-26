-- Habilitar RLS en las tablas que quedaron expuestas al rol anon
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;

-- technologies: lectura pública, escritura solo autenticados
DROP POLICY IF EXISTS "Tecnologias publicas para lectura" ON public.technologies;
CREATE POLICY "Tecnologias publicas para lectura"
ON public.technologies FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden escribir tecnologias" ON public.technologies;
CREATE POLICY "Solo autenticados pueden escribir tecnologias"
ON public.technologies FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- project_technologies: lectura pública, escritura solo autenticados
DROP POLICY IF EXISTS "Relaciones publicas para lectura" ON public.project_technologies;
CREATE POLICY "Relaciones publicas para lectura"
ON public.project_technologies FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden escribir relaciones" ON public.project_technologies;
CREATE POLICY "Solo autenticados pueden escribir relaciones"
ON public.project_technologies FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Fijar search_path de la funcion del trigger (advisor 0011)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$;
