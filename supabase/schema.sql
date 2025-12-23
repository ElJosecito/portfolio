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
  project_type VARCHAR(20) NOT NULL CHECK (project_type IN ('web', 'mobile')),
  is_featured BOOLEAN DEFAULT FALSE,
  featured_size VARCHAR(20) CHECK (featured_size IN ('large', 'small', NULL)),
  featured_order INTEGER,
  urls JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
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
COMMENT ON COLUMN projects.project_type IS 'Tipo de proyecto: web o mobile';
COMMENT ON COLUMN projects.is_featured IS 'Si el proyecto aparece en la página principal';
COMMENT ON COLUMN projects.featured_size IS 'Tamaño en featured: large (1 card grande) o small (2 cards pequeños)';
COMMENT ON COLUMN projects.featured_order IS 'Orden de aparición en featured (1, 2, 3)';
COMMENT ON COLUMN projects.urls IS 'Array JSON de URLs: [{"name": "GitHub", "url": "..."}, {"name": "Live Demo", "url": "..."}]';

COMMENT ON TABLE project_technologies IS 'Tabla intermedia para relacionar proyectos con tecnologías (many-to-many)';
COMMENT ON COLUMN project_technologies.project_id IS 'ID del proyecto';
COMMENT ON COLUMN project_technologies.technology_id IS 'ID de la tecnología';

-- Índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_technologies_name ON technologies(name);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_projects_featured_order ON projects(featured_order) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_project_technologies_project ON project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_technologies_technology ON project_technologies(technology_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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

-- Insertar proyectos reales
INSERT INTO projects (title, description, image_url, project_type, is_featured, featured_size, featured_order, urls)
VALUES 
(
  'Gestipol',
  'Gestipol es una aplicación que permite a los candidatos políticos gestionar el estado de sus votantes para tener una información más clara sobre el proceso durante la campaña.',
  'https://i.imgur.com/Y1WgyYI.png',
  'web',
  TRUE,
  'large',
  1,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/crm-frontend"}, {"name": "En Vivo", "url": "https://gestipol.onrender.com/home"}]'::jsonb
),
(
  'Bank Landing Page',
  'Esta es una landing page de un banco ficticio, la cual fue creada con el fin de practicar y mejorar mis habilidades en el desarrollo web. La página es completamente responsive y fue inspirada en un diseño de frontend mentor.',
  'https://i.imgur.com/LbmEbD2.png',
  'web',
  TRUE,
  'small',
  2,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/bank-Landing"}, {"name": "En Vivo", "url": "https://vermillion-kashata-e30b59.netlify.app/"}]'::jsonb
),
(
  'Dental Clinic Web',
  'Dental Clinic Web es una landing page que permite al cliente tener mas informacion sobre la clinica dental que visitara y de sus doctores. La web fue desarrollada con el fin de brindar informacion de manera comoda y facil. Inspirada en un diseño personal.',
  'https://imgur.com/u6wEWGK.png',
  'web',
  TRUE,
  'small',
  3,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/vdc-web"}, {"name": "En Vivo", "url": "https://vdc-web.netlify.app/"}]'::jsonb
),
(
  'Multisemar Web',
  'Multisemar Web es una landing page que permite al cliente tener mas informacion sobre la empresa y sus servicios. La web fue desarrollada con el fin de brindar informacion de manera comoda y facil. Inspirada en un diseño personal.',
  'https://imgur.com/jEVndxk.png',
  'web',
  FALSE,
  NULL,
  NULL,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/multisemar-web"}, {"name": "En Vivo", "url": "https://landingmultisemar.netlify.app/"}]'::jsonb
),
(
  'Flags App',
  'Flags App es una aplicación web que permite a los usuarios buscar y ver información sobre los países del mundo. La aplicación fue creada con el fin de practicar y mejorar mis habilidades en el desarrollo web. Inspirada en un diseño de frontend mentor.',
  'https://i.imgur.com/clPtB70.png',
  'web',
  FALSE,
  NULL,
  NULL,
  '[{"name": "Github", "url": "https://github.com/ElJosecito/country-app"}, {"name": "En Vivo", "url": "https://guileless-daffodil-25c071.netlify.app/"}]'::jsonb
)
RETURNING id;

-- Vincular tecnologías a proyectos
-- Gestipol: React, Node.js, Tailwind CSS, MongoDB
INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id 
FROM projects p, technologies t
WHERE p.title = 'Gestipol' 
AND t.name IN ('React', 'Node.js', 'Tailwind CSS', 'MongoDB');

-- Bank Landing Page: React, Tailwind CSS, SASS, Vite
INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id 
FROM projects p, technologies t
WHERE p.title = 'Bank Landing Page' 
AND t.name IN ('React', 'Tailwind CSS', 'SASS', 'Vite');

-- Dental Clinic Web: React, Tailwind CSS, Vite
INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id 
FROM projects p, technologies t
WHERE p.title = 'Dental Clinic Web' 
AND t.name IN ('React', 'Tailwind CSS', 'Vite');

-- Multisemar Web: React, Tailwind CSS, Next.js
INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id 
FROM projects p, technologies t
WHERE p.title = 'Multisemar Web' 
AND t.name IN ('React', 'Tailwind CSS', 'Next.js');

-- Flags App: React, Tailwind CSS, SASS, Vite
INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id 
FROM projects p, technologies t
WHERE p.title = 'Flags App' 
AND t.name IN ('React', 'Tailwind CSS', 'SASS', 'Vite');

-- Habilitar Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Todos pueden leer proyectos
CREATE POLICY "Proyectos públicos para lectura"
ON projects FOR SELECT
TO public
USING (true);

-- Policy: Solo usuarios autenticados pueden insertar
CREATE POLICY "Solo autenticados pueden crear proyectos"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Solo usuarios autenticados pueden actualizar
CREATE POLICY "Solo autenticados pueden actualizar proyectos"
ON projects FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Solo usuarios autenticados pueden eliminar
CREATE POLICY "Solo autenticados pueden eliminar proyectos"
ON projects FOR DELETE
TO authenticated
USING (true);
