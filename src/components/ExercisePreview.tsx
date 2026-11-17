import { ArrowLeft, Copy, Check, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Exercise } from '../types';
import { MatrixInput } from './MatrixInput';

interface ExercisePreviewProps {
  exercise: Exercise;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ExercisePreview({ exercise, onBack, onEdit, onDelete }: ExercisePreviewProps) {
  const [copied, setCopied] = useState(false);

  // CORRECCIÓN: Mapear respuestas si vienen de Supabase como correct_answers
  const displayCorrectAnswers = exercise.correctAnswers || (exercise as any).correct_answers;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exercise.classCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
          <div className="flex gap-2">
            {onEdit && (
              <button onClick={onEdit} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 flex items-center gap-2 transition-colors">
                <Settings className="w-4 h-4" /> Editar
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center gap-2 transition-colors">
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white text-center">
          <p className="text-sm opacity-90 mb-2">Código de Clase</p>
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-5xl tracking-widest font-bold">{exercise.classCode}</h1>
            <button onClick={handleCopyCode} className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-colors">
              {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            </button>
          </div>
          <p className="text-sm opacity-90 mt-4">Comparte este código con tus estudiantes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl text-[#343A40] mb-4 font-bold">{exercise.title}</h2>
          <div className="mb-6">
            <h3 className="text-sm text-gray-600 mb-2 font-bold">Instrucciones</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{exercise.instructions}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Matrices</p>
              <p className="text-2xl text-blue-600 font-bold">{exercise.matrices.length}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Creado</p>
              <p className="text-sm text-indigo-600 font-bold">{new Date(exercise.createdAt).toLocaleDateString('es-ES')}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Profesor</p>
              <p className="text-sm text-purple-600 font-bold">{exercise.teacherName || "Academia"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl text-[#343A40] mb-6 font-bold">Vista Previa de Matrices</h3>
          <div className="space-y-8">
            {exercise.matrices.map((matrix, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <h4 className="text-sm text-gray-700 mb-4 font-bold">Matriz {index + 1}</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-600 mb-3">Matriz Inicial</p>
                    <div className="bg-white rounded-lg p-4 flex justify-center shadow-inner">
                      <MatrixInput matrix={matrix} onChange={() => {}} editable={false} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-green-700 mb-3 font-bold">Respuesta Correcta</p>
                    <div className="bg-green-50 rounded-lg p-4 flex justify-center border border-green-200">
                      <MatrixInput matrix={displayCorrectAnswers[index]} onChange={() => {}} editable={false} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}