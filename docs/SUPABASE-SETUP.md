# 🔐 GUÍA DE CONFIGURACIÓN SUPABASE - SISTEMA DE EVIDENCIA

Esta guía te ayudará a configurar correctamente Supabase para que el sistema de carga de evidencia funcione en local y en producción.

---

## 📋 REQUISITOS PREVIOS

- ✅ Cuenta de Supabase (https://supabase.com)
- ✅ Proyecto creado en Supabase
- ✅ Variables de entorno en `.env.local`:
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

---

## 🚀 PASO 1: CREAR EL BUCKET DE STORAGE

### 1.1 Acceder a Storage

1. Abre tu proyecto de Supabase
2. Ve a **Storage** (en el menú lateral izquierdo)
3. Click en **Create a new bucket** (o "+ New bucket")

### 1.2 Crear el bucket `evidence-files`

**Configuración:**
- **Bucket Name**: `evidence-files`
- **Public bucket**: ✅ **Sí** (para que las URLs sean públicas)
- Click **Create bucket**

> ⚠️ **Importante**: Debe ser **público** para que el profesor pueda ver las imágenes/PDFs en el navegador

---

## 🔒 PASO 2: CONFIGURAR ROW LEVEL SECURITY (RLS)

### 2.1 Habilitar RLS en el bucket

En el dashboard de Supabase:

1. Ve a **Storage** → **Policies**
2. Click en el bucket `evidence-files`
3. Verifica que **RLS is enabled**

### 2.2 Crear Policy para Uploads (estudiantes)

Click **"New Policy"** y selecciona **"Upload"**

```sql
/* Política: Los estudiantes pueden subir archivos */
CREATE POLICY "estudiantes_suben_evidencia"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'evidence-files'
  AND auth.uid() IS NOT NULL
);
```

**Configuración en UI:**
- **Allowed operation**: INSERT
- **Target role**: All users (anon/authenticated)
- **Expression**: `bucket_id = 'evidence-files' AND auth.uid() IS NOT NULL`

### 2.3 Crear Policy para Downloads/Lectura

Click **"New Policy"** y selecciona **"Select"**

```sql
/* Política: Cualquier usuario autenticado puede ver los archivos */
CREATE POLICY "usuarios_leen_evidencia"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'evidence-files'
  AND auth.uid() IS NOT NULL
);
```

**Configuración en UI:**
- **Allowed operation**: SELECT
- **Target role**: All users (anon/authenticated)
- **Expression**: `bucket_id = 'evidence-files' AND auth.uid() IS NOT NULL`

### Resultado esperado

Después de crear las políticas, deberías ver:

```
✅ estudiantes_suben_evidencia (INSERT)
✅ usuarios_leen_evidencia (SELECT)
```

---

## 📊 PASO 3: VERIFICAR TABLA `student_attempts`

### 3.1 Estructura necesaria

La tabla debe tener estas columnas:

```sql
CREATE TABLE student_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  student_matricula TEXT,
  
  -- Respuestas y resultados
  answers_snapshot JSONB,        -- Array de respuestas + correctness
  score INTEGER DEFAULT 0,       -- 0-120 puntos
  accuracy DECIMAL DEFAULT 0,    -- 0-100 porcentaje
  time_elapsed INTEGER DEFAULT 0,-- Segundos
  
  -- Evidencia
  evidence_url TEXT,             -- URL pública del archivo subido
  
  -- Timestamps
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Verificar/Agregar columna de evidencia

Si la tabla ya existe pero le falta la columna:

```sql
ALTER TABLE student_attempts
ADD COLUMN IF NOT EXISTS evidence_url TEXT;
```

### 3.3 Agregar/Verificar RLS

```sql
ALTER TABLE student_attempts ENABLE ROW LEVEL SECURITY;

-- Estudiante solo ve SUS intentos
CREATE POLICY "alumno_ve_sus_intentos"
ON student_attempts
FOR SELECT
USING (student_id = auth.uid() OR student_id IS NULL);

-- Profesor ve intentos de SUS ejercicios
CREATE POLICY "profesor_ve_intentos_sus_ejercicios"
ON student_attempts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM exercises
    WHERE exercises.id = student_attempts.exercise_id
    AND exercises.teacher_id = auth.uid()
  )
);

-- Estudiante puede insertar SUS intentos
CREATE POLICY "alumno_inserta_intento"
ON student_attempts
FOR INSERT
WITH CHECK (
  (student_id = auth.uid() OR student_id IS NULL)
  AND auth.uid() IS NOT NULL
);
```

---

## 🌐 PASO 4: CONFIGURAR CORS (Opcional pero recomendado)

Para evitar problemas de CORS al subir archivos:

1. Ve a **Storage** → **Settings**
2. En **CORS headers**, agrega:

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:5173", "https://yourdomain.com"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allowedHeaders": ["*"],
    "maxAgeSeconds": 3600
  }
]
```

> **Nota**: Reemplaza con tus dominios reales en producción

---

## ✅ PASO 5: PROBAR LA CONFIGURACIÓN

### 5.1 Test Upload en LOCAL

**Como Estudiante:**
1. Abre `http://localhost:5173`
2. Selecciona "Soy Estudiante"
3. Ingresa un código de ejercicio (ej: `SIMPLE`)
4. Llena nombre y matrícula
5. Resuelve las matrices
6. **Cuando llegues a la última matriz**, carga una imagen o PDF
7. Verifica que se suba exitosamente

**Verificar en Supabase:**
1. Ve a **Storage** → **evidence-files**
2. Deberías ver la carpeta del ejercicio con el archivo subido
3. Click en el archivo → **Copy URL** → Abre en navegador → Debe verse la imagen/abrirse el PDF

### 5.2 Test como Profesor

1. Crea un nuevo usuario (profesor)
2. Crea un ejercicio
3. Anota el código de clase
4. En otra ventana (incógnita), ingresa como estudiante y completa el ejercicio
5. Vuelve como profesor
6. Ve a **Resultados** del ejercicio
7. Click en el estudiante
8. En el modal, deberías ver:
   - ✅ Las matrices (original, respuesta estudiante, respuesta correcta)
   - ✅ Si subió evidencia, deberías poder verla
   - ✅ Click en "Abrir" debe abrir la imagen/PDF

---

## 🐛 TROUBLESHOOTING

### Problema: "Error al subir archivo"

**Causa 1: RLS policy restrictiva**
- Verifica que la policy de INSERT permita `auth.uid() IS NOT NULL`
- Los usuarios invitados (sin login) pueden tener `auth.uid() = null`

**Solución:**
```sql
-- Política más permisiva
CREATE POLICY "cualquiera_sube"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'evidence-files');
```

---

### Problema: Archivo se sube pero URL no funciona

**Causa 1: Bucket no es público**
- Ve a **Storage** → **evidence-files** → **Settings**
- Activa "Public bucket"

**Causa 2: URL incorrecta**
- Verifica que `supabase.storage.from('evidence-files').getPublicUrl()` retorne URL válida
- Debe ser similar a: `https://your-project.supabase.co/storage/v1/object/public/evidence-files/...`

---

### Problema: "Archivo demasiado grande"

- El límite está codificado en **ExerciseSession.tsx**: `10 * 1024 * 1024` (10MB)
- Si necesitas aumentarlo, modificalo en el código

---

### Problema: "Tipo de archivo no soportado"

**Tipos permitidos:**
- ✅ `image/jpeg` (JPG)
- ✅ `image/png` (PNG)
- ✅ `image/gif` (GIF)
- ✅ `image/webp` (WEBP)
- ✅ `application/pdf` (PDF)

Si quieres agregar más, edita en **StudentExerciseSteps.tsx**:
```javascript
const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
```

---

## 🚀 PASO 6: DEPLOY A PRODUCCIÓN

### 6.1 Variables de entorno en producción

Asegúrate de que tu host (Vercel, Netlify, Railway) tenga:
```
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-key
```

### 6.2 Actualizar CORS

En Supabase → **Storage** → **Settings** → **CORS headers**:
```json
[
  {
    "origin": ["https://yourdomain.com", "https://www.yourdomain.com"],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allowedHeaders": ["*"]
  }
]
```

### 6.3 Verificar RLS en producción

Las RLS policies ya están configuradas, solo verifica que estén activas en la BD de producción.

---

## 📝 CHECKLIST FINAL

- [ ] Bucket `evidence-files` creado ✅
- [ ] Bucket es **público** ✅
- [ ] RLS **habilitado** en Storage ✅
- [ ] Policies creadas:
  - [ ] `estudiantes_suben_evidencia` (INSERT)
  - [ ] `usuarios_leen_evidencia` (SELECT)
- [ ] Tabla `student_attempts` tiene columna `evidence_url` ✅
- [ ] Tabla `student_attempts` tiene RLS habilitado ✅
- [ ] Variables de entorno correctas (TEST) ✅
- [ ] Test upload en local funciona ✅
- [ ] Profesor puede ver evidencia en resultados ✅
- [ ] URLs públicas funcionan en navegador ✅
- [ ] CORS configurado (si es necesario) ✅
- [ ] Deploy a producción listo ✅

---

## 🔗 RECURSOS

- **Docs Supabase Storage**: https://supabase.com/docs/guides/storage
- **RLS en Storage**: https://supabase.com/docs/guides/storage/security
- **CORS en Supabase**: https://supabase.com/docs/guides/api/cors

---

**¿Preguntas o problemas?** Revisa la consola del navegador (F12) para mensajes de debug.
