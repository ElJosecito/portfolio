-- Reordenar toca dos filas. Con dos UPDATE sueltos desde el cliente, si el
-- segundo falla quedan dos experiencias compartiendo sort_order y el orden se
-- vuelve impredecible. Un upsert tampoco sirve: es un INSERT con ON CONFLICT y
-- exigiría mandar title, company y description, que son NOT NULL.
CREATE OR REPLACE FUNCTION public.swap_experience_order(a_id UUID, b_id UUID)
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

-- SECURITY INVOKER ya hace que las policies apliquen al que llama, pero además
-- se le saca el permiso de ejecución a anon.
REVOKE ALL ON FUNCTION public.swap_experience_order(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.swap_experience_order(UUID, UUID) TO authenticated;
