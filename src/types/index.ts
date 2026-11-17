// Tipos de datos para la aplicación



export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | null;
  avatar?: string;
  matricula?: string;
}

export interface Matrix {
  rows: number;
  cols: number;
  values: (number | null)[][];
  operations?: (string | null)[][];
  isFraction?: boolean[][]; 
}

export interface Exercise {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  instructions: string;
  matrices: Matrix[];
  correctAnswers: Matrix[];
  createdAt: string;
  classCode: string;
}

export interface StudentAttempt {
  id: string;
  exerciseId: string;
  studentId: string;
  studentName: string;
  studentMatricula: string;
  answers: Matrix[];
  timeElapsed: number;
  accuracy: number;
  score: number;
  correctCells: number;
  totalCells: number;
  evidenceUrl?: string;
}

export interface ClassSession {
  id: string;
  code: string;
  exerciseId: string;
  teacherId: string;
  isActive: boolean;
  createdAt: string;
}