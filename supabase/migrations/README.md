# Migraciones

Historial de cambios de schema. Un archivo por migración, nombrado
`<version>_<nombre>.sql`, donde `version` es un timestamp UTC `YYYYMMDDHHMMSS`.

Antes de esto todo se aplicaba a mano desde el SQL Editor, sin registro. El
resultado fue que `schema.sql` quedó desincronizado de la base real: le faltaban
las columnas `title_en`/`description_en` y las policies del bucket de Storage,
que habían sido aplicadas directo en producción sin dejar rastro.

## Reglas

1. **Todo cambio de schema es una migración.** Nada de DDL suelto en el SQL Editor.
2. **RLS en la misma migración que crea la tabla**, no después. Sin RLS, los roles
   `anon` y `authenticated` heredan `GRANT ALL` sobre el schema `public`, y la
   anon key viaja en el bundle del front. Una tabla nueva sin policies es una
   tabla que cualquiera puede escribir.
3. **`schema.sql` se actualiza en el mismo commit.** Es el estado consolidado y
   sirve para levantar la base desde cero; las migraciones son el historial.
4. **Las migraciones no se editan una vez aplicadas.** Para corregir algo, va una
   migración nueva.

## Aplicar

Con el MCP de Supabase (`apply_migration`), que además la registra en
`supabase_migrations.schema_migrations`. Después se copia el SQL a un archivo acá
con el `version` que devolvió.

Para ver qué está aplicado en la base:

```sql
select version, name from supabase_migrations.schema_migrations order by version;
```
