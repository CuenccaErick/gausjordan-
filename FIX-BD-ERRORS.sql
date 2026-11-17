# 🔧 SCRIPT SQL PARA ARREGLAR LOS ERRORES DE BD

Ejecuta estos comandos en el **SQL Editor** de tu proyecto Supabase (https://supabase.com/dashboard/project/TU_PROJECT_ID/sql)

---

## 🚨 PASO 1: MODIFICAR POLÍTICAS RLS PARA STORAGE

### 1.1 Eliminar políticas existentes que causan problemas

```sql
-- Eliminar políticas problemáticas
DROP POLICY IF EXISTS "estudiantes_suben_evidencia" ON storage.objects;
DROP POLICY IF EXISTS "usuarios_leen_evidencia" ON storage.objects;
```

### 1.2 Crear nuevas políticas que permitan usuarios invitados

```sql
-- Política para INSERT (subir archivos) - permite usuarios autenticados Y anónimos
CREATE POLICY "cualquiera_suben_evidencia"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'evidence-files');

-- Política para SELECT (ver archivos) - permite cualquier usuario
CREATE POLICY "cualquiera_lee_evidencia"
ON storage.objects
FOR SELECT
USING (bucket_id = 'evidence-files');
```

---

## 📊 PASO 2: MODIFICAR POLÍTICAS RLS PARA STUDENT_ATTEMPTS

### 2.1 Eliminar políticas existentes

```sql
-- Eliminar políticas problemáticas
DROP POLICY IF EXISTS "alumno_ve_sus_intentos" ON student_attempts;
DROP POLICY IF EXISTS "profesor_ve_intentos_sus_ejercicios" ON student_attempts;
DROP POLICY IF EXISTS "alumno_inserta_intento" ON student_attempts;
```

### 2.2 Crear nuevas políticas que permitan invitados

```sql
-- Política para SELECT - estudiantes ven sus intentos, profesores ven intentos de sus ejercicios
CREATE POLICY "ver_intentos"
ON student_attempts
FOR SELECT
USING (
  -- Estudiante ve sus propios intentos (autenticados o invitados)
  (student_id = auth.uid() OR (student_id IS NULL AND student_name = auth.jwt() ->> 'name'))
  -- O profesor ve intentos de sus ejercicios
  OR EXISTS (
    SELECT 1 FROM exercises
    WHERE exercises.id = student_attempts.exercise_id
    AND exercises.teacher_id = auth.uid()
  )
);

-- Política para INSERT - permite insertar a cualquier usuario (autenticado o anónimo)
CREATE POLICY "insertar_intentos"
ON student_attempts
FOR INSERT
WITH CHECK (true);
```

---

## ✅ PASO 3: VERIFICAR QUE LAS POLÍTICAS ESTÉN ACTIVAS

Ejecuta esta consulta para verificar:

```sql
-- Ver políticas de storage
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Ver políticas de student_attempts
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'student_attempts';
```

Deberías ver las nuevas políticas activas.

---

## 🧪 PASO 4: PROBAR EL SISTEMA

Después de ejecutar estos comandos:

1. **Reinicia tu aplicación local**: `npm run dev`
2. **Prueba como estudiante invitado**:
   - Ve a la aplicación
   - Selecciona "Soy Estudiante"
   - Elige un ejercicio
   - Sube un archivo de evidencia
   - Completa el ejercicio

3. **Verifica que no haya errores** en la consola del navegador

---

## 🔍 SI SIGUEN HABÍENDO ERRORES

Si aún ves errores, ejecuta esta consulta para debug:

```sql
-- Ver qué políticas están activas
SELECT * FROM pg_policies WHERE tablename IN ('student_attempts', 'objects');
```

Y comparte el resultado conmigo.