export interface PracticeExerciseData {
  id: string;
  category: 'reduccion' | 'escalonada' | 'sistema3x3' | 'sistema2x2';
  title: string;
  description: string;
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  initialMatrix: number[][];
  solutionMatrix: number[][];
  hints: string[];
  steps: {
    description: string;
    operation: string;
    resultMatrix: number[][];
  }[];
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  explanation: string;
  matrix: number[][] | null;
  operation: string | null;
  matrixLabels?: string[];
  highlight?: number[];
  isFinal?: boolean;
}

export const tutorialSteps: TutorialStep[] = [
  {
    stepNumber: 1,
    title: "¿Qué es el método de Gauss-Jordan?",
    explanation:
      "El método de Gauss-Jordan transforma una matriz aumentada [A|b] en su forma escalonada reducida (RREF). Cada fila representa una ecuación y cada columna una variable. El objetivo es obtener la matriz identidad en el lado izquierdo.",
    matrix: null,
    operation: null,
  },
  {
    stepNumber: 2,
    title: "Nuestro sistema de ejemplo",
    explanation:
      "Vamos a resolver este sistema de 3 ecuaciones con 3 incógnitas:\n2x + y - z = 8\n-3x - y + 2z = -11\n-2x + y + 2z = -3\nLo escribimos como matriz aumentada [A|b]:",
    matrix: [
      [2, 1, -1, 8],
      [-3, -1, 2, -11],
      [-2, 1, 2, -3],
    ],
    operation: null,
    matrixLabels: ["x", "y", "z", "="],
  },
  {
    stepNumber: 3,
    title: "Paso 1: Hacer 1 el pivote de la primera columna",
    explanation:
      "El pivote es el primer elemento no cero de cada fila. Dividimos la Fila 1 entre 2 para que el pivote sea 1. Operación: F1 → F1 ÷ 2",
    matrix: [
      [1, 0.5, -0.5, 4],
      [-3, -1, 2, -11],
      [-2, 1, 2, -3],
    ],
    operation: "F1 = F1 ÷ 2",
    highlight: [0],
  },
  {
    stepNumber: 4,
    title: "Paso 2: Eliminar la primera columna en F2",
    explanation:
      "Queremos hacer 0 el elemento (-3) en la posición [2,1]. Sumamos 3 veces la F1 a la F2. Operación: F2 → F2 + 3×F1\n-3 + 3×(1) = 0 ✓\n-1 + 3×(0.5) = 0.5\n2 + 3×(-0.5) = 0.5\n-11 + 3×(4) = 1",
    matrix: [
      [1, 0.5, -0.5, 4],
      [0, 0.5, 0.5, 1],
      [-2, 1, 2, -3],
    ],
    operation: "F2 = F2 + 3×F1",
    highlight: [1],
  },
  {
    stepNumber: 5,
    title: "Paso 3: Eliminar la primera columna en F3",
    explanation:
      "Queremos hacer 0 el elemento (-2) en la posición [3,1]. Sumamos 2 veces la F1 a la F3. Operación: F3 → F3 + 2×F1\n-2 + 2×(1) = 0 ✓\n1 + 2×(0.5) = 2\n2 + 2×(-0.5) = 1\n-3 + 2×(4) = 5",
    matrix: [
      [1, 0.5, -0.5, 4],
      [0, 0.5, 0.5, 1],
      [0, 2, 1, 5],
    ],
    operation: "F3 = F3 + 2×F1",
    highlight: [2],
  },
  {
    stepNumber: 6,
    title: "Paso 4: Hacer 1 el pivote de la segunda columna",
    explanation:
      "Dividimos la F2 entre 0.5 para que el pivote sea 1. Operación: F2 → F2 ÷ 0.5 (equivale a multiplicar por 2)\n0.5÷0.5=1, 0.5÷0.5=1, 1÷0.5=2",
    matrix: [
      [1, 0.5, -0.5, 4],
      [0, 1, 1, 2],
      [0, 2, 1, 5],
    ],
    operation: "F2 = F2 × 2",
    highlight: [1],
  },
  {
    stepNumber: 7,
    title: "Paso 5: Eliminar segunda columna en F1 y F3",
    explanation:
      "Eliminamos el 0.5 de F1 y el 2 de F3 usando F2.\nF1 → F1 - 0.5×F2\nF3 → F3 - 2×F2\nAhora la segunda columna tiene solo 1 en la posición del pivote.",
    matrix: [
      [1, 0, -1, 3],
      [0, 1, 1, 2],
      [0, 0, -1, 1],
    ],
    operation: "F1 = F1 - 0.5×F2 | F3 = F3 - 2×F2",
    highlight: [0, 2],
  },
  {
    stepNumber: 8,
    title: "Paso 6: Hacer 1 el pivote de la tercera columna",
    explanation:
      "Multiplicamos F3 por -1 para que el pivote sea 1. Operación: F3 → F3 × (-1)",
    matrix: [
      [1, 0, -1, 3],
      [0, 1, 1, 2],
      [0, 0, 1, -1],
    ],
    operation: "F3 = F3 × (-1)",
    highlight: [2],
  },
  {
    stepNumber: 9,
    title: "Paso 7: Eliminar tercera columna en F1 y F2",
    explanation:
      "Eliminamos el -1 de F1 y el 1 de F2 usando F3.\nF1 → F1 + F3\nF2 → F2 - F3\n¡Llegamos a la forma escalonada reducida!",
    matrix: [
      [1, 0, 0, 2],
      [0, 1, 0, 3],
      [0, 0, 1, -1],
    ],
    operation: "F1 = F1 + F3 | F2 = F2 - F3",
    highlight: [0, 1, 2],
  },
  {
    stepNumber: 10,
    title: "¡Solución encontrada!",
    explanation:
      "La matriz identidad nos dice la solución:\nx = 2\ny = 3\nz = -1\nVerificación: 2(2) + 3 - (-1) = 4+3+1 = 8 ✓\nEl método de Gauss-Jordan convirtió el sistema en respuestas directas.",
    matrix: [
      [1, 0, 0, 2],
      [0, 1, 0, 3],
      [0, 0, 1, -1],
    ],
    operation: null,
    isFinal: true,
  },
];

export const practiceExercises: PracticeExerciseData[] = [
  {
    id: "ej-2x2-basico",
    category: "sistema2x2",
    title: "Sistema 2×2 Básico",
    description:
      "Sistema simple de 2 ecuaciones con 2 incógnitas. Ideal para comenzar.",
    difficulty: "basico",
    initialMatrix: [
      [2, 1, 5],
      [1, 3, 10],
    ],
    solutionMatrix: [
      [1, 0, 1],
      [0, 1, 3],
    ],
    hints: [
      "Divide la primera fila entre 2 para obtener un pivote de 1",
      "Usa la primera fila para eliminar el 1 de la segunda fila en la primera columna",
      "El resultado es x=1, y=3",
    ],
    steps: [
      {
        description: "Dividir F1 entre 2",
        operation: "F1 = F1 ÷ 2",
        resultMatrix: [
          [1, 0.5, 2.5],
          [1, 3, 10],
        ],
      },
      {
        description: "Eliminar primera columna en F2",
        operation: "F2 = F2 - F1",
        resultMatrix: [
          [1, 0.5, 2.5],
          [0, 2.5, 7.5],
        ],
      },
      {
        description: "Hacer pivote 1 en segunda columna",
        operation: "F2 = F2 ÷ 2.5",
        resultMatrix: [
          [1, 0.5, 2.5],
          [0, 1, 3],
        ],
      },
      {
        description: "Eliminar segunda columna en F1",
        operation: "F1 = F1 - 0.5×F2",
        resultMatrix: [
          [1, 0, 1],
          [0, 1, 3],
        ],
      },
    ],
  },
  {
    id: "ej-3x3-intermedio",
    category: "sistema3x3",
    title: "Sistema 3×3 Clásico",
    description:
      "El sistema clásico del tutorial. Practica los 7 pasos completos.",
    difficulty: "intermedio",
    initialMatrix: [
      [2, 1, -1, 8],
      [-3, -1, 2, -11],
      [-2, 1, 2, -3],
    ],
    solutionMatrix: [
      [1, 0, 0, 2],
      [0, 1, 0, 3],
      [0, 0, 1, -1],
    ],
    hints: [
      "Comienza dividiendo la F1 entre 2 para obtener pivote 1",
      "Elimina la primera columna en F2 con F2 + 3×F1",
      "Elimina la primera columna en F3 con F3 + 2×F1",
      "La solución es x=2, y=3, z=-1",
    ],
    steps: [
      {
        description: "Dividir F1 entre 2",
        operation: "F1 = F1 ÷ 2",
        resultMatrix: [
          [1, 0.5, -0.5, 4],
          [-3, -1, 2, -11],
          [-2, 1, 2, -3],
        ],
      },
      {
        description: "Eliminar col 1 en F2",
        operation: "F2 = F2 + 3×F1",
        resultMatrix: [
          [1, 0.5, -0.5, 4],
          [0, 0.5, 0.5, 1],
          [-2, 1, 2, -3],
        ],
      },
      {
        description: "Eliminar col 1 en F3",
        operation: "F3 = F3 + 2×F1",
        resultMatrix: [
          [1, 0.5, -0.5, 4],
          [0, 0.5, 0.5, 1],
          [0, 2, 1, 5],
        ],
      },
      {
        description: "Pivote 1 en col 2",
        operation: "F2 = F2 × 2",
        resultMatrix: [
          [1, 0.5, -0.5, 4],
          [0, 1, 1, 2],
          [0, 2, 1, 5],
        ],
      },
      {
        description: "Eliminar col 2 en F1 y F3",
        operation: "F1=F1-0.5×F2 | F3=F3-2×F2",
        resultMatrix: [
          [1, 0, -1, 3],
          [0, 1, 1, 2],
          [0, 0, -1, 1],
        ],
      },
      {
        description: "Pivote 1 en col 3",
        operation: "F3 = F3 × (-1)",
        resultMatrix: [
          [1, 0, -1, 3],
          [0, 1, 1, 2],
          [0, 0, 1, -1],
        ],
      },
      {
        description: "Eliminar col 3 en F1 y F2",
        operation: "F1=F1+F3 | F2=F2-F3",
        resultMatrix: [
          [1, 0, 0, 2],
          [0, 1, 0, 3],
          [0, 0, 1, -1],
        ],
      },
    ],
  },
  {
    id: "ej-3x3-avanzado",
    category: "reduccion",
    title: "Reducción con Fracciones",
    description:
      "Sistema que genera fracciones en los pasos intermedios.",
    difficulty: "avanzado",
    initialMatrix: [
      [1, 2, 1, 0],
      [2, 1, -1, 1],
      [1, -1, 2, 2],
    ],
    solutionMatrix: [
      [1, 0, 0, 1],
      [0, 1, 0, -0.333],
      [0, 0, 1, 0],
    ],
    hints: [
      "El pivote de F1 ya es 1, empieza eliminando la primera columna en F2 y F3",
      "F2 = F2 - 2×F1 y F3 = F3 - F1",
      "Tendrás fracciones en los pasos intermedios, usa el botón de fracción",
      "La solución aproximada es x≈1, y≈-1/3, z≈0",
    ],
    steps: [
      {
        description: "Eliminar col 1 en F2",
        operation: "F2 = F2 - 2×F1",
        resultMatrix: [
          [1, 2, 1, 0],
          [0, -3, -3, 1],
          [1, -1, 2, 2],
        ],
      },
      {
        description: "Eliminar col 1 en F3",
        operation: "F3 = F3 - F1",
        resultMatrix: [
          [1, 2, 1, 0],
          [0, -3, -3, 1],
          [0, -3, 1, 2],
        ],
      },
      {
        description: "Pivote 1 en col 2",
        operation: "F2 = F2 ÷ (-3)",
        resultMatrix: [
          [1, 2, 1, 0],
          [0, 1, 1, -0.333],
          [0, -3, 1, 2],
        ],
      },
      {
        description: "Eliminar col 2 en F1 y F3",
        operation: "F1=F1-2×F2 | F3=F3+3×F2",
        resultMatrix: [
          [1, 0, -1, 0.667],
          [0, 1, 1, -0.333],
          [0, 0, 4, 1],
        ],
      },
      {
        description: "Pivote 1 en col 3",
        operation: "F3 = F3 ÷ 4",
        resultMatrix: [
          [1, 0, -1, 0.667],
          [0, 1, 1, -0.333],
          [0, 0, 1, 0.25],
        ],
      },
      {
        description: "Eliminar col 3 en F1 y F2",
        operation: "F1=F1+F3 | F2=F2-F3",
        resultMatrix: [
          [1, 0, 0, 1],
          [0, 1, 0, -0.333],
          [0, 0, 1, 0],
        ],
      },
    ],
  },
  {
    id: "ej-escalonada-basico",
    category: "escalonada",
    title: "Forma Escalonada Simple",
    description:
      "Lleva esta matriz a su forma escalonada reducida.",
    difficulty: "basico",
    initialMatrix: [
      [1, 2, -1, 3],
      [2, 4, 1, 8],
      [-1, -2, 3, 1],
    ],
    solutionMatrix: [
      [1, 2, 0, 3.5],
      [0, 0, 1, 0.5],
      [0, 0, 0, 0],
    ],
    hints: [
      "El pivote de F1 ya es 1",
      "F2 = F2 - 2×F1 te dará una fila de ceros en las primeras columnas",
      "F3 = F3 + F1",
      "Este sistema tiene infinitas soluciones porque hay una fila de ceros",
    ],
    steps: [
      {
        description: "Eliminar col 1 en F2",
        operation: "F2 = F2 - 2×F1",
        resultMatrix: [
          [1, 2, -1, 3],
          [0, 0, 3, 2],
          [-1, -2, 3, 1],
        ],
      },
      {
        description: "Eliminar col 1 en F3",
        operation: "F3 = F3 + F1",
        resultMatrix: [
          [1, 2, -1, 3],
          [0, 0, 3, 2],
          [0, 0, 2, 4],
        ],
      },
      {
        description: "Pivote col 3 F2",
        operation: "F2 = F2 ÷ 3",
        resultMatrix: [
          [1, 2, -1, 3],
          [0, 0, 1, 0.667],
          [0, 0, 2, 4],
        ],
      },
      {
        description: "Eliminar col 3 en F1 y F3",
        operation: "F1=F1+F2 | F3=F3-2×F2",
        resultMatrix: [
          [1, 2, 0, 3.667],
          [0, 0, 1, 0.667],
          [0, 0, 0, 2.667],
        ],
      },
    ],
  },
];
