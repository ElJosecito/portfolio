-- El front ya lee y escribe `platforms`. La columna vieja se va ahora y no
-- antes para que el backfill quedara verificado con las dos conviviendo.
-- El índice idx_projects_type y el CHECK de project_type caen con ella.
ALTER TABLE public.projects DROP COLUMN IF EXISTS project_type;
