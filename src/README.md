#  Gauss-Jordan Academy

Plataforma web educativa para enseñar y practicar el método de Gauss-Jordan en Álgebra Lineal.

##  Descripción

Gauss-Jordan Academy es una aplicación web interactiva que permite a profesores crear ejercicios de matrices y a estudiantes resolverlos en tiempo real, con verificación automática y seguimiento de resultados.

##  Características Principales

### Para Profesores
-  **Crear ejercicios** con múltiples matrices
-  **Generar códigos de clase** tipo Kahoot (6 caracteres)
-  **Definir respuestas correctas** (forma escalonada reducida)
-  **Ver resultados** de estudiantes en tiempo real
-  **Estadísticas detalladas**: puntuación, precisión, tiempo, aciertos

### Para Estudiantes
-  **Ingresar con código de clase**
-  **Ver instrucciones** del ejercicio
-  **Rellenar matrices** con interfaz intuitiva
-  **Verificar respuestas** (verde = correcto, rojo = incorrecto)
-  **Sistema de puntuación** basado en precisión y tiempo
-  **Cronómetro** para medir tiempo de resolución

##  Estructura del Proyecto

```
/
├── App.tsx                          # Router principal y lógica de autenticación
├── types/
│   └── index.ts                     # Tipos TypeScript (User, Exercise, Matrix, etc.)
├── utils/
│   ├── storage.ts                   # Gestión de localStorage (simula BD)
│   └── matrixUtils.ts               # Utilidades para matrices (comparar, puntuar)
├── components/
│   ├── GoogleIcon.tsx               # Icono de Google
│   ├── Login.tsx                    # Pantalla de login (simulado)
│   ├── RoleSelection.tsx            # Selección de rol (profesor/estudiante)
│   ├── TeacherDashboard.tsx         # Dashboard del profesor
│   ├── StudentDashboard.tsx         # Dashboard del estudiante
│   ├── CreateExercise.tsx           # Crear nuevo ejercicio (profesor)
│   ├── MatrixInput.tsx              # Componente de input de matriz
│   ├── ExerciseSession.tsx          # Sesión de ejercicio (estudiante)
│   └── ResultsView.tsx              # Vista de resultados (profesor)
└── styles/
    └── globals.css                  # Estilos globales y variables CSS
```

##  Tecnologías Utilizadas

- **React** con TypeScript: Framework principal
- **Tailwind CSS**: Estilos y diseño responsivo
- **Lucide React**: Iconos
- **LocalStorage**: Persistencia de datos (frontend)

##  Sistema de Almacenamiento

La aplicación utiliza **localStorage** del navegador para simular una base de datos. Los datos se almacenan en 4 categorías:

1. **Usuario** (`gaussjordan_user`): Información del usuario actual
2. **Ejercicios** (`gaussjordan_exercises`): Ejercicios creados por profesores
3. **Intentos** (`gaussjordan_attempts`): Respuestas de estudiantes
4. **Sesiones** (`gaussjordan_sessions`): Códigos de clase activos

### Migración a Base de Datos Real

Para producción, puedes migrar fácilmente a:
- **Supabase** (recomendado): PostgreSQL + autenticación
- **Firebase**: Firestore + Auth
- **MongoDB Atlas**: Base de datos NoSQL
- **Google Sheets API**: Para integración con hojas de cálculo

Todos los métodos en `/utils/storage.ts` están preparados para ser reemplazados por llamadas a API.

##  Flujo de Uso

### Profesor

1. **Iniciar sesión** (simulado con Google)
2. **Seleccionar rol**: "Soy Profesor"
3. **Crear ejercicio**:
   - Título e instrucciones
   - Agregar matrices (problema y solución)
   - Guardar y obtener código de clase
4. **Ver resultados**:
   - Estadísticas generales
   - Lista de intentos por estudiante
   - Detalles: puntuación, precisión, tiempo

### Estudiante

1. **Iniciar sesión** (simulado con Google)
2. **Seleccionar rol**: "Soy Estudiante"
3. **Ingresar código de clase** (6 caracteres)
4. **Resolver ejercicio**:
   - Leer instrucciones
   - Rellenar matrices una por una
   - Verificar respuestas (feedback inmediato)
   - Navegar entre matrices
5. **Ver resultados finales**:
   - Puntuación total (máx. 120 pts)
   - Precisión (%)
   - Tiempo empleado
   - Celdas correctas

##  Sistema de Puntuación

```
Puntuación Base = Precisión (0-100%)

Bonus por Rapidez:
- < 60 segundos:  +20 puntos
- < 120 segundos: +15 puntos
- < 180 segundos: +10 puntos
- < 300 segundos: +5 puntos

Puntuación Máxima = 120 puntos
```

##  Configuración de VS Code

### Extensiones Recomendadas
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### Configuración de Debug

Crea `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

##  Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview

# Linting
npm run lint
```

##  Autenticación con Google (Producción)

Para implementar autenticación real con Google:

### Opción 1: Supabase (Recomendado)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

// Login con Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
})
```

### Opción 2: Firebase Auth

```typescript
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const auth = getAuth();

signInWithPopup(auth, provider)
  .then((result) => {
    const user = result.user;
    // Guardar usuario en estado
  });
```

##  Estructura de Datos

### Matriz
```typescript
interface Matrix {
  rows: number;
  cols: number;
  values: (number | null)[][];
}
```

### Ejercicio
```typescript
interface Exercise {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  instructions: string;
  matrices: Matrix[];           // Matrices problema
  correctAnswers: Matrix[];      // Soluciones
  createdAt: string;
  classCode: string;             // Código de 6 caracteres
}
```

### Intento de Estudiante
```typescript
interface StudentAttempt {
  id: string;
  exerciseId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  answers: Matrix[];
  startTime: string;
  endTime: string | null;
  timeElapsed: number;           // En segundos
  accuracy: number;              // Porcentaje (0-100)
  score: number;                 // Puntuación (0-120)
  correctCells: number;
  totalCells: number;
}
```

##  Paleta de Colores

```css
/* Colores principales */
--color-background: #F8F9FA       /* Fondo general */
--color-text-primary: #343A40     /* Texto principal */
--color-accent: #007BFF           /* Azul de acento */
--color-accent-light: #EBF5FF     /* Azul claro */

/* Gradientes */
Profesor: from-blue-400 to-blue-600
Estudiante: from-indigo-400 to-indigo-600
Éxito: from-green-500 to-green-600
```

##  Troubleshooting

### Los datos no se guardan
- **Problema**: localStorage está deshabilitado o en modo privado
- **Solución**: Verificar configuración del navegador o usar base de datos real

### Matrices no se muestran correctamente
- **Problema**: Valores null en la matriz
- **Solución**: Inicializar con `createEmptyMatrix(rows, cols)`

### Códigos de clase no funcionan
- **Problema**: Sesión no está activa
- **Solución**: Verificar que `isActive: true` en la sesión

##  Responsividad

La aplicación es completamente responsiva:
- **Desktop**: Experiencia completa con layouts de múltiples columnas
- **Tablet**: Grid adaptativo 
- **Mobile**: Stack vertical, navegación optimizada

##  Próximas Mejoras

- [ ] Autenticación real con Google OAuth
- [ ] Base de datos PostgreSQL/Firebase
- [ ] Exportar resultados a Excel/PDF
- [ ] Chat en tiempo real profesor-estudiante
- [ ] Modo colaborativo (varios estudiantes misma matriz)
- [ ] Historial de ejercicios por estudiante
- [ ] Temas personalizables (dark mode)
- [ ] Notificaciones push
- [ ] Sistema de logros y badges
- [ ] Diferentes tipos de ejercicios (determinantes, inversas, etc.)

##  Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

##  Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

##  Contacto

Para preguntas o sugerencias, contacta a través de los issues del repositorio.

---

**Desarrollado con ❤️ para la educación matemática**
