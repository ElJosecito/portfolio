-- Schema completo del portfolio, sincronizado con la base de datos real.
-- Es idempotente: se puede volver a correr sobre una base existente sin duplicar datos.

-- =============================================================================
-- TABLAS
-- =============================================================================

-- Tabla de tecnologías
CREATE TABLE IF NOT EXISTS technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon_url TEXT NOT NULL,
  class_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  -- Array y no un enum excluyente: un proyecto puede ser web y mobile a la vez.
  platforms TEXT[] NOT NULL DEFAULT '{web}',
  is_featured BOOLEAN DEFAULT FALSE,
  featured_size VARCHAR(20) CHECK (featured_size IN ('large', 'small', NULL)),
  featured_order INTEGER,
  urls JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Traducciones al inglés (el contenido base va en español)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Detalle: slug para la URL y texto largo en markdown
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content_en TEXT;

UPDATE projects
SET slug = TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER(title), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
ALTER TABLE projects ALTER COLUMN slug SET NOT NULL;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_platforms_valid;
ALTER TABLE projects ADD CONSTRAINT projects_platforms_valid CHECK (
  platforms <@ ARRAY['web', 'mobile']::text[]
  AND COALESCE(array_length(platforms, 1), 0) >= 1
);

-- Experiencia laboral. Las fechas son DATE y no texto: el front las formatea en
-- cada idioma, en vez de mantener un date_label y un date_label_en a mano.
-- end_date NULL significa "sigue en curso" — una sola fuente de verdad, en vez
-- de un is_current que puede contradecir a la fecha.
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_en TEXT,
  company VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT,
  link TEXT,
  start_date DATE,
  end_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT experiences_dates_ordered CHECK (
    end_date IS NULL OR start_date IS NULL OR end_date >= start_date
  )
);

-- Galería de cada proyecto. width y height se guardan porque el masonry los
-- necesita para reservar el hueco de cada imagen antes de que cargue; sin eso
-- la galería se reacomoda a saltos.
CREATE TABLE IF NOT EXISTS project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  caption TEXT,
  caption_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT project_images_dimensions_positive CHECK (width > 0 AND height > 0)
);

-- Tabla intermedia para la relación many-to-many entre proyectos y tecnologías
CREATE TABLE IF NOT EXISTS project_technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(project_id, technology_id)
);

-- Comentarios para documentar la estructura
COMMENT ON TABLE technologies IS 'Tabla para almacenar las tecnologías disponibles';
COMMENT ON COLUMN technologies.name IS 'Nombre de la tecnología (ej: React, Node.js)';
COMMENT ON COLUMN technologies.icon_url IS 'URL del icono de la tecnología';
COMMENT ON COLUMN technologies.class_name IS 'Clases CSS opcionales para el icono (ej: dark:invert)';

COMMENT ON TABLE projects IS 'Tabla para almacenar proyectos web y móviles';
COMMENT ON COLUMN projects.platforms IS 'Plataformas del proyecto: {web}, {mobile} o {web,mobile}. Reemplaza a project_type.';
COMMENT ON COLUMN projects.is_featured IS 'Si el proyecto aparece en la página principal';
COMMENT ON COLUMN projects.featured_size IS 'Tamaño en featured: large (1 card grande) o small (2 cards pequeños)';
COMMENT ON COLUMN projects.featured_order IS 'Orden de aparición en featured (1, 2, 3)';
COMMENT ON COLUMN projects.urls IS 'Array JSON de URLs: [{"name": "GitHub", "url": "..."}, {"name": "Live Demo", "url": "..."}]';
COMMENT ON COLUMN projects.slug IS 'Identificador para la URL /projects/:slug. Único.';
COMMENT ON COLUMN projects.content IS 'Texto largo del proyecto en markdown (español)';
COMMENT ON COLUMN projects.content_en IS 'Texto largo en inglés; si está vacío el front cae al español';
COMMENT ON COLUMN projects.title_en IS 'Título en inglés; si está vacío el front cae al título en español';
COMMENT ON COLUMN projects.description_en IS 'Descripción en inglés; si está vacía el front cae a la descripción en español';

COMMENT ON TABLE experiences IS 'Experiencia laboral mostrada en la portada';
COMMENT ON COLUMN experiences.end_date IS 'NULL significa que el puesto sigue en curso';
COMMENT ON COLUMN experiences.sort_order IS 'Orden manual de aparición; menor va primero';

COMMENT ON TABLE project_images IS 'Galería de imágenes de cada proyecto';
COMMENT ON COLUMN project_images.width IS 'Ancho en píxeles; lo necesita el masonry para reservar espacio';
COMMENT ON COLUMN project_images.height IS 'Alto en píxeles; lo necesita el masonry para reservar espacio';
COMMENT ON COLUMN project_images.storage_path IS 'Ruta en el bucket project-images, para poder borrar el archivo';

COMMENT ON TABLE project_technologies IS 'Tabla intermedia para relacionar proyectos con tecnologías (many-to-many)';
COMMENT ON COLUMN project_technologies.project_id IS 'ID del proyecto';
COMMENT ON COLUMN project_technologies.technology_id IS 'ID de la tecnología';

-- Índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_technologies_name ON technologies(name);
CREATE INDEX IF NOT EXISTS idx_projects_platforms ON projects USING GIN (platforms);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_projects_featured_order ON projects(featured_order) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_experiences_sort_order ON experiences(sort_order);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_technologies_project ON project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_technologies_technology ON project_technologies(technology_id);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- search_path fijo para que la función no dependa del search_path de quien la llama
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
CREATE TRIGGER update_experiences_updated_at
BEFORE UPDATE ON experiences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Reordenar experiencias toca dos filas. Con dos UPDATE sueltos desde el
-- cliente, si el segundo falla quedan dos compartiendo sort_order.
CREATE OR REPLACE FUNCTION swap_experience_order(a_id UUID, b_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  a_order INTEGER;
  b_order INTEGER;
BEGIN
  SELECT sort_order INTO a_order FROM public.experiences WHERE id = a_id;
  SELECT sort_order INTO b_order FROM public.experiences WHERE id = b_id;

  IF a_order IS NULL OR b_order IS NULL THEN
    RAISE EXCEPTION 'Experiencia no encontrada';
  END IF;

  UPDATE public.experiences SET sort_order = b_order WHERE id = a_id;
  UPDATE public.experiences SET sort_order = a_order WHERE id = b_id;
END;
$$;

REVOKE ALL ON FUNCTION swap_experience_order(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION swap_experience_order(UUID, UUID) TO authenticated;

-- Reordenar la galería reescribe el orden de todas las imágenes del proyecto,
-- así que también va en una transacción.
CREATE OR REPLACE FUNCTION set_project_image_order(p_project_id UUID, p_ids UUID[])
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

REVOKE ALL ON FUNCTION set_project_image_order(UUID, UUID[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION set_project_image_order(UUID, UUID[]) TO authenticated;

-- =============================================================================
-- SEED
-- =============================================================================

-- Insertar tecnologías desde DevTools
INSERT INTO technologies (name, icon_url, class_name) VALUES
('HTML5', 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg', NULL),
('CSS3', 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg', NULL),
('JavaScript', 'https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg', NULL),
('TypeScript', 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg', NULL),
('SASS', 'https://www.svgrepo.com/show/374061/sass.svg', NULL),
('React', 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', NULL),
('Next.js', 'https://www.svgrepo.com/show/354113/nextjs-icon.svg', 'dark:invert opacity-70'),
('Vite', 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg', NULL),
('Tailwind CSS', 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg', NULL),
('Node.js', 'https://www.svgrepo.com/show/355140/node.svg', NULL),
('MongoDB', 'https://www.svgrepo.com/show/331488/mongodb.svg', NULL),
('MySQL', 'https://www.svgrepo.com/show/306453/mysql.svg', 'dark:invert opacity-70'),
('Supabase', 'https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg', NULL)
ON CONFLICT (name) DO NOTHING;

-- Insertar proyectos reales (solo si la tabla está vacía, para no duplicar)
INSERT INTO projects (title, slug, description, image_url, platforms, is_featured, featured_size, featured_order, urls)
SELECT * FROM (VALUES
(
  'Gestipol',
  'gestipol',
  'Gestipol es una aplicación que permite a los candidatos políticos gestionar el estado de sus votantes para tener una información más clara sobre el proceso durante la campaña.',
  'https://i.imgur.com/Y1WgyYI.png',
  ARRAY['web']::text[],
  TRUE,
  'large',
  1,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/crm-frontend"}, {"name": "En Vivo", "url": "https://gestipol.onrender.com/home"}]'::jsonb
),
(
  'Bank Landing Page',
  'bank-landing-page',
  'Esta es una landing page de un banco ficticio, la cual fue creada con el fin de practicar y mejorar mis habilidades en el desarrollo web. La página es completamente responsive y fue inspirada en un diseño de frontend mentor.',
  'https://i.imgur.com/LbmEbD2.png',
  ARRAY['web']::text[],
  TRUE,
  'small',
  2,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/bank-Landing"}, {"name": "En Vivo", "url": "https://vermillion-kashata-e30b59.netlify.app/"}]'::jsonb
),
(
  'Dental Clinic Web',
  'dental-clinic-web',
  'Dental Clinic Web es una landing page que permite al cliente tener mas informacion sobre la clinica dental que visitara y de sus doctores. La web fue desarrollada con el fin de brindar informacion de manera comoda y facil. Inspirada en un diseño personal.',
  'https://imgur.com/u6wEWGK.png',
  ARRAY['web']::text[],
  TRUE,
  'small',
  3,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/vdc-web"}, {"name": "En Vivo", "url": "https://vdc-web.netlify.app/"}]'::jsonb
),
(
  'Multisemar Web',
  'multisemar-web',
  'Multisemar Web es una landing page que permite al cliente tener mas informacion sobre la empresa y sus servicios. La web fue desarrollada con el fin de brindar informacion de manera comoda y facil. Inspirada en un diseño personal.',
  'https://imgur.com/jEVndxk.png',
  ARRAY['web']::text[],
  FALSE,
  NULL,
  NULL,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/multisemar-web"}, {"name": "En Vivo", "url": "https://landingmultisemar.netlify.app/"}]'::jsonb
),
(
  'Flags App',
  'flags-app',
  'Flags App es una aplicación web que permite a los usuarios buscar y ver información sobre los países del mundo. La aplicación fue creada con el fin de practicar y mejorar mis habilidades en el desarrollo web. Inspirada en un diseño de frontend mentor.',
  'https://i.imgur.com/clPtB70.png',
  ARRAY['web']::text[],
  FALSE,
  NULL,
  NULL,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/country-app"}, {"name": "En Vivo", "url": "https://guileless-daffodil-25c071.netlify.app/"}]'::jsonb
)) AS seed(title, slug, description, image_url, platforms, is_featured, featured_size, featured_order, urls)
WHERE NOT EXISTS (SELECT 1 FROM projects);

-- Vincular tecnologías a proyectos
INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id
FROM projects p, technologies t
WHERE p.title = 'Gestipol'
AND t.name IN ('React', 'Node.js', 'Tailwind CSS', 'MongoDB')
ON CONFLICT (project_id, technology_id) DO NOTHING;

INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id
FROM projects p, technologies t
WHERE p.title = 'Bank Landing Page'
AND t.name IN ('React', 'Tailwind CSS', 'SASS', 'Vite')
ON CONFLICT (project_id, technology_id) DO NOTHING;

INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id
FROM projects p, technologies t
WHERE p.title = 'Dental Clinic Web'
AND t.name IN ('React', 'Tailwind CSS', 'Vite')
ON CONFLICT (project_id, technology_id) DO NOTHING;

INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id
FROM projects p, technologies t
WHERE p.title = 'Multisemar Web'
AND t.name IN ('React', 'Tailwind CSS', 'Next.js')
ON CONFLICT (project_id, technology_id) DO NOTHING;

INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id
FROM projects p, technologies t
WHERE p.title = 'Flags App'
AND t.name IN ('React', 'Tailwind CSS', 'SASS', 'Vite')
ON CONFLICT (project_id, technology_id) DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
-- Sin RLS, los roles anon/authenticated tienen GRANT ALL sobre el schema public,
-- así que cualquiera con la anon key (que va en el bundle del front) podría
-- escribir. Las tres tablas necesitan RLS, no solo projects.

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- projects
DROP POLICY IF EXISTS "Proyectos públicos para lectura" ON projects;
CREATE POLICY "Proyectos públicos para lectura"
ON projects FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden crear proyectos" ON projects;
CREATE POLICY "Solo autenticados pueden crear proyectos"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Solo autenticados pueden actualizar proyectos" ON projects;
CREATE POLICY "Solo autenticados pueden actualizar proyectos"
ON projects FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Solo autenticados pueden eliminar proyectos" ON projects;
CREATE POLICY "Solo autenticados pueden eliminar proyectos"
ON projects FOR DELETE
TO authenticated
USING (true);

-- technologies
DROP POLICY IF EXISTS "Tecnologias publicas para lectura" ON technologies;
CREATE POLICY "Tecnologias publicas para lectura"
ON technologies FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden escribir tecnologias" ON technologies;
CREATE POLICY "Solo autenticados pueden escribir tecnologias"
ON technologies FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- project_technologies
DROP POLICY IF EXISTS "Relaciones publicas para lectura" ON project_technologies;
CREATE POLICY "Relaciones publicas para lectura"
ON project_technologies FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden escribir relaciones" ON project_technologies;
CREATE POLICY "Solo autenticados pueden escribir relaciones"
ON project_technologies FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- experiences
DROP POLICY IF EXISTS "Experiencias publicas para lectura" ON experiences;
CREATE POLICY "Experiencias publicas para lectura"
ON experiences FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden escribir experiencias" ON experiences;
CREATE POLICY "Solo autenticados pueden escribir experiencias"
ON experiences FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- project_images
DROP POLICY IF EXISTS "Imagenes publicas para lectura" ON project_images;
CREATE POLICY "Imagenes publicas para lectura"
ON project_images FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden escribir imagenes" ON project_images;
CREATE POLICY "Solo autenticados pueden escribir imagenes"
ON project_images FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =============================================================================
-- STORAGE
-- =============================================================================
-- Bucket público de imágenes de proyectos (límite 15MB; el front además valida
-- tipo y un máximo de 5MB antes de subir).

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('project-images', 'project-images', TRUE, 15728640)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');
