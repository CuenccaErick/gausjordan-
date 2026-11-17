# 🧪 GUÍA DE TESTING - SISTEMA DE EVIDENCIA

Esta guía te ayudará a probar completamente el flujo de subida y visualización de evidencia en local.

---

## 📋 PRE-REQUISITOS

### ✅ Verificar Setup

Antes de empezar:

1. **Variables de entorno** (`.env.local`):
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key
   ```

2. **Supabase configurado** (ver [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)):
   - ✅ Bucket `evidence-files` creado y públicoazo
   - ✅ RLS policies en Storage configuradas
   - ✅ Tabla `student_attempts` con columna `evidence_url`

3. **Dependencias instaladas**:
   ```bash
   npm install
   ```

4. **Servidor dev corriendo**:
   ```bash
   npm run dev
   ```
   → Debe estar en `http://localhost:5173`

---

## 🎯 TEST 1: CREAR UN EJERCICIO (Como Profesor)

### 1.1 Setup

1. Abre `http://localhost:5173`
2. Click **"Comienza Aquí"**
3. Selecciona **"Soy Profesor"** → **"Continuar"**
4. Google login (crea cuenta de test si es necesario)

**Resultado esperado**: Ves dashboard vacío de profesor

### 1.2 Crear Ejercicio

1. Click **"+ Crear Nuevo Ejercicio"**
2. **Rellenar formulario**:
   - **Título**: `Test Ejercicio Evidencia`
   - **Instrucciones**: `Reduce esta matriz a forma escalonada escalonada`
   - **Dimensiones**: Filas: **2**, Columnas: **2**

### 1.3 Definir Primera Matriz

**Matriz inicial** (problema):
```
| 1  2 |
| 3  4 |
```

**Matriz solución** (respuesta correcta):
```
| 1  0 |
| 0  1 |
```

1. Llena los valores
2. Click **"Guardar Ejercicio"**

**Resultado esperado**: ✅ Alerta con código de 6 caracteres (ej: `XYZ789`)

**Anota el código**: `_____________` (lo usaremos en el test del estudiante)

---

## 👨‍🎓 TEST 2: RESOLVER EJERCICIO + SUBIR EVIDENCIA (Como Estudiante)

### 2.1 Abrir Navegador Incógnito

Abre una ventana privada para ser un estudiante diferente:
- **Windows**: Ctrl + Shift + P (Chrome/Edge) o Ctrl + Shift + O (Firefox)
- **Mac**: Cmd + Shift + P (Chrome) o Cmd + Shift + O (Firefox)

### 2.2 Entrar como Estudiante

1. Ve a `http://localhost:5173`
2. Click **"Comienza Aquí"**
3. Selecciona **"Soy Estudiante"** (sin login)
4. Click **"Continuar"** → rellena:
   - **Nombre**: `Juan Test`
   - **Matrícula**: `A00123456`
5. Click **"¡Comenzar Ahora!"**

### 2.3 Ingresar Código de Clase

1. Pega el código que anotaste (ej: `XYZ789`)
2. Click **"Ingresar a la Clase"**

**Resultado esperado**: ✅ Ves la pantalla de bienvenida del ejercicio

### 2.4 Resolver Matrices

**Paso 1**: Bienvenida
- Lee instrucciones
- Click **"Comenzar Ejercicio"**

**Paso 2**: Ver Problema
- Ves matriz inicial: `[1,2; 3,4]`
- Click **"Comenzar a Resolver"**

**Paso 3**: Resolver Matriz
- Lado izquierdo: Matriz original (lectura)
- Lado derecho: Tu respuesta (editable)
- Ingresa valores:
  ```
  | 1  0 |
  | 0  1 |
  ```
- ⚠️ **IMPORTANTE**: Lee el paso siguiente para saber dónde cargar evidencia

### 2.5 ⭐ SUBIR EVIDENCIA

Aquí es donde probamos la **nueva funcionalidad mejorada**:

1. **Busca la sección "Sube tu procedimiento"**
2. Deberías ver:
   - ✅ Aparece en TODAS las matrices (no solo en la última)
   - ✅ Descripción clara: "Foto de tu libreta o PDF..."
   - ✅ Área de drag-and-drop

### 2.6 Cargar Archivo de Test

**Opción A**: Usar archivo existente
- Navega a una carpeta con imágenes o PDFs
- Arrastra a la zona o click "Choose file"

**Opción B**: Crear archivo de test
```bash
# En tu carpeta de proyecto, crea archivo de texto
echo "Evidencia de resolución" > test-evidence.txt
ren test-evidence.txt test-evidence.pdf  # Cambiar extensión a PDF
```

**Esperado después de cargar**:
- ✅ Icono ✓ verde
- ✅ Nombre del archivo visible
- ✅ Tamaño en MB
- ✅ Mensaje: "✓ Archivo listo para enviar"
- ✅ Botón "Cambiar archivo" para reemplazar

### 2.7 Enviar Respuesta

1. Click **"Verificar Respuesta"**

**Consola esperada** (F12):
```
📤 Subiendo evidencia: {
  fileName: "...",
  fileSize: "X.XXmb",
  fileType: "..."
}
✅ Evidencia subida exitosamente: https://...
📊 Resultados calculados: { totalCorrect: 4, totalCells: 4, accuracy: "100.00%", score: 120 }
💾 Guardando intento en BD...
✅ Intento guardado exitosamente en BD
```

### 2.8 Ver Resultados

**Paso 4**: Verificación
- Ves las 3 versiones de la matriz
- Click **"Siguiente Matriz"** o **"Volver al Inicio"**

**Pantalla final**:
- ✅ Puntuación total (120)
- ✅ Precisión (100%)
- ✅ Tiempo
- ✅ **"✓ Evidencia enviada correctamente"**

---

## 👨‍🏫 TEST 3: PROFESOR VE RESULTADOS + EVIDENCIA

### 3.1 Volver a Sesión de Profesor

1. Cierra la ventana de incógnito
2. En la ventana original (donde eres profesor)
3. Deberías ver el ejercicio creado

### 3.2 Click en "Resultados"

1. En la tarjeta del ejercicio, click **"Resultados"**
2. Deberías ver:
   - ✅ Tabla con estudiante "Juan Test"
   - ✅ Matrícula: `A00123456`
   - ✅ Puntuación: `120` pts
   - ✅ Precisión: `100%`
   - ✅ Columna "Evidencia" muestra: "Con evidencia"

### 3.3 ⭐ VER DETALLE COMPLETO

**Click en la fila del estudiante** o **"Ver detalle"**:

#### Deberías ver un **MODAL** con:

1. **Header**:
   - Nombre: `Juan Test`
   - Matrícula: `A00123456`
   - Puntuación: `120 pts`
   - Precisión: `100%`
   - Tiempo: `MM:SS`

2. **Sección "Respuestas del alumno"**:
   - Matriz 1 de 1
   - 3 columnas lado a lado:
     - **Original**: `[1,2; 3,4]` (gris)
     - **Respuesta del alumno**: `[1,0; 0,1]` (azul, con celdas)
       - ✅ Celdas CORRECTAS: **VERDE** `[1,0]` arriba
       - ✅ Celdas INCORRECTAS: **ROJO** (si hubiera alguna)
     - **Respuesta correcta**: `[1,0; 0,1]` (verde)

3. **Sección "Evidencia enviada"**:
   - Si es imagen: **se muestra preview**
   - Si es PDF: **icono PDF + botón "Abrir PDF"**
   - Click en imagen → abre en nueva pestaña
   - Click "Abrir PDF" → abre el PDF

---

## 🐛 TEST 4: VALIDACIONES Y ERROR HANDLING

### 4.1 Test Archivo Demasiado Grande

**Preparar**:
1. Crea un archivo > 10MB
2. En el formulario, intenta cargarlo

**Esperado**:
- ❌ Alerta: "El archivo es demasiado grande (máx 10MB)"
- ✅ Archivo no se carga

### 4.2 Test Tipo de Archivo No Válido

**Preparar**:
1. Crea un archivo `.exe` o `.zip`
2. Intenta cargarlo

**Esperado**:
- ❌ Alerta: "Formato no soportado. Usa JPG, PNG, GIF, WEBP o PDF"
- ✅ Archivo no se carga

### 4.3 Test Sin Evidencia

**Escenario**: Estudiante no carga archivo

1. Resuelve matrices
2. No cargues ningún archivo
3. Click "Verificar Respuesta"

**Esperado**:
- ✅ Se guarda el intento normalmente
- ✅ En resultados, columna "Evidencia" muestra: "Sin evidencia"
- ✅ En modal, sección de evidencia dice: "El alumno no subió evidencia"

### 4.4 Test Respuesta Incorrecta + Evidencia

**Preparar**:
1. Resuelve incorrectamente (ej: ingresa números al azar)
2. Carga evidencia
3. Envía

**Esperado**:
- ✅ Puntuación menor a 120
- ✅ Precisión < 100%
- ✅ Celdas rojas en modal del profesor (las incorrectas)
- ✅ Evidencia se ve normalmente

---

## 🔍 TEST 5: VERIFICAR BASE DE DATOS

### 5.1 Ver datos en Supabase

1. Ve a tu proyecto de Supabase
2. **SQL Editor** → Ejecuta:

```sql
SELECT 
  id,
  student_name,
  student_matricula,
  accuracy,
  score,
  evidence_url,
  answers_snapshot
FROM student_attempts
ORDER BY completed_at DESC
LIMIT 5;
```

**Deberías ver**:
- ✅ `student_name`: `Juan Test`
- ✅ `student_matricula`: `A00123456`
- ✅ `accuracy`: `100`
- ✅ `score`: `120`
- ✅ `evidence_url`:  `https://.../.../juan_test_...pdf` (URL válida)
- ✅ `answers_snapshot`: `[{ matrixIndex: 0, studentAnswer: {...}, correctness: [[true, true], [true, true]] }]`

### 5.2 Verificar archivo en Storage

1. Ve a **Storage** → **evidence-files**
2. Deberías ver una carpeta con el ID del ejercicio
3. Dentro, el archivo: `Juan_test_[timestamp].pdf`

---

## 📊 TEST 6: CASOS EDGE

### 6.1 Múltiples estudiantes, un ejercicio

**Escenario**: Varios estudiantes envían soluciones

1. Repite TEST 2 y 3 con diferentes estudiantes
2. Profesor ve tabla con múltiples filas
3. Cada uno con su evidencia

**Esperado**:
- ✅ Tabla muestra todos
- ✅ Cada fila clickeable
- ✅ Modal muestra el estudiante correcto con su evidencia

### 6.2 Reintentos

**Escenario**: El mismo estudiante intenta 2 veces

1. Estudiante resuelve ejercicio #1, sube evidencia
2. Profesor ve resultado
3. **Mismo estudiante** resuelve de nuevo (código de clase)
4. Sube evidencia diferente

**Esperado**:
- ✅ Tabla de profesor muestra 2 filas (2 intentos)
- ✅ Cada uno con su evidencia diferente
- ✅ Fechas diferentes en columna "Fecha"

### 6.3 Estudiante invitado (sin login)

**Escenario**: Las pruebas anteriores fueron sin login (invitado)

**Esperado**:
- ✅ Funciona idéntico
- ✅ BD guarda `student_id = NULL` (invitado)
- ✅ Profesor aún puede ver resultados y evidencia

---

## 📝 CHECKLIST DE TESTING

### Funcionalidad Base
- [ ] Profesor crea ejercicio con código
- [ ] Estudiante ingresa código y accede
- [ ] Estudiante resuelve matrices

### Evidencia (Nueva)
- [ ] Input de archivo aparece en TODAS las matrices
- [ ] Validación de tamaño (>10MB rechaza)
- [ ] Validación de tipo (solo image/pdf acepta)
- [ ] Preview del nombre del archivo
- [ ] Botón "Cambiar archivo" funciona

### Subida de Archivos
- [ ] Archivo se sube a Supabase Storage
- [ ] Console muestra logs de upload
- [ ] URL pública generada correctamente
- [ ] Archivo visible en Storage bucket

### Base de Datos
- [ ] `evidence_url` guardado en BD
- [ ] `answers_snapshot` con respuestas
- [ ] Timestamps correctos

### Visualización (Profesor)
- [ ] Tabla muestra estudiantes
- [ ] Columna "Evidencia" indica si hay archivo
- [ ] Click abre modal
- [ ] Modal muestra matrices (original, respuesta, correcta)
- [ ] Celdas correctas e incorrectas con colores
- [ ] Evidencia visible (imagen preview o PDF link)

### Edge Cases
- [ ] Sin evidencia (campo vacío)
- [ ] Respuesta incorrecta (celdas rojas)
- [ ] Múltiples estudiantes
- [ ] Múltiples intentos mismo estudiante
- [ ] Usuario invitado (sin login)

---

## 🚀 DEPLOYMENT TEST (Opcional)

Si quieres probar en staging/producción:

1. Haz push a rama `main` o deploy
2. Abre app en Vercel/Netlify/etc
3. Repite TEST 2 y 3 en producción
4. Verifica URLs públicas funcionan

---

## 📞 DEBUG

### Habilitar Console Logs

Abre DevTools (F12):
- **Network**: Ver requests a Supabase
- **Console**: Ver logs con `console.log()` (están en ExerciseSession.tsx)
- **Storage**: Ver `localStorage`

### Mensajes esperados en Console

```javascript
// Subida exitosa
✅ Evidencia subida exitosamente: https://...

// Cálculo de resultados
📊 Resultados calculados: { ... }

// Guardado en BD
✅ Intento guardado exitosamente en BD

// Errores (si los hay)
❌ Error subiendo evidencia: ...
```

### Verificar Network Requests

En **F12 → Network**:
- POST a `https://your-project.supabase.co/storage/v1/object/evidence-files/...` (upload)
- GET a URL pública del archivo (load)

---

**¡Listo para probar!** 🚀
