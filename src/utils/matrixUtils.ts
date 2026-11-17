// Utilidades para trabajar con matrices

import { Matrix } from '../types';

export const createEmptyMatrix = (rows: number, cols: number): Matrix => {
  return {
    rows,
    cols,
    values: Array(rows).fill(null).map(() => Array(cols).fill(null)),
    operations: Array(rows).fill(null).map(() => Array(cols).fill(null)),
    isFraction: Array(rows).fill(null).map(() => Array(cols).fill(false)),
  };
};

export const compareMatrices = (matrix1: Matrix, matrix2: Matrix): {
  correct: boolean[][];
  accuracy: number;
  correctCells: number;
  totalCells: number;
} => {
  const correct: boolean[][] = [];
  let correctCells = 0;
  let totalCells = 0;

  for (let i = 0; i < matrix1.rows; i++) {
    correct[i] = [];
    for (let j = 0; j < matrix1.cols; j++) {
      const val1 = matrix1.values[i][j];
      const val2 = matrix2.values[i][j];
      
      // Comparar con tolerancia para números flotantes
      const isCorrect = val1 !== null && val2 !== null && 
                       Math.abs(val1 - val2) < 0.001;
      
      correct[i][j] = isCorrect;
      if (isCorrect) correctCells++;
      totalCells++;
    }
  }

  const accuracy = totalCells > 0 ? (correctCells / totalCells) * 100 : 0;

  return { correct, accuracy, correctCells, totalCells };
};

export const calculateScore = (accuracy: number, timeElapsed: number): number => {
  // Puntuación base según precisión (0-100)
  let score = accuracy;
  
  // Bonus por rapidez (máximo 20 puntos extra)
  // Menos de 60 segundos: +20 puntos
  // Menos de 120 segundos: +15 puntos
  // Menos de 180 segundos: +10 puntos
  // Menos de 300 segundos: +5 puntos
  if (timeElapsed < 60) {
    score += 20;
  } else if (timeElapsed < 120) {
    score += 15;
  } else if (timeElapsed < 180) {
    score += 10;
  } else if (timeElapsed < 300) {
    score += 5;
  }

  return Math.min(Math.round(score), 120); // Máximo 120 puntos
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
