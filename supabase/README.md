# Schema SQL para Proyectos

## Estructura de la tabla `projects`

Esta tabla almacena todos los proyectos (web y móviles) del portfolio.

### Campos principales:

- **id**: UUID único generado automáticamente
- **title**: Título del proyecto (español, obligatorio)
- **description**: Descripción detallada (español, obligatoria)
- **title_en** / **description_en**: traducción al inglés, opcional. Si está vacía, el front cae al español
- **image_url**: URL de la imagen de portada
- **project_type**: Tipo de proyecto (`web` o `mobile`)
- **is_featured**: Booleano para marcar proyectos destacados en la página principal
- **featured_size**: Tamaño en featured (`large` para el card grande, `small` para los 2 cards pequeños)
- **featured_order**: Orden de aparición (1, 2, 3) para los 3 proyectos destacados
- **technologies**: Array JSON con las tecnologías usadas
- **urls**: Array JSON con enlaces (GitHub, Live Demo, etc.)

### Cómo usar:

1. Abre tu proyecto de Supabase en https://supabase.com
2. Ve a "SQL Editor"
3. Crea una nueva query
4. Copia y pega el contenido de `supabase/schema.sql`
5. Ejecuta el script

### Ejemplo de datos JSON:

**technologies**:
```json
["React", "Tailwind CSS", "Node.js", "MongoDB"]
```

**urls**:
```json
[
  {"name": "GitHub", "url": "https://github.com/usuario/proyecto"},
  {"name": "Live Demo", "url": "https://ejemplo.com"}
]
```

### Consultas útiles:

**Obtener proyectos destacados (featured) ordenados:**
```sql
SELECT * FROM projects 
WHERE is_featured = TRUE 
ORDER BY featured_order ASC;
```

**Obtener solo proyectos web:**
```sql
SELECT * FROM projects 
WHERE project_type = 'web' 
ORDER BY created_at DESC;
```

**Obtener solo proyectos móviles:**
```sql
SELECT * FROM projects 
WHERE project_type = 'mobile' 
ORDER BY created_at DESC;
```

### Seguridad (RLS):

Las tres tablas (`projects`, `technologies`, `project_technologies`) tienen RLS habilitado:

- ✅ Lectura pública
- 🔒 Escritura solo para usuarios autenticados (admin)

Esto no es opcional: sin RLS, los roles `anon` y `authenticated` tienen `GRANT ALL` sobre
el schema `public` por defecto, y la anon key viaja en el bundle del front. Cualquier tabla
nueva en `public` necesita `ENABLE ROW LEVEL SECURITY` + sus policies.

### Probar sin tocar producción:

Hay un segundo proyecto Supabase, **Testing** (ref `urexozntscdkfiywxhyh`), con el
mismo schema y el mismo seed. Sirve para probar subidas de imágenes, reordenar la
galería y borrados sin ensuciar la base real.

1. Creá `.env.testing` en la raíz (está en `.gitignore`) con la URL y la anon key
   de ese proyecto.
2. Levantá con `npm run dev:testing`. Vite carga `.env` y después `.env.testing`
   encima, así que las variables de producción quedan pisadas solo en ese modo.
3. El usuario admin hay que crearlo a mano desde el panel de Supabase
   (Authentication → Add user): no se puede crear por SQL sin manipular el
   hasheo de contraseñas.

Ese proyecto tiene además tablas de un experimento anterior (`categories`,
`portfolio_images`) que no se tocan; conviven con las del portfolio.

Se auto-pausa por inactividad, igual que producción. Si al levantarlo da
`the database system is not accepting connections`, hay que esperar un par de
minutos a que termine de restaurar.

### Storage:

Bucket `project-images`, público, límite de 15MB (el front valida además tipo de imagen y
5MB antes de subir). Policies: lectura pública, escritura/borrado solo autenticados.
