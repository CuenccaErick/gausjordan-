# 🚀 Guía de Inicio Rápido - Gauss-Jordan Academy

## 📌 Resumen Ejecutivo

Has creado una **aplicación web educativa completa** para enseñar el método de Gauss-Jordan. La aplicación está 100% funcional con almacenamiento local y lista para usar.

## 🎯 ¿Qué has construido?

Una plataforma educativa tipo **Kahoot para matrices** que incluye:

### ✅ Funcionalidades Implementadas
- **Login simulado con Google** (listo para integrar OAuth real)
- **Dos roles**: Profesor y Estudiante
- **Crear ejercicios** con múltiples matrices
- **Códigos de clase** de 6 caracteres
- **Resolver ejercicios** con verificación en tiempo real
- **Feedback visual**: verde (correcto) y rojo (incorrecto)
- **Sistema de puntuación** basado en precisión y tiempo
- **Resultados y estadísticas** detalladas
- **Almacenamiento local** (localStorage)

## 🏃‍♂️ Cómo Empezar en VS Code

### 1. Estructura de Archivos Actual

```
Tu proyecto tiene estos archivos:
📁 /
├── 📄 App.tsx                    ← Punto de entrada principal
├── 📄 README.md                  ← Documentación completa
├── 📄 GUIA-INICIO.md            ← Este archivo
├── 📁 types/
│   └── index.ts                 ← Tipos TypeScript
├── 📁 utils/
│   ├── storage.ts               ← Gestión de datos
│   └── matrixUtils.ts           ← Operaciones de matrices
├── 📁 components/
│   ├── Login.tsx                ← Pantalla de login
│   ├── RoleSelection.tsx        ← Elegir rol
│   ├── TeacherDashboard.tsx     ← Panel profesor
│   ├── StudentDashboard.tsx     ← Panel estudiante
│   ├── CreateExercise.tsx       ← Crear ejercicios
│   ├── MatrixInput.tsx          ← Input de matriz
│   ├── ExerciseSession.tsx      ← Resolver ejercicio
│   ├── ResultsView.tsx          ← Ver resultados
│   └── GoogleIcon.tsx           ← Icono de Google
└── 📁 styles/
    └── globals.css              ← Estilos globales
```

### 2. En VS Code

```bash
# 1. Abre el proyecto en VS Code
# Archivo > Abrir Carpeta > Selecciona tu proyecto

# 2. Abre la terminal integrada
# Ver > Terminal (o Ctrl + `)

# 3. Instala dependencias (si aún no lo hiciste)
npm install

# 4. Inicia el servidor de desarrollo
npm run dev

# 5. Abre en el navegador
# La URL aparecerá en la terminal (usualmente http://localhost:5173)
```

### 3. Prueba la Aplicación

#### Como Profesor:
1. Haz clic en "Iniciar sesión con Google" (simulado)
2. Selecciona "Soy Profesor"
3. Crea un ejercicio:
   - Título: "Sistema de 3 ecuaciones"
   - Instrucciones: "Reduce la matriz a forma escalonada"
   - Completa las matrices inicial y solución
   - Guarda y anota el código (ej: "ABC123")
4. Ve los resultados cuando los estudiantes completen

#### Como Estudiante:
1. Abre en otra ventana del navegador (modo incógnito)
2. Inicia sesión
3. Selecciona "Soy Estudiante"
4. Ingresa el código que anotaste: "ABC123"
5. Resuelve las matrices
6. Verifica tus respuestas
7. Ve tu puntuación final

## 🎓 Tutorial Paso a Paso

### PASO 1: Crear tu Primer Ejercicio (Profesor)

```
1. Login → Profesor
2. Click "Crear Nuevo Ejercicio"
3. Completa:
   ┌─────────────────────────────────────┐
   │ Título: Sistema de Ecuaciones 3x3  │
   │                                     │
   │ Instrucciones:                      │
   │ Reduce la matriz aumentada a su    │
   │ forma escalonada reducida usando   │
   │ el método de Gauss-Jordan          │
   └─────────────────────────────────────┘

4. Define la matriz inicial (3x4):
   ┌─────────────────┐
   │ 2   1   -1  │ 8 │
   │ -3  -1   2 │ -11│
   │ -2   1   2 │ -3 │
   └─────────────────┘

5. Define la solución (3x4):
   ┌─────────────────┐
   │ 1   0   0  │ 2 │
   │ 0   1   0  │ 3 │
   │ 0   0   1 │ -1│
   └─────────────────┘

6. Guardar → Obtienes código: "XYZ789"
```

### PASO 2: Resolver como Estudiante

```
1. Login → Estudiante
2. Ingresa código: "XYZ789"
3. Lee las instrucciones
4. Completa la matriz paso a paso
5. Click "Verificar Respuesta"
   ✅ Celdas verdes = correctas
   ❌ Celdas rojas = revisar
6. Corrige los errores
7. Click "Finalizar"
8. ¡Ve tu puntuación!
```

## 📊 Sistema de Puntuación Explicado

```
Puntuación = Precisión + Bonus de Tiempo

Precisión:
- 100% correcto = 100 puntos
- 75% correcto = 75 puntos
- etc.

Bonus de Tiempo:
- Menos de 1 min:   +20 pts → Máx: 120
- Menos de 2 min:   +15 pts → Máx: 115
- Menos de 3 min:   +10 pts → Máx: 110
- Menos de 5 min:   +5 pts  → Máx: 105
- Más de 5 min:     +0 pts  → Máx: 100
```

## 🔧 Personalización Rápida

### Cambiar Colores

Edita `/styles/globals.css`:
```css
:root {
  --color-background: #F8F9FA;     /* Fondo */
  --color-text-primary: #343A40;   /* Texto */
  --color-accent: #007BFF;         /* Azul principal */
  --color-accent-light: #EBF5FF;   /* Azul claro */
}
```

### Cambiar Tamaño de Matrices

Edita `/components/CreateExercise.tsx` línea 17:
```typescript
// De 3x4 a 4x5:
createEmptyMatrix(4, 5)  // (filas, columnas)
```

### Cambiar Sistema de Puntuación

Edita `/utils/matrixUtils.ts` función `calculateScore`:
```typescript
export const calculateScore = (accuracy: number, timeElapsed: number): number => {
  let score = accuracy;
  
  // Personaliza los bonuses aquí
  if (timeElapsed < 30) {
    score += 30;  // Más difícil = más bonus
  }
  // ...
  
  return Math.min(Math.round(score), 150); // Nuevo máximo
};
```

## 💾 Datos y Almacenamiento

### Ver Datos Guardados

En las DevTools del navegador:
```
1. F12 → Application → Local Storage
2. Verás:
   - gaussjordan_user        (usuario actual)
   - gaussjordan_exercises   (ejercicios)
   - gaussjordan_attempts    (intentos)
   - gaussjordan_sessions    (códigos activos)
```

### Limpiar Datos de Prueba

En la consola del navegador (F12):
```javascript
// Borrar todo
localStorage.clear()

// O borrar selectivamente
localStorage.removeItem('gaussjordan_exercises')
localStorage.removeItem('gaussjordan_attempts')
```

## Próximos Pasos

### Opción A: Usar Como Está (Demo/Prototipo)
✅ Ya funciona 100%
✅ Perfecto para demos y pruebas locales
✅ No necesita configuración adicional

### Opción B: Conectar Base de Datos Real

Para usar en producción con múltiples usuarios:

#### 1️⃣ Supabase (Recomendado - GRATIS)

```bash
# Instalar cliente
npm install @supabase/supabase-js

# Crear cuenta en supabase.com
# Crear proyecto
# Copiar URL y API Key
```

**Configurar autenticación:**
```typescript
// Crear archivo: /lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'TU_SUPABASE_URL',
  'TU_SUPABASE_ANON_KEY'
)
```

**Crear tablas en Supabase:**
```sql
-- Ejercicios
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  title TEXT NOT NULL,
  instructions TEXT NOT NULL,
  matrices JSONB NOT NULL,
  correct_answers JSONB NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Intentos
CREATE TABLE student_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES exercises(id),
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  answers JSONB NOT NULL,
  time_elapsed INTEGER NOT NULL,
  accuracy DECIMAL NOT NULL,
  score INTEGER NOT NULL,
  correct_cells INTEGER NOT NULL,
  total_cells INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2️⃣ Firebase (Alternativa)

```bash
npm install firebase
```

### Opción C: Desplegar Como Está

```bash
# Build para producción
npm run build

# Desplegar en Vercel (gratis)
npm install -g vercel
vercel

# O en Netlify
npm install -g netlify-cli
netlify deploy
```

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Module not found"
```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
```

### ❌ No aparecen los ejercicios creados
- Verifica que no estés en modo incógnito
- Revisa localStorage en DevTools
- Intenta refrescar la página

### ❌ Los códigos de clase no funcionan
- Asegúrate de crear el ejercicio primero
- El código debe tener exactamente 6 caracteres
- Es case-insensitive (ABC123 = abc123)

### ❌ Matrices no se ven bien
- Verifica el navegador (Chrome/Firefox recomendados)
- Prueba con zoom 100%
- Revisa que Tailwind CSS esté cargando

## 📱 Acceso Desde Dispositivos Móviles

```bash
# 1. Inicia el servidor
npm run dev

# 2. Busca tu IP local
# Windows: ipconfig
# Mac/Linux: ifconfig

# 3. Accede desde móvil
# En la misma red WiFi:
http://TU_IP_LOCAL:5173
# Ejemplo: http://192.168.1.100:5173
```

## 🎯 Checklist de Funcionalidades

Marca lo que funciona:

### Profesor
- [x] Login
- [x] Crear ejercicio
- [x] Generar código de clase
- [x] Ver ejercicios creados
- [x] Ver resultados
- [x] Ver estadísticas

### Estudiante
- [x] Login
- [x] Ingresar código
- [x] Ver instrucciones
- [x] Rellenar matriz
- [x] Verificar respuesta
- [x] Feedback visual (verde/rojo)
- [x] Cronómetro
- [x] Puntuación final

### Sistema
- [x] Cálculo de precisión
- [x] Sistema de puntuación
- [x] Almacenamiento de datos
- [x] Navegación entre matrices
- [x] Responsive design

## 📞 ¿Necesitas Ayuda?

### Recursos de Aprendizaje
- **React**: https://react.dev/learn
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Supabase**: https://supabase.com/docs

### Comunidades
- React Discord
- Stack Overflow (tag: react)
- Reddit: r/reactjs

## 🎉 ¡Felicidades!

Tienes una aplicación educativa completa y funcional. Los siguiente pasos dependen de tu caso de uso:

- **Demo/Prototipo**: Ya está listo ✅
- **Uso en Clase Local**: Funciona perfecto ✅
- **Producción Multi-Usuario**: Conecta Supabase 🚀

---

**¿Preguntas? Revisa el archivo README.md para más detalles técnicos.**
