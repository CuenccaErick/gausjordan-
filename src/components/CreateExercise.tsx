import { useState } from 'react';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import { User, Exercise, Matrix } from '../types';
import { supabase } from '../lib/supabaseClient'; 
import { createEmptyMatrix } from '../utils/matrixUtils';
import { MatrixInput } from './MatrixInput';

interface CreateExerciseProps {
  user: User;
  onBack: () => void;
  onExerciseCreated: () => void;
}

export function CreateExercise({ user, onBack, onExerciseCreated }: CreateExerciseProps) {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [matrices, setMatrices] = useState<Matrix[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<Matrix[]>([]); // Variable con A mayúscula
  const [newMatrixRows, setNewMatrixRows] = useState(3);
  const [newMatrixCols, setNewMatrixCols] = useState(3);

  const handleAddMatrix = () => {
    const newMatrix = createEmptyMatrix(newMatrixRows, newMatrixCols);
    setMatrices([...matrices, newMatrix]);
    setCorrectAnswers([...correctAnswers, createEmptyMatrix(newMatrixRows, newMatrixCols)]);
  };

  const handleRemoveMatrix = (index: number) => {
    setMatrices(matrices.filter((_, i) => i !== index));
    setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim() || !instructions.trim() || matrices.length === 0) {
      alert('Por favor completa todos los campos');
      return;
    }

    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // EXPLICACIÓN DEL FIX:
    // Columna BD: correct_answers
    // Variable React: correctAnswers
    const { error } = await supabase
      .from('exercises')
      .insert([{
        teacher_id: user.id,
        title: title,
        instructions: instructions,
        class_code: classCode,
        matrices: matrices, 
        correct_answers: correctAnswers // <--- Aquí estaba el error. Ahora está corregido.
      }]);

    if (error) {
      alert('Error de Supabase: ' + error.message);
    } else {
      alert(`¡Ejercicio guardado!\nCódigo: ${classCode}`);
      onExerciseCreated();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-12">
      <header className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" /> Volver al Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-8">
            <h1 className="text-2xl text-[#343A40] mb-2 font-bold">Crear Nuevo Ejercicio</h1>
            <p className="text-gray-600 text-sm">Define el título, instrucciones y matrices</p>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2 font-medium">Título del Ejercicio</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ej: Sistema de Ecuaciones" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none focus:bg-white" />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2 font-medium">Instrucciones</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none focus:bg-white resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl text-[#343A40] mb-6 font-semibold">Matrices del Ejercicio</h2>
          {matrices.map((matrix, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gray-50 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-700 font-bold">Matriz {index + 1} ({matrix.rows}x{matrix.cols})</h3>
                <button onClick={() => handleRemoveMatrix(index)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="mb-6">
                <p className="text-xs text-gray-600 mb-3">Matriz Inicial (Problema)</p>
                <div className="flex justify-center bg-white rounded-lg p-4">
                  <MatrixInput matrix={matrix} onChange={(m) => { const n = [...matrices]; n[index] = m; setMatrices(n); }} editable={true} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-3">Matriz Solución (Respuesta Correcta)</p>
                <div className="flex justify-center bg-white rounded-lg p-4">
                  <MatrixInput matrix={correctAnswers[index]} onChange={(a) => { const n = [...correctAnswers]; n[index] = a; setCorrectAnswers(n); }} editable={true} />
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm text-gray-700 mb-4 font-medium">Agregar Nueva Matriz</h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-2">Filas</label>
                <input type="number" min="2" max="10" value={newMatrixRows} onChange={(e) => setNewMatrixRows(parseInt(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-2">Columnas</label>
                <input type="number" min="2" max="10" value={newMatrixCols} onChange={(e) => setNewMatrixCols(parseInt(e.target.value))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <button onClick={handleAddMatrix} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 font-bold">+ Agregar Matriz</button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleSave} className="flex-1 bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition-all shadow-md font-bold flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> Guardar Ejercicio
          </button>
          <button onClick={onBack} className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-lg font-bold">Cancelar</button>
        </div>
      </main>
    </div>
  );
}