# Schema SQL para Proyectos

## Estructura de la tabla `projects`

Esta tabla almacena todos los proyectos (web y móviles) del portfolio.

### Campos principales:

- **id**: UUID único generado automáticamente
- **title**: Título del proyecto
- **description**: Descripción detallada
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

- ✅ Lectura pública (cualquiera puede ver proyectos)
- 🔒 Escritura solo para usuarios autenticados (admin)
