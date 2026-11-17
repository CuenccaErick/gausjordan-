// Utilidades para manejar localStorage como base de datos simulada

import { User, Exercise, StudentAttempt, ClassSession } from '../types';

const STORAGE_KEYS = {
  USER: 'gaussjordan_user',
  EXERCISES: 'gaussjordan_exercises',
  ATTEMPTS: 'gaussjordan_attempts',
  SESSIONS: 'gaussjordan_sessions',
};

// Usuario
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const clearUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Ejercicios
export const saveExercise = (exercise: Exercise): void => {
  const exercises = getExercises();
  exercises.push(exercise);
  localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
};

export const getExercises = (): Exercise[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
  return data ? JSON.parse(data) : [];
};

export const getExerciseById = (id: string): Exercise | null => {
  const exercises = getExercises();
  return exercises.find(ex => ex.id === id) || null;
};

export const getExercisesByTeacher = (teacherId: string): Exercise[] => {
  const exercises = getExercises();
  return exercises.filter(ex => ex.teacherId === teacherId);
};

// Intentos de estudiantes
export const saveAttempt = (attempt: StudentAttempt): void => {
  const attempts = getAttempts();
  attempts.push(attempt);
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
};

export const getAttempts = (): StudentAttempt[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
  return data ? JSON.parse(data) : [];
};

export const getAttemptsByExercise = (exerciseId: string): StudentAttempt[] => {
  const attempts = getAttempts();
  return attempts.filter(att => att.exerciseId === exerciseId);
};

export const getAttemptsByStudent = (studentId: string): StudentAttempt[] => {
  const attempts = getAttempts();
  return attempts.filter(att => att.studentId === studentId);
};

// Sesiones de clase
export const saveSession = (session: ClassSession): void => {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
};

export const getSessions = (): ClassSession[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
};

export const getSessionByCode = (code: string): ClassSession | null => {
  const sessions = getSessions();
  return sessions.find(s => s.code === code && s.isActive) || null;
};

export const generateClassCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
