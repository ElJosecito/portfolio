CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_en TEXT,
  company VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT,
  link TEXT,
  -- Fechas reales en vez del texto libre que había en los archivos de idioma:
  -- así el front las formatea solo en cada idioma y no hay que mantener un
  -- date_label y un date_label_en a mano.
  --
  -- start_date admite NULL porque de los puestos actuales no se sabe la fecha
  -- de inicio; se completan desde el panel. end_date NULL significa "en curso",
  -- que es una sola fuente de verdad en vez de un is_current que puede
  -- contradecir a la fecha.
  start_date DATE,
  end_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT experiences_dates_ordered CHECK (
    end_date IS NULL OR start_date IS NULL OR end_date >= start_date
  )
);

COMMENT ON TABLE public.experiences IS 'Experiencia laboral mostrada en la portada';
COMMENT ON COLUMN public.experiences.end_date IS 'NULL significa que el puesto sigue en curso';
COMMENT ON COLUMN public.experiences.sort_order IS 'Orden manual de aparición; menor va primero';

CREATE INDEX IF NOT EXISTS idx_experiences_sort_order ON public.experiences(sort_order);

DROP TRIGGER IF EXISTS update_experiences_updated_at ON public.experiences;
CREATE TRIGGER update_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS en la misma migración que crea la tabla: sin esto, anon hereda GRANT ALL
-- sobre el schema public y la anon key viaja en el bundle.
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Experiencias publicas para lectura" ON public.experiences;
CREATE POLICY "Experiencias publicas para lectura"
ON public.experiences FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Solo autenticados pueden escribir experiencias" ON public.experiences;
CREATE POLICY "Solo autenticados pueden escribir experiencias"
ON public.experiences FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed con lo que había en los archivos de idioma, respetando el orden actual.
-- Las fechas de los puestos en curso quedan en NULL a propósito: el texto decía
-- "Actualmente..." y no hay dato de inicio que copiar sin inventarlo.
INSERT INTO public.experiences
  (title, title_en, company, description, description_en, link, start_date, end_date, sort_order)
SELECT * FROM (VALUES
(
  'Freelancer',
  'Freelancer',
  'Freelancer',
  'Como desarrollador freelance, he entregado con éxito aplicaciones personalizadas a varios clientes, asegurando que sus necesidades específicas fueran satisfechas, desde la creación de sitios web hasta la implementación de aplicaciones web completas. He trabajado en estrecha colaboración con los clientes para garantizar que sus objetivos se cumplan y que sus expectativas se superen. Mi enfoque en la calidad y la satisfacción del cliente ha resultado en una alta tasa de retención y recomendación.',
  'As a freelance developer, I have successfully delivered custom applications to several clients, making sure their specific needs were met — from building websites to shipping complete web applications. I work closely with clients so their goals are met and their expectations exceeded. My focus on quality and client satisfaction has resulted in a high retention and referral rate.',
  'https://www.linkedin.com/in/jose-martinez-dev/',
  NULL::date,
  NULL::date,
  0
),
(
  'Analista de datos Junior',
  'Junior Data Analyst',
  'La Romana, DO',
  'En mi rol como especialista en entrada de datos, ingresé meticulosamente la información individual en una base de datos centralizada para facilitar la comunicación del equipo de marketing. Asegurar la precisión en los datos sensibles, mientras prevenía duplicados, fue primordial. Colaborando estrechamente con el equipo de marketing, mantuve información actualizada para apoyar sus estrategias, cumpliendo con altos estándares de calidad y cumpliendo plazos consistentemente.',
  'In my role as a data entry specialist, I meticulously entered individual records into a centralized database to support the marketing team''s communication. Accuracy on sensitive data, while preventing duplicates, was paramount. Working closely with the marketing team, I kept information current to support their strategies, meeting high quality standards and consistently hitting deadlines.',
  NULL,
  DATE '2024-03-01',
  DATE '2024-09-30',
  1
),
(
  'Fullstack Developer',
  'Fullstack Developer',
  'JGI Solutions and Marketing',
  'Como Desarrollador Fullstack en JGI and Marketing Solutions, trabajo de cerca con los equipos de frontend y backend para asegurar el rendimiento óptimo de los tickets de los proyectos actuales. En este entorno dinámico, contribuyo activamente al diseño y desarrollo de aplicaciones web.',
  'As a Fullstack Developer at JGI Solutions and Marketing, I work closely with the frontend and backend teams to keep current project tickets performing well. In this fast-moving environment, I actively contribute to the design and development of web applications.',
  NULL,
  NULL::date,
  NULL::date,
  2
)) AS seed(title, title_en, company, description, description_en, link, start_date, end_date, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.experiences);
