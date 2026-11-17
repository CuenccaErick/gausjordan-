// Datos de demostración para pruebas rápidas
import { Exercise, ClassSession } from '../types';
import { saveExercise, saveSession } from './storage';

export const loadDemoExercises = () => {
  // Verificar si ya existen ejercicios demo
  const existingExercises = localStorage.getItem('gaussjordan_exercises');
  if (existingExercises && JSON.parse(existingExercises).length > 0) {
    return; // Ya hay ejercicios, no cargar demos
  }

  const demoTeacherId = 'demo_teacher_001';
  const demoTeacherName = 'Profesor Demo';

  // Ejercicio 1: Sistema 3x3 Básico
  const exercise1: Exercise = {
    id: 'demo_ex_001',
    teacherId: demoTeacherId,
    teacherName: demoTeacherName,
    title: 'Sistema de Ecuaciones 3x3 - Nivel Básico',
    instructions: 'Reduce la siguiente matriz aumentada a su forma escalonada reducida usando el método de Gauss-Jordan. Cada fila representa una ecuación del sistema.',
    matrices: [
      {
        rows: 3,
        cols: 4,
        values: [
          [2, 1, -1, 8],
          [-3, -1, 2, -11],
          [-2, 1, 2, -3]
        ]
      }
    ],
    correctAnswers: [
      {
        rows: 3,
        cols: 4,
        values: [
          [1, 0, 0, 2],
          [0, 1, 0, 3],
          [0, 0, 1, -1]
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    classCode: 'DEMO01'
  };

  // Ejercicio 2: Sistema 3x3 Intermedio
  const exercise2: Exercise = {
    id: 'demo_ex_002',
    teacherId: demoTeacherId,
    teacherName: demoTeacherName,
    title: 'Sistema de Ecuaciones 3x3 - Nivel Intermedio',
    instructions: 'Resuelve este sistema de ecuaciones lineales aplicando operaciones elementales de fila hasta obtener la forma escalonada reducida.',
    matrices: [
      {
        rows: 3,
        cols: 4,
        values: [
          [1, 2, 1, 4],
          [2, 0, 1, 3],
          [1, 1, 2, 5]
        ]
      }
    ],
    correctAnswers: [
      {
        rows: 3,
        cols: 4,
        values: [
          [1, 0, 0, 0],
          [0, 1, 0, 1],
          [0, 0, 1, 2]
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    classCode: 'DEMO02'
  };

  // Ejercicio 3: Múltiples Matrices
  const exercise3: Exercise = {
    id: 'demo_ex_003',
    teacherId: demoTeacherId,
    teacherName: demoTeacherName,
    title: 'Práctica Múltiple - 3 Sistemas',
    instructions: 'Resuelve los siguientes tres sistemas de ecuaciones. Cada uno requiere el método de Gauss-Jordan para encontrar la solución.',
    matrices: [
      {
        rows: 2,
        cols: 3,
        values: [
          [2, 3, 8],
          [4, 1, 10]
        ]
      },
      {
        rows: 3,
        cols: 4,
        values: [
          [1, 1, 1, 6],
          [2, -1, 1, 3],
          [1, 2, -1, 2]
        ]
      },
      {
        rows: 3,
        cols: 4,
        values: [
          [3, 2, -1, 1],
          [2, -2, 4, -2],
          [-1, 0.5, -1, 0]
        ]
      }
    ],
    correctAnswers: [
      {
        rows: 2,
        cols: 3,
        values: [
          [1, 0, 2],
          [0, 1, 1.33333]
        ]
      },
      {
        rows: 3,
        cols: 4,
        values: [
          [1, 0, 0, 1],
          [0, 1, 0, 2],
          [0, 0, 1, 3]
        ]
      },
      {
        rows: 3,
        cols: 4,
        values: [
          [1, 0, 0, 1],
          [0, 1, 0, 2],
          [0, 0, 1, -2]
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    classCode: 'DEMO03'
  };

  // Ejercicio 4: Sistema 4x4 Avanzado
  const exercise4: Exercise = {
    id: 'demo_ex_004',
    teacherId: demoTeacherId,
    teacherName: demoTeacherName,
    title: 'Sistema 4x4 - Nivel Avanzado',
    instructions: 'Sistema de 4 ecuaciones con 4 incógnitas. Aplica cuidadosamente las operaciones elementales para llegar a la forma escalonada reducida.',
    matrices: [
      {
        rows: 4,
        cols: 5,
        values: [
          [1, 2, 1, 0, 5],
          [2, 1, 0, 1, 4],
          [1, 0, 2, 1, 6],
          [0, 1, 1, 2, 7]
        ]
      }
    ],
    correctAnswers: [
      {
        rows: 4,
        cols: 5,
        values: [
          [1, 0, 0, 0, 1],
          [0, 1, 0, 0, 1],
          [0, 0, 1, 0, 2],
          [0, 0, 0, 1, 2]
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    classCode: 'DEMO04'
  };

  // Ejercicio 5: Sistema Simple 2x2
  const exercise5: Exercise = {
    id: 'demo_ex_005',
    teacherId: demoTeacherId,
    teacherName: demoTeacherName,
    title: 'Sistema 2x2 - Para Principiantes',
    instructions: 'Sistema simple de 2 ecuaciones con 2 incógnitas. Perfecto para practicar los conceptos básicos del método de Gauss-Jordan.',
    matrices: [
      {
        rows: 2,
        cols: 3,
        values: [
          [3, 2, 12],
          [1, -1, 1]
        ]
      }
    ],
    correctAnswers: [
      {
        rows: 2,
        cols: 3,
        values: [
          [1, 0, 2],
          [0, 1, 3]
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    classCode: 'SIMPLE'
  };

  // Guardar ejercicios
  const demoExercises = [exercise1, exercise2, exercise3, exercise4, exercise5];
  
  demoExercises.forEach(exercise => {
    saveExercise(exercise);
    
    // Crear sesión activa para cada ejercicio
    saveSession({
      id: `demo_session_${exercise.id}`,
      code: exercise.classCode,
      exerciseId: exercise.id,
      teacherId: demoTeacherId,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  });

  console.log('✅ Ejercicios de demostración cargados:');
  console.log('📝 DEMO01 - Sistema 3x3 Básico');
  console.log('📝 DEMO02 - Sistema 3x3 Intermedio');
  console.log('📝 DEMO03 - Práctica Múltiple (3 matrices)');
  console.log('📝 DEMO04 - Sistema 4x4 Avanzado');
  console.log('📝 SIMPLE - Sistema 2x2 Para Principiantes');
};

// Lista de códigos disponibles para mostrar
export const DEMO_CODES = {
  SIMPLE: 'Sistema 2x2 - Para Principiantes',
  DEMO01: 'Sistema 3x3 - Nivel Básico',
  DEMO02: 'Sistema 3x3 - Nivel Intermedio', 
  DEMO03: 'Práctica Múltiple - 3 Sistemas',
  DEMO04: 'Sistema 4x4 - Nivel Avanzado',
};
