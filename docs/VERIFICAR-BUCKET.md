# 🔍 VERIFICACIÓN DE BUCKET DE SUPABASE

Ejecuta estas consultas en el **SQL Editor** de Supabase para verificar que el bucket `evidence-files` esté correctamente configurado:

```sql
-- 1. Verificar que el bucket existe y es público
SELECT
  id,
  name,
  public,
  created_at,
  updated_at
FROM storage.buckets
WHERE name = 'evidence-files';

-- 2. Verificar políticas RLS del bucket
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';

-- 3. Contar archivos en el bucket
SELECT
  COUNT(*) as total_archivos,
  SUM(CASE WHEN RIGHT(name, 4) IN ('.jpg', '.png', '.gif', '.webp') THEN 1 ELSE 0 END) as imagenes,
  SUM(CASE WHEN RIGHT(name, 4) = '.pdf' THEN 1 ELSE 0 END) as pdfs
FROM storage.objects
WHERE bucket_id = 'evidence-files';

-- 4. Ver archivos recientes (últimos 10)
SELECT
  name,
  bucket_id,
  created_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'evidence-files'
ORDER BY created_at DESC
LIMIT 10;

-- 5. Verificar URLs de evidencia en student_attempts
SELECT
  id,
  student_name,
  evidence_url,
  created_at
FROM student_attempts
WHERE evidence_url IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

## ✅ **Resultados Esperados**

### Bucket Configuration:
```
name: evidence-files
public: true
```

### Políticas RLS:
- `cualquiera_suben_evidencia` (INSERT)
- `cualquiera_lee_evidencia` (SELECT)

### Archivos:
- Deberías ver los archivos que has subido
- Las URLs deberían ser válidas

## 🔧 **Si algo falla**

### Bucket no existe:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence-files', 'evidence-files', true);
```

### Políticas faltan:
Ejecuta el contenido de `FIX-BD-ERRORS.sql`

### URLs no funcionan:
1. Verifica que el bucket sea público
2. Revisa las políticas RLS
3. Comprueba que las URLs en `student_attempts` sean correctas

## 🌐 **Test de URL**

Para probar una URL específica, cópiala del resultado de la query #5 y pégala en el navegador. Debería abrir el archivo directamente.