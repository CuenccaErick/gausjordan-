# 🚀 QUICKSTART - PROBAR EVIDENCIA EN 5 MINUTOS

Este es el guía más rápida posible para probar el sistema sin esperas.

---

## ⚡ **PRE-REQUISITOS (1 min)**

✅ npm install && npm run dev (ya corriendo en `http://localhost:5173`)
✅ Supabase configurado (bucket `evidence-files` creado y público)
✅ Políticas RLS ejecutadas ([FIX-BD-ERRORS.sql](../FIX-BD-ERRORS.sql))

---

## 🎯 PASO 1: PROFESOR CREA EJERCICIO (2 min)

```
1. Abre http://localhost:5173
2. \"Comienza Aquí\" → \"Soy Profesor\" → Google login
3. \"+ Crear Nuevo Ejercicio\"
   • Título: \"Quick Test\"
   • Instrucciones: \"Reduce\"
   • Dimensiones: 2×2
4. Matriz 1:
   Original: 1,2,3,4
   Correcta: 1,0,0,1
5. \"Guardar Ejercicio\"
   → Anota el CÓDIGO (ej: ABC123)
```

---

## 👨‍🎓 PASO 2: ESTUDIANTE RESUELVE + SUBE EVIDENCIA (2 min)

```
1. Abre VENTANA INCÓGNITO
2. http://localhost:5173
3. \"Comienza Aquí\" → \"Soy Estudiante\" → Continuar
4. Nombre: \"Test\" | Matrícula: \"123\"
5. Ingresa código ABC123
6. \"Comenzar Ejercicio\" → \"Comenzar a Resolver\"
7. RESUELVE:
   Ingresa: 1,0,0,1 (la respuesta correcta)
8. ⭐ SUBE EVIDENCIA:
   • Arrastra una imagen/PDF O click para seleccionar
   • Valida: <10MB, JPG/PNG/PDF
   • Verás: \"✓ Archivo listo para enviar\"
9. \"Verificar Respuesta\" → \"Siguiente Matriz\" (si hay más)
10. VER RESULTADO:
    • Puntuación: 120
    • Precisión: 100%
    • \"✓ Evidencia enviada correctamente\"
```

---

## 👨‍🏫 PASO 3: PROFESOR VE EVIDENCIA (1 min)

```
1. Vuelve a la ventana de PROFESOR
2. \"Resultados\" en tarjeta del ejercicio
3. Tabla muestra: Test | Puntuación 120 | \"Con evidencia\"
4. CLICK EN LA FILA → Se abre MODAL:
   
   VES:
   ├─ Datos: Test | 123 | 120pts | 100% | tiempo
   ├─ MATRICES lado a lado:
   │  ├─ Original (gris)
   │  ├─ Respuesta Test (azul con celdas verdes)
   │  └─ Correcta (verde)
   └─ EVIDENCIA:
      ├─ Si es imagen: ✅ PREVIEW visible
      ├─ Link \"Abrir en nueva pestaña\"
      ├─ Si es PDF: 📄 Botón \"Abrir PDF\"
```

---

## ✅ RESULTADO FINAL

```
✅ Archivo subido a Supabase Storage
✅ URL pública guardada en BD
✅ Profesor ve todo en un bonito modal
✅ Celdas coloreadas (verde/rojo)
---

## ✨ **MEJORAS DE INTERFAZ IMPLEMENTADAS**

### 🎨 **Diseño Profesional**
- **Gradientes modernos** en headers y cards
- **Paleta de colores corporativa** (azul, índigo, púrpura)
- **Sombras suaves** y bordes redondeados
- **Espaciado inteligente** y tipografía mejorada

### 🎭 **Animaciones y Efectos**
- **Fade-in animations** para filas de tabla
- **Hover effects** en botones con transformaciones
- **Loading spinners** personalizados
- **Progress bars** animadas
- **Bounce effects** en interacciones

### 📱 **UX Mejorada**
- **Estados de carga** con indicadores visuales
- **Mensajes de error** informativos
- **Validación de archivos** antes de mostrar
- **Vista previa inteligente** para imágenes
- **Botones contextuales** (Ver/Descargar)

## 🐛 ERRORES COMUNES Y SOLUCIONES

### ❌ "new row violates row-level security policy"

**Problema**: Políticas RLS no permiten usuarios invitados.

**Solución** (2 min):
1. Ve a https://supabase.com/dashboard/project/TU_PROJECT_ID/sql
2. Copia y pega el contenido de `FIX-BD-ERRORS.sql`
3. Click "Run"
4. Reinicia la app: `npm run dev`

### ❌ "invalid input syntax for type uuid: \"guest_...\""

**Problema**: Código envía string "guest_..." en lugar de NULL.

**Solución**: Ya está arreglado en el código. Si persiste:
1. Borra `node_modules` y `npm install`
2. Reinicia VS Code
3. `npm run dev`

### ❌ "Archivo demasiado grande" o "Tipo no soportado"

**Problema**: Validación del archivo falla.

**Solución**: Usa archivos <10MB de tipo JPG/PNG/PDF.

### 🔍 Diagnosticar problemas

Ejecuta `DIAGNOSTIC-BD.sql` en SQL Editor para ver estado de BD.
Si la evidencia no se abre: Ejecuta [VERIFICAR-BUCKET.md](VERIFICAR-BUCKET.md)

---

## 📁 **ARCHIVOS ORGANIZADOS**

Toda la documentación está en la carpeta `docs/`:
- [README.md](README.md) - Inicio organizado
- [SUPABASE-SETUP.md](SUPABASE-SETUP.md) - Configuración BD
- [TESTING-EVIDENCIA.md](TESTING-EVIDENCIA.md) - Guías de testing
- [VERIFICAR-BUCKET.md](VERIFICAR-BUCKET.md) - Diagnóstico de bucket

---

## 🎯 **¿TODO FUNCIONA?**

Si ves:
- ✅ Modal con gradientes y animaciones
- ✅ Evidencia que se abre correctamente
- ✅ Interfaz profesional y moderna

**¡El sistema está listo para producción!** 🚀

Si algo falla, ejecuta [VERIFICAR-BUCKET.md](VERIFICAR-BUCKET.md) para diagnosticar.
   └─ Mejorada UI de evidencia
   └─ Validación de archivo

✅ src/components/ExerciseSession.tsx
   └─ Mejor manejo de errores
   └─ Logs para debugging

📄 SUPABASE-SETUP.md (NUEVO)
   └─ Guía de configuración (30 min)

🧪 TESTING-EVIDENCIA.md (NUEVO)
   └─ Tests detallados (1+ hora)

📋 CAMBIOS-RESUMEN.md (NUEVO)
   └─ Resumen de cambios (lectura rápida)
```

---

## 🔗 PRÓXIMOS PASOS

Después de probar:

1. **Leer [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)**
   - Confirma que está todo bien configurado
   - Setup para producción

2. **Hacer todos los tests en [TESTING-EVIDENCIA.md](./TESTING-EVIDENCIA.md)**
   - Tests más exhaustivos
   - Edge cases
   - Debugging

3. **Deploy a producción**
   - Cambiar variables de entorno
   - Crear tabla/policies en prod
   - Push a main

---

**¿Listo? ¡Prueba el PASO 1 ahora!** 🚀
