import { useState, useEffect } from 'react';
import { Plus, LogOut, BookOpen, Users, TrendingUp, Eye, Trash2, Settings } from 'lucide-react';
import { User, Exercise } from '../types';
import { supabase } from '../lib/supabaseClient';
import { CreateExercise } from './CreateExercise';
import { EditExercise } from './EditExercise';
import { ResultsView } from './ResultsView';
import { ExercisePreview } from './ExercisePreview';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
}

export function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [view, setView] = useState<'dashboard' | 'create' | 'results' | 'preview' | 'edit'>('dashboard');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [stats, setStats] = useState({ totalStudents: 0, avgScore: 0 });

  useEffect(() => { loadExercises(); }, []);

  const loadExercises = async () => {
    const { data } = await supabase.from('exercises').select('*').eq('teacher_id', user.id);
    if (data) {
      const mappedExercises = data.map(ex => ({
        id: ex.id,
        teacherId: ex.teacher_id,
        teacherName: user.name,
        title: ex.title,
        instructions: ex.instructions,
        classCode: ex.class_code,
        matrices: ex.matrices,
        correctAnswers: ex.correct_answers,
        createdAt: ex.created_at
      }));
      setExercises(mappedExercises);

      // Cargar estadísticas si hay ejercicios
      if (mappedExercises.length > 0) {
        const exerciseIds = mappedExercises.map(ex => ex.id);
        const { data: attemptsData } = await supabase
          .from('student_attempts')
          .select('exercise_id, score')
          .in('exercise_id', exerciseIds);

        const attempts = attemptsData || [];
        const totalStudents = attempts.length;
        const avgScore = attempts.length > 0
          ? attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length
          : 0;

        setStats({ totalStudents, avgScore: Math.round(avgScore * 10) / 10 });
      } else {
        setStats({ totalStudents: 0, avgScore: 0 });
      }
    }
  };

  const handleDeleteExercise = async (exerciseId: string, title: string) => {
    const confirmed = window.confirm(
      `¿Eliminar el ejercicio "${title}"? Esta acción no se puede deshacer.`
    );
    if (confirmed) {
      await supabase.from('exercises').delete().eq('id', exerciseId);
      loadExercises();
    }
  };

  if (view === 'create') return <CreateExercise user={user} onBack={() => setView('dashboard')} onExerciseCreated={() => { loadExercises(); setView('dashboard'); }} />;
  if (view === 'edit' && selectedExercise) return <EditExercise user={user} exercise={selectedExercise} onBack={() => { setSelectedExercise(null); setView('dashboard'); }} onExerciseUpdated={() => { loadExercises(); setView('dashboard'); }} />;
  if (view === 'preview' && selectedExercise) return <ExercisePreview exercise={selectedExercise} onBack={() => { setSelectedExercise(null); setView('dashboard'); }} onEdit={() => setView('edit')} onDelete={async () => {
    const confirmed = window.confirm(
      `¿Eliminar "${selectedExercise.title}"? Esta acción no se puede deshacer.`
    );
    if (confirmed) {
      await supabase.from('exercises').delete().eq('id', selectedExercise.id);
      loadExercises();
      setSelectedExercise(null);
      setView('dashboard');
    }
  }} />;
  if (view === 'results' && selectedExercise) return <ResultsView exercise={selectedExercise} onBack={() => { setSelectedExercise(null); setView('dashboard'); }} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header style={{ backgroundColor: '#1a1a2e', borderBottom: '1px solid #374151', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.4)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, #4b5563, #1f2937)', border: '1px solid #6b7280' }}>
              <span className="text-white text-xl font-bold">GJ</span>
            </div>
            <div>
              <h1 className="font-bold" style={{ color: '#ffffff' }}>Gauss-Jordan Academy</h1>
              <p className="text-sm" style={{ color: '#9ca3af' }}>Panel del Profesor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: '#ffffff' }}>{user.name}</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>{user.email}</p>
            </div>
            {user.avatar && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" style={{ border: '2px solid #6b7280' }} />}
            <button onClick={onLogout} className="p-2 rounded-lg transition-colors" style={{ color: '#9ca3af' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#374151'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}>
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* SALUDO */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#343A40]">
            ¡Hola, <span style={{ color: '#1a1a2e' }}>{user.name}</span>!
          </h2>
          <p className="text-gray-500 mt-1 text-sm">Aquí tienes un resumen de tu actividad</p>
        </div>

        {/* TARJETAS DE ESTADÍSTICAS CON VALORES DINÁMICOS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div><p className="text-gray-600 text-sm mb-1">Ejercicios Creados</p><p className="text-3xl font-bold text-[#343A40]">{exercises.length}</p></div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><BookOpen className="w-6 h-6 text-blue-600" /></div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div><p className="text-gray-600 text-sm mb-1">Estudiantes Activos</p><p className="text-3xl font-bold text-[#343A40]">{stats.totalStudents}</p></div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-indigo-600" /></div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div><p className="text-gray-600 text-sm mb-1">Promedio General</p><p className="text-3xl font-bold text-[#343A40]">{stats.avgScore > 0 ? stats.avgScore.toFixed(1) : '--'}</p></div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-6 h-6 text-green-600" /></div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#343A40]">Mis Ejercicios</h2>
          <button onClick={() => setView('create')} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg flex items-center gap-2 font-bold shadow-md">
            <Plus className="w-5 h-5" /> Crear Nuevo Ejercicio
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#343A40] mb-2">{ex.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{ex.instructions}</p>
              </div>
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  Código: {ex.classCode}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setSelectedExercise(ex); setView('preview'); }} className="flex-1 bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" /> Ver
                </button>
                <button onClick={() => { setSelectedExercise(ex); setView('results'); }} className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100">
                  Resultados
                </button>
                <button onClick={() => { setSelectedExercise(ex); setView('edit'); }} className="bg-gray-100 text-gray-500 p-2 rounded-lg hover:bg-gray-200 transition-colors" title="Editar">
                  <Settings className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteExercise(ex.id, ex.title)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors" title="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}