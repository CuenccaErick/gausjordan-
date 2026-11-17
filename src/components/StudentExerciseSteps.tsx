import { useState } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import { Matrix } from '../types';
import { MatrixInput } from './MatrixInput';

interface StepProps {
  stepNumber?: number;
  title: string;
  description: string;
  onNext: () => void;
}

// Paso 1: Bienvenida e Instrucciones
export function WelcomeStep({ title, description, onNext }: StepProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-3xl">📚</span>
          </div>
          <h1 className="text-3xl text-[#343A40] mb-4">{title}</h1>
          <p className="text-gray-600 text-lg">¡Prepárate para resolver las matrices!</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
          <h3 className="text-blue-900 mb-2">Instrucciones:</h3>
          <p className="text-blue-800">{description}</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-indigo-600 text-sm">1</span>
            </div>
            <div>
              <p className="text-[#343A40]">Lee las instrucciones cuidadosamente</p>
              <p className="text-sm text-gray-600">Asegúrate de entender qué se te pide hacer</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-indigo-600 text-sm">2</span>
            </div>
            <div>
              <p className="text-[#343A40]">Completa cada matriz paso a paso</p>
              <p className="text-sm text-gray-600">Aplica el método de Gauss-Jordan correctamente</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-indigo-600 text-sm">3</span>
            </div>
            <div>
              <p className="text-[#343A40]">Verifica tus respuestas</p>
              <p className="text-sm text-gray-600">Recibirás feedback inmediato: verde = correcto, rojo = revisar</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-indigo-600 text-sm">4</span>
            </div>
            <div>
              <p className="text-[#343A40]">¡Obtén tu puntuación!</p>
              <p className="text-sm text-gray-600">Tu precisión y velocidad determinarán tu puntaje final</p>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          Comenzar Ejercicio
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Paso 2: Visualización de Matriz Problema
interface ViewProblemStepProps {
  matrix: Matrix;
  matrixNumber: number;
  totalMatrices: number;
  onNext: () => void;
}

export function ViewProblemStep({ matrix, matrixNumber, totalMatrices, onNext }: ViewProblemStepProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-12">
        <div className="text-center mb-8">
          <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm mb-4">
            Matriz {matrixNumber} de {totalMatrices}
          </div>
          <h2 className="text-2xl text-[#343A40] mb-2">Matriz Inicial</h2>
          <p className="text-gray-600">Esta es la matriz que debes resolver</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          <div className="flex justify-center">
            <MatrixInput matrix={matrix} onChange={() => { }} editable={false} />
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 text-sm">
            💡 <strong>Recuerda:</strong> Debes reducir esta matriz a su forma escalonada reducida usando operaciones elementales de fila.
          </p>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          Comenzar a Resolver
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Paso 3: Resolver Matriz
interface SolveMatrixStepProps {
  problemMatrix: Matrix;
  studentAnswer: Matrix;
  matrixNumber: number;
  totalMatrices: number;
  onAnswerChange: (matrix: Matrix) => void;
  onVerify: () => void;
  evidenceFile: File | null;
  onEvidenceChange: (file: File | null) => void;
  isLastMatrix: boolean;
  isSubmitting: boolean;
}

export function SolveMatrixStep({
  problemMatrix,
  studentAnswer,
  matrixNumber,
  totalMatrices,
  onAnswerChange,
  onVerify,
  evidenceFile,
  onEvidenceChange,
  isLastMatrix,
  isSubmitting,
}: SolveMatrixStepProps) {

  const isFilled = studentAnswer.values.every(row =>
    row.every(cell => cell !== null)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm mb-4">
              Matriz {matrixNumber} de {totalMatrices}
            </div>
            <h2 className="text-2xl text-[#343A40] mb-2">Resuelve la Matriz</h2>
            <p className="text-gray-600">Ingresa la forma escalonada reducida</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm text-gray-600 mb-4 text-center">Matriz Original</h3>
              <div className="bg-gray-50 rounded-xl p-6 flex justify-center">
                <MatrixInput matrix={problemMatrix} onChange={() => { }} editable={false} />
              </div>
            </div>
            <div>
              <h3 className="text-sm text-indigo-600 mb-4 text-center">Tu Respuesta</h3>
              <div className="bg-indigo-50 rounded-xl p-6 flex justify-center border-2 border-indigo-200">
                <MatrixInput matrix={studentAnswer} onChange={onAnswerChange} editable={true} />
              </div>
            </div>
          </div>



          <button
            onClick={onVerify}
            disabled={!isFilled || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold"
          >
            {isSubmitting ? (
              <span>Enviando...</span>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Verificar Respuesta
              </>
            )}
          </button>

          {!isFilled && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Completa todos los valores para poder verificar
            </p>
          )}

          {/* Sección de Evidencia — al fondo del formulario */}
          <div className="mt-8 border-t border-gray-100 pt-8">
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-gray-700">
                  Sube tu procedimiento (Opcional)
                </label>
                {isLastMatrix && (
                  <span style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    ⚠️ Última Matriz
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', marginBottom: '12px' }}>
                Foto de tu libreta o PDF con el desarrollo de Gauss-Jordan (máx 10MB - JPG, PNG, PDF)
              </p>

              {evidenceFile ? (
                <div
                  style={{
                    border: '2px solid #16a34a',
                    borderRadius: '12px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 0 4px rgba(22,163,74,0.15)',
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(22,163,74,0.5)' }}>
                    <Check style={{ width: '24px', height: '24px', color: '#fff' }} />
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#15803d', textAlign: 'center' }}>
                    ✅ ¡Evidencia lista!
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#166534', textAlign: 'center', wordBreak: 'break-word', maxWidth: '280px' }}>
                    {evidenceFile.name}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#4ade80' }}>
                    {(evidenceFile.size / 1024 / 1024).toFixed(2)} MB · Listo para enviar
                  </p>
                  <button
                    onClick={() => onEvidenceChange(null)}
                    style={{ marginTop: '8px', fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    Cambiar archivo
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="evidence-upload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    border: '2px dashed #dc2626',
                    borderRadius: '12px',
                    padding: '24px',
                    background: 'linear-gradient(135deg, #fff5f5, #fee2e2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLLabelElement).style.boxShadow = '0 0 0 4px rgba(220,38,38,0.15)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLLabelElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(220,38,38,0.4)' }}>
                    <svg style={{ width: '24px', height: '24px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#dc2626' }}>📎 Subir Evidencia</p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>Haz clic o arrastra tu archivo aquí</p>
                  </div>
                  <input
                    id="evidence-upload"
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          alert('El archivo es demasiado grande (máx 10MB)');
                          e.target.value = '';
                          return;
                        }
                        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
                        if (!validTypes.includes(file.type)) {
                          alert('Formato no soportado. Usa JPG, PNG, GIF, WEBP o PDF');
                          e.target.value = '';
                          return;
                        }
                        onEvidenceChange(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Paso 4: Resultado de Verificación
interface VerificationResultStepProps {
  problemMatrix: Matrix;
  studentAnswer: Matrix;
  correctAnswer: Matrix;
  correctness: boolean[][];
  accuracy: number;
  correctCells: number;
  totalCells: number;
  matrixNumber: number;
  totalMatrices: number;
  onContinue: () => void;
  onRetry: () => void;
}

export function VerificationResultStep({
  problemMatrix,
  studentAnswer,
  correctAnswer,
  correctness,
  accuracy,
  correctCells,
  totalCells,
  matrixNumber,
  totalMatrices,
  onContinue,
  onRetry,
}: VerificationResultStepProps) {
  const isPerfect = accuracy === 100;
  const isGood = accuracy >= 70;
  const isLast = matrixNumber === totalMatrices;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">

          <div className="text-center mb-8">
            <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm mb-4">
              Matriz {matrixNumber} de {totalMatrices}
            </div>
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${isPerfect ? 'bg-green-100' : isGood ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
              {isPerfect
                ? <Check className="w-10 h-10 text-green-600" />
                : isGood
                  ? <Check className="w-10 h-10 text-yellow-600" />
                  : <X className="w-10 h-10 text-red-600" />}
            </div>
            <h2 className="text-2xl font-bold text-[#343A40] mb-1">
              {isPerfect ? '¡Perfecto!' : isGood ? '¡Bien hecho!' : 'Sigue practicando'}
            </h2>
            <p className="text-gray-500 text-sm">
              {correctCells} de {totalCells} celdas correctas — {accuracy.toFixed(1)}%
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <h3 className="text-xs text-gray-500 font-bold mb-3 text-center uppercase tracking-wider">
                Matriz Original
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 flex justify-center">
                <MatrixInput matrix={problemMatrix} onChange={() => { }} editable={false} />
              </div>
            </div>
            <div>
              <h3 className="text-xs text-indigo-600 font-bold mb-3 text-center uppercase tracking-wider">
                Tu Respuesta
              </h3>
              <div className="bg-indigo-50 rounded-xl p-4 flex justify-center border-2 border-indigo-200">
                <MatrixInput
                  matrix={studentAnswer}
                  onChange={() => { }}
                  editable={false}
                  correctness={correctness}
                  highlightCorrect={true}
                />
              </div>
            </div>
            <div>
              <h3 className="text-xs text-green-600 font-bold mb-3 text-center uppercase tracking-wider">
                Respuesta Correcta
              </h3>
              <div className="bg-green-50 rounded-xl p-4 flex justify-center border-2 border-green-200">
                <MatrixInput matrix={correctAnswer} onChange={() => { }} editable={false} />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Precisión</span>
              <span className="font-bold">{accuracy.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${isPerfect ? 'bg-green-500' : isGood ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                style={{ width: `${Math.min(accuracy, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            {!isPerfect && (
              <button
                onClick={onRetry}
                className="flex-1 border-2 border-indigo-300 text-indigo-600 px-6 py-4 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Reintentar
              </button>
            )}
            <button
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-4 rounded-lg font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              {isLast ? 'Finalizar Ejercicio' : 'Siguiente Matriz'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}