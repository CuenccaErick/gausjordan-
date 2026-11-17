import { useState } from 'react';
import { LogOut, Play, Code, UserCircle, Hash } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabaseClient';
import { DEMO_CODES } from '../utils/demoData';
import { ExerciseSession } from './ExerciseSession';
import { Logo } from './Logo';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [classCode, setClassCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [error, setError] = useState('');
  const [activeExercise, setActiveExercise] = useState<any>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);

  const handleJoinClass = async () => {
    if (!classCode.trim()) {
      setError('Por favor ingresa un código de clase');
      return;
    }

    // Búsqueda real en la base de datos
    const { data, error: dbError } = await supabase
      .from('exercises')
      .select('*')
      .eq('class_code', classCode.toUpperCase())
      .single();

    if (dbError || !data) {
      setError('Código de clase no válido o inactivo');
      return;
    }

    // CORRECCIÓN TÉCNICA: Mapeamos el nombre de la columna SQL al nombre que espera el componente
    const mappedExercise = {
      ...data,
      correctAnswers: data.correct_answers // Traducimos snake_case a camelCase
    };

    setActiveExercise(mappedExercise);
    setIsIdentifying(true);
    setError('');
  };

  const handleFinishSetup = () => {
    if (!studentName.trim() || !matricula.trim()) {
      setError('Nombre y Matrícula son obligatorios');
      return;
    }
    setIsIdentifying(false);
  };

  if (activeExercise && studentName && matricula && !isIdentifying) {
    return (
      <ExerciseSession
        exercise={activeExercise}
        student={{ ...user, name: studentName, matricula: matricula }}
        onComplete={() => {
          setActiveExercise(null);
          setClassCode('');
          setStudentName('');
          setMatricula('');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header style={{ backgroundColor: '#16a34a', borderBottom: '1px solid #15803d', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #4ade80, #059669)' }}>
              <span className="text-white text-xl font-bold">GJ</span>
            </div>
            <div>
              <h1 className="font-bold" style={{ color: '#ffffff' }}>Gauss-Jordan Academy</h1>
              <p className="text-sm" style={{ color: '#dcfce7' }}>Panel del Estudiante</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: '#ffffff' }}>{studentName || user.name}</p>
              <p className="text-xs" style={{ color: '#dcfce7' }}>{matricula || user.email}</p>
            </div>
            <button onClick={onLogout} className="p-2 rounded-lg transition-colors" style={{ color: '#dcfce7' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#15803d'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#dcfce7'; }}>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          {!isIdentifying ? (
            <>
              <div className="text-center mb-8">
                <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Logo variant="icon" className="w-full h-full" />
                </div>
                <h2 className="text-3xl text-[#343A40] mb-1 font-bold">¡Bienvenido, Estudiante!</h2>
                <p className="text-gray-500 text-sm mb-3">Listo para practicar Gauss-Jordan</p>
                <p className="text-gray-600">Ingresa el código proporcionado por tu profesor</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => { setClassCode(e.target.value.toUpperCase()); setError(''); }}
                  placeholder="Ej: ABC123"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none text-center text-2xl tracking-widest uppercase"
                />
                {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>}
                <button
                  onClick={handleJoinClass}
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-4 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md font-bold"
                >
                  Ingresar a la Clase
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <UserCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#343A40]">Datos de Alumno</h2>
                <p className="text-gray-600">Completa para registrar tu calificación</p>
              </div>
              <div className="space-y-4">
                <input
                  type="text" placeholder="Nombre Completo" value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg outline-none focus:border-green-500"
                />
                <input
                  type="text" placeholder="Matrícula / Boleta" value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg outline-none focus:border-green-500"
                />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button onClick={handleFinishSetup} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-bold shadow-lg">
                  ¡Comenzar Ahora!
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}