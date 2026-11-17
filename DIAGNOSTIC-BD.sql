# 🔍 SCRIPT PARA DIAGNOSTICAR LA BD

Ejecuta este script en el **SQL Editor** de Supabase para ver el estado actual:

```sql
-- 1. Ver todas las políticas RLS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('student_attempts', 'objects')
ORDER BY tablename, policyname;

-- 2. Ver estructura de student_attempts
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'student_attempts'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Ver si RLS está habilitado
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('student_attempts')
AND schemaname = 'public';

-- 4. Ver buckets de storage
SELECT
  id,
  name,
  public,
  created_at
FROM storage.buckets;

-- 5. Contar archivos en evidence-files
SELECT COUNT(*) as archivos_en_evidencia
FROM storage.objects
WHERE bucket_id = 'evidence-files';

-- 6. Ver algunos intentos recientes
SELECT
  id,
  exercise_id,
  student_id,
  student_name,
  evidence_url,
  created_at
FROM student_attempts
ORDER BY created_at DESC
LIMIT 5;
```

**Resultado esperado:**
- Políticas RLS activas para ambos
- Tabla student_attempts con evidence_url
- Bucket evidence-files público
- RLS habilitado en student_attempts