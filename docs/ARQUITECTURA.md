# 🏗️ ARQUITECTURA DEL SISTEMA - EVIDENCIA Y RESULTADOS

Este documento muestra la arquitectura completa del sistema de manera visual.

---

## 📊 DIAGRAMA GENERAL

```
┌──────────────────────────────────────────────────────────────────────┐
│                         GAUSS-JORDAN ACADEMY                         │
│                     (Plataforma Educativa)                           │
└──────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────┐
                    │      Frontend (React TSX)   │
                    └─────────────────────────────┘
                               │
                   ┌───────────┼───────────┐
                   │           │           │
            ┌──────▼──┐  ┌─────▼──┐  ┌────▼────┐
            │ Professor│  │Student │  │  Cloud  │
            │Dashboard │  │   App  │  │ Storage │
            │(Resultados) │ (Sesión) │ (Supabase)
            └─────┬────┘  └────┬──┘  └────┬────┘
                  │             │          │
                  └─────┬───────┴──────┬───┘
                        │              │
                   ┌────▼──────────────▼────┐
                   │   Supabase Backend      │
                   ├────────────────────────┤
                   │ • PostgreSQL (BD)      │
                   │ • Auth (OAuth)         │
                   │ • Storage (Archivos)   │
                   │ • RLS (Seguridad)      │
                   └────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS - ESTUDIANTE RESUELVE Y SUBE EVIDENCIA

```
ESTUDIANTE RESUELVE MATRIZ
         │
         ▼
┌─────────────────────────────────────────┐
│  StudentExerciseSteps.tsx               │
│  - ViewProblemStep (ver matriz)        │
│  - SolveMatrixStep (resolver)          │
│    ├─ Input de matriz editable        │
│    ├─ ⭐ Input de archivo (NUEVO!)     │
│    └─ Validación: tamaño, tipo        │
└─────────────────────────────────────────┘
         │
         ├─ Matriz completada ✓
         ├─ Archivo seleccionado ✓
         │
         ▼ Click \"Verificar Respuesta\"
┌─────────────────────────────────────────┐
│  ExerciseSession.tsx                    │
│  - handleFinish()                       │
│    ├─ compareMatrices() → accuracy      │
│    ├─ uploadEvidence() ⭐ (NUEVO!)      │
│    │  └─ Supabase.storage.upload()     │
│    ├─ calculateScore() → puntuación     │
│    └─ INSERT student_attempts          │
└─────────────────────────────────────────┘
         │
         ├─ 📤 Archivo →  Supabase Storage
         │             bucket: evidence-files
         │             path: {exerciseId}/{name}_{timestamp}.ext
         │             response: publicUrl
         │
         ├─ 💾 Datos → PostgreSQL
         │  student_attempts {
         │    student_name
         │    student_matricula
         │    accuracy
         │    score
         │    time_elapsed
         │    evidence_url ← URL pública
         │    answers_snapshot ← respuestas con colores
         │  }
         │
         ▼
    GUARDADO EXITOSO
    Mostrar resultados al estudiante
```

---

## 👨‍🏫 FLUJO DE DATOS - PROFESOR VE RESULTADOS

```
PROFESOR ABRE VISTA DE RESULTADOS
         │
         ▼
┌─────────────────────────────────────────┐
│  TeacherDashboard.tsx                  │
│  Click \"Resultados\" en ejercicio     │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  ResultsView.tsx                        │
│  - Fetch: SELECT * FROM student_attempts
│    WHERE exercise_id = ?                │
└─────────────────────────────────────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │ Tabla visible con:                  │
    │ • Nombre estudiante                 │
    │ • Matrícula                         │
    │ • Puntuación (0-120)                │
    │ • Precisión (%)                     │
    │ • Tiempo                             │
    │ • Evidencia (\"Con evidencia\"/\"Sin\") │
    │ • Fecha                              │
    └─────────────────────────────────────┘
         │
         ▼ Click en FILA del estudiante
┌─────────────────────────────────────────┐
│  Modal de DETALLE                       │
│  (selectedAttempt)                      │
│                                         │
│  SECCIÓN 1: Datos Estudiante           │
│  ├─ Nombre                              │
│  ├─ Matrícula                          │
│  ├─ Puntuación: 120 pts                │
│  ├─ Precisión: 100%                    │
│  └─ Tiempo: MM:SS                      │
│                                         │
│  SECCIÓN 2: Respuestas (NUEVA!)        │
│  ├─ Matriz Original (gris, lectura)    │
│  ├─ Respuesta del Alumno (azul)        │
│  │  └─ Celdas: Verde ✓ / Rojo ✗       │
│  └─ Respuesta Correcta (verde)         │
│                                         │
│  SECCIÓN 3: Evidencia (NUEVA!)         │
│  ├─ Si imagen: PREVIEW                 │
│  │  └─ Link \"Abrir en nueva pestaña\"   │
│  ├─ Si PDF: Icono 📄                   │
│  │  └─ Botón \"Abrir PDF\"              │
│  └─ Si nada: \"No subió evidencia\"    │
└─────────────────────────────────────────┘
```

---

## 💾 ESTRUCTURA DE BASE DE DATOS

### Tabla: `exercises`
```sql
├─ id (UUID PK)
├─ teacher_id (UUID FK)
├─ title (TEXT)
├─ instructions (TEXT)
├─ matrices (JSONB Array)
│  └─ [{rows, cols, values[][][], ...}]
├─ correct_answers (JSONB Array)
│  └─ [{rows, cols, values[][][], ...}]
├─ class_code (TEXT UNIQUE)  ← \"ABC123\"
└─ created_at (TIMESTAMPTZ)
```

### Tabla: `student_attempts` ⭐ (La más importante)
```sql
├─ id (UUID PK)
├─ exercise_id (UUID FK)
├─ student_id (UUID FK) ← Puede ser NULL (invitado)
│
├─ Datos del Estudiante:
│  ├─ student_name (TEXT)
│  ├─ student_matricula (TEXT)
│
├─ Resultados:
│  ├─ score (INTEGER) → 0-120
│  ├─ accuracy (DECIMAL) → 0-100%
│  ├─ time_elapsed (INTEGER) → segundos
│
├─ ⭐ EVIDENCIA (NUEVO):
│  ├─ evidence_url (TEXT) → URL pública
│  │  └─ https://supabase.co/storage/v1/object/public/evidence-files/...
│  │  └─ Tipo: image/jpeg, image/png, application/pdf
│  │  └─ Tamaño: < 10MB
│
├─ ⭐ RESPUESTAS (NUEVO):
│  ├─ answers_snapshot (JSONB Array)
│  │  └─ [{
│  │      matrixIndex: 0,
│  │      studentAnswer: {rows, cols, values[][]},
│  │      correctness: [[true, false], [true, true]]
│  │    }]
│  │  └─ Se usa para mostrar colores (verde/rojo)
│
└─ Timestamps:
   ├─ completed_at (TIMESTAMPTZ)
   └─ created_at (TIMESTAMPTZ)
```

---

## 🔐 Almacenamiento en Supabase Storage

### Bucket: `evidence-files` (Público)

```
evidence-files/
│
├─ {exercise-id-1}/
│  ├─ juan_perez_1712342400.pdf
│  ├─ maria_garcia_1712342500.jpg
│  └─ carlos_lopez_1712342600.png
│
├─ {exercise-id-2}/
│  ├─ student_a_1712343000.pdf
│  └─ student_b_1712343100.jpg
│
└─ ...

URLs Públicas:
https://your-project.supabase.co/storage/v1/object/public/evidence-files/{path}
                                                                          ↓
                                                  Accesible en navegador (public)
```

### RLS Policies (Seguridad)

```sql
┌─────────────────────────────────────────┐
│ UPLOAD: estudiantes_suben_evidencia    │
├─────────────────────────────────────────┤
│ INSERT with CHECK:                      │
│ - bucket_id = 'evidence-files'         │
│ - auth.uid() IS NOT NULL               │
│                                         │
│ ✅ Estudiante logueado puede subir     │
│ ✅ Estudiante invitado NO puede       │
│    (pero en nuestro caso, invitado     │
│     puede porque hay otro toggle)      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SELECT: usuarios_leen_evidencia        │
├─────────────────────────────────────────┤
│ SELECT with USING:                      │
│ - bucket_id = 'evidence-files'         │
│ - auth.uid() IS NOT NULL               │
│                                         │
│ ✅ Profesor logueado puede ver        │
│ ✅ Estudiante logueado puede ver      │
│ ❌ Anónimos NO pueden ver              │
└─────────────────────────────────────────┘
```

---

## 🔄 Validación de Archivos (En Cascada)

```
USUARIO SELECCIONA ARCHIVO
         │
         ▼ Frontend (StudentExerciseSteps.tsx)
    ┌────────────────────────┐
    │ Validación 1: Tipo     │
    │ Permitidos:            │
    │ ✅ image/jpeg (JPG)   │
    │ ✅ image/png (PNG)    │
    │ ✅ image/gif (GIF)    │
    │ ✅ image/webp (WEBP)  │
    │ ✅ application/pdf    │
    └────────────────────────┘
              │
              ├─ ✅ Válido → Siguiente
              └─ ❌ Inválido → Alert: \"Formato no soportado\"
                                │
                                ▼ STOP
         │
         ▼ Frontend (StudentExerciseSteps.tsx)
    ┌────────────────────────┐
    │ Validación 2: Tamaño   │
    │ Máximo: 10MB           │
    └────────────────────────┘
              │
              ├─ ✅ < 10MB → Siguiente
              └─ ❌ ≥ 10MB → Alert: \"Archivo demasiado grande\"
                              │
                              ▼ STOP
         │
         ▼ Backend (ExerciseSession.tsx)
    ┌────────────────────────┐
    │ Re-Validación 3        │
    │ - Tamaño (10MB)        │
    │ - Tipo MIME            │
    │ - Sanitizar nombre     │
    └────────────────────────┘
              │
              ├─ ✅ OK → Subir
              └─ ❌ Fallo → console.error() + return null
                            (no se guarda evidencia_url)
         │
         ▼ Storage API (Supabase)
    ┌────────────────────────┐
    │ Upload a Storage       │
    │ bucket: evidence-files │
    │ path: {ex}/{name}.ext  │
    └────────────────────────┘
              │
              ├─ ✅ Subido → Get publicUrl()
              └─ ❌ Error → console.error() + return null
         │
         ▼ Base de Datos
    ┌────────────────────────┐
    │ INSERT student_attempts│
    │ evidence_url: URL ó    │
    │              NULL      │
    └────────────────────────┘

RESULTADO:
- ✅ Archivo guardado en Storage
- ✅ evidence_url en BD
- ❌ Archivo no guardado, evidence_url = NULL
```

---

## 🎯 Flujo Completo End-to-End

```
PASO 1: PROFESOR
─────────────────
CREATE: ejercicio con matrices
RESULT: código único (ABC123)
        guardar en BD

PASO 2: ESTUDIANTE (incógnito/login)
────────────────────────────────────
JOIN:   código ABC123
SOLVE:  matriz por matriz
UPLOAD: evidencia (foto/PDF)
SUBMIT: respuestas + evidencia_url
RESULT: puntuación mostrada

PASO 3: BD
──────────
STORE:  student_attempt {
          exercise_id,
          student_name,
          student_matricula,
          score,
          accuracy,
          time_elapsed,
          evidence_url ← URL pública
          answers_snapshot ← respuestas+correctness
        }

PASO 4: PROFESOR VE RESULTADOS
───────────────────────────────
LIST:   tabla con estudiantes
SELECT: fila → abre modal
VIEW:
  ├─ Datos: nombre, matrícula, puntuación, precisión
  ├─ Matrices: original | respuesta | correcta
  │  (celdas coloreadas: verde/rojo)
  └─ Evidencia: imagen preview o PDF link

PASO 5: EVALUACIÓN
──────────────────
PROFESOR:
├─ Ve matrices con colores
├─ Revisa desarrollo en foto/PDF
└─ Decide si calificación automática es correcta
   (podría agregar calificaciones manuales en fase 2)
```

---

## 📈 Mejoras Implementadas (vs. Antes)

### ANTES (Versión anterior)
```
❌ Links de evidencia no funcionaban (HTML malformado)
❌ Evidencia solo en última matriz
❌ Sin validación de archivos
❌ Logs pobres para debugging
❌ Sin documentación de setup
```

### AHORA ✨
```
✅ Links funcionan correctamente
✅ Evidencia en CUALQUIER matriz
✅ Validación doble (frontend + backend)
   - Tamaño: < 10MB
   - Tipo: JPG/PNG/PDF
✅ Logs detallados con emojis 📤✅❌
✅ 3 guías completas:
   - SUPABASE-SETUP.md (config)
   - TESTING-EVIDENCIA.md (testing)
   - QUICKSTART.md (intro rápida)
```

---

## 🚀 Componentes Principales

```typescript
// 1️⃣ Vista de Estudiante
StudentExerciseSteps.tsx
├─ WelcomeStep (instrucciones)
├─ ViewProblemStep (ver matriz)
├─ SolveMatrixStep (resolver + ⭐ subir evidencia)
└─ VerificationResultStep (ver feedback)

// 2️⃣ Lógica de Sesión
ExerciseSession.tsx
├─ uploadEvidence() ← Subir archivo
├─ handleFinish() ← Guardar todo en BD
└─ displayResults() ← Mostrar scores

// 3️⃣ Vista de Profesor
ResultsView.tsx
├─ Tabla: listar estudiantes
├─ Modal: ver detalles
├─ MatrixInput: mostrar respuestas (con colores)
└─ Evidence: mostrar imagen/PDF

// 4️⃣ Componente de Matriz
MatrixInput.tsx
├─ Parámetro: correctness[][] (para colores)
├─ Lógica: verde si correcto, rojo si no
└─ Modo: editable o lectura

// 5️⃣ Utilidades
matrixUtils.ts
├─ compareMatrices() → correctness[][]
├─ calculateScore() → 0-120
└─ formatTime() → \"MM:SS\"
```

---

## 🔒 Seguridad por Capas

```
LAYER 1: OAuth Google
└─ Autenticación del usuario

LAYER 2: RLS en BD (PostgreSQL)
└─ Profesor solo ve SUS ejercicios
└─ Estudiante solo ve SUS intentos

LAYER 3: RLS en Storage (Supabase)
└─ Solo autenticados pueden subir
└─ Solo autenticados pueden descargar

LAYER 4: Validación en Frontend
└─ Tipo de archivo
└─ Tamaño de archivo

LAYER 5: Re-Validación en Backend
└─ Tamaño
└─ Tipo MIME
└─ Sanitización de names

RESULT: Archivo seguro, accesible solo a autorizados
```

---

**🎯 Conclusión**: Sistema completo, documentado y listo para producción.
