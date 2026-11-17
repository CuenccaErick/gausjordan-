import { useState, useEffect } from 'react';
import { ArrowLeft, Award, TrendingUp, Target, Clock, FileText, X, ExternalLink, BookOpen } from 'lucide-react';
import { Exercise } from '../types';
import { supabase } from '../lib/supabaseClient';
import { formatTime } from '../utils/matrixUtils';
import { MatrixInput } from './MatrixInput';

interface ResultsViewProps {
  exercise: Exercise;
  onBack: () => void;
}

interface StudentGroup {
  student_name: string;
  student_matricula: string;
  attempts: any[];
  avgScore: number;
  avgAccuracy: number;
  avgTime: number;
  hasEvidence: boolean;
  lastDate: string;
}

export function ResultsView({ exercise, onBack }: ResultsViewProps) {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudentGroup | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const GRADES_KEY = `final_grades_${exercise.id}`;
  const [grades, setGrades] = useState<Record<string, string>>(() => {
    // Carga inicial desde localStorage (para respuesta inmediata)
    try { return JSON.parse(localStorage.getItem(GRADES_KEY) || '{}'); }
    catch { return {}; }
  });

  // Cargar calificaciones desde Supabase al abrir la vista
  useEffect(() => {
    const fetchGrades = async () => {
      const { data } = await supabase
        .from('final_grades')
        .select('student_matricula, grade')
        .eq('exercise_id', exercise.id);
      if (data && data.length > 0) {
        const loaded: Record<string, string> = {};
        data.forEach((row: any) => {
          loaded[row.student_matricula] = row.grade?.toString() ?? '';
        });
        setGrades(loaded);
        localStorage.setItem(GRADES_KEY, JSON.stringify(loaded));
      }
    };
    fetchGrades();
  }, [exercise.id, GRADES_KEY]);

  // Guardar una calificación en Supabase (llamado en onBlur del input)
  const saveGrade = async (matricula: string, value: string) => {
    const grade = value === '' ? null : parseFloat(value);
    // Guardar localmente primero
    localStorage.setItem(GRADES_KEY, JSON.stringify({ ...grades, [matricula]: value }));
    // Guardar en Supabase
    await supabase.from('final_grades').upsert(
      { exercise_id: exercise.id, student_matricula: matricula, grade, updated_at: new Date().toISOString() },
      { onConflict: 'exercise_id,student_matricula' }
    );
  };

  const getEvidenceUrl = (evidenceUrl: string) => {
    if (!evidenceUrl) return null;
    if (evidenceUrl.includes('supabase')) return evidenceUrl;
    try {
      const { data } = supabase.storage.from('evidence-files').getPublicUrl(evidenceUrl);
      return data?.publicUrl || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      const { data } = await supabase
        .from('student_attempts')
        .select('*')
        .eq('exercise_id', exercise.id)
        .order('completed_at', { ascending: false });
      if (data) setAttempts(data);
    };
    fetchResults();
  }, [exercise.id]);

  // ── Agrupación por alumno ──────────────────────────────────────────────────
  const studentGroups: StudentGroup[] = Object.values(
    attempts.reduce((acc: Record<string, StudentGroup>, att) => {
      const key = att.student_matricula || att.student_name;
      if (!acc[key]) {
        acc[key] = {
          student_name: att.student_name,
          student_matricula: att.student_matricula || '—',
          attempts: [],
          avgScore: 0,
          avgAccuracy: 0,
          avgTime: 0,
          hasEvidence: false,
          lastDate: att.completed_at,
        };
      }
      acc[key].attempts.push(att);
      if (att.evidence_url) acc[key].hasEvidence = true;
      return acc;
    }, {})
  ).map((g) => ({
    ...g,
    avgScore: g.attempts.reduce((s, a) => s + (a.score || 0), 0) / g.attempts.length,
    avgAccuracy: g.attempts.reduce((s, a) => s + (a.accuracy || 0), 0) / g.attempts.length,
    avgTime: g.attempts.reduce((s, a) => s + (a.time_elapsed || 0), 0) / g.attempts.length,
    lastDate: g.attempts[0]?.completed_at,
  }));

  const stats = {
    total: studentGroups.length,
    avgScore: studentGroups.length ? studentGroups.reduce((s, g) => s + g.avgScore, 0) / studentGroups.length : 0,
    avgAcc: studentGroups.length ? studentGroups.reduce((s, g) => s + g.avgAccuracy, 0) / studentGroups.length : 0,
    avgTime: studentGroups.length ? studentGroups.reduce((s, g) => s + g.avgTime, 0) / studentGroups.length : 0,
  };

  const openGroup = (group: StudentGroup) => {
    setSelectedGroup(group);
    setShowEvidence(false);
    setEvidenceError(null);
  };


  // ── Modal: respuestas del alumno (última entrega) ──────────────────────────
  if (selectedGroup) {
    const att = selectedGroup.attempts[0]; // entrega más reciente
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">

          {/* Cabecera — color plano */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedGroup.student_name}</h2>
              <div className="flex items-center gap-4 mt-1 text-gray-500 text-sm">
                <span className="font-mono">Matrícula: <span className="text-gray-700 font-bold">{selectedGroup.student_matricula}</span></span>
                <span>·</span>
                <span><span className="text-gray-700 font-bold">{selectedGroup.attempts.length}</span> entrega{selectedGroup.attempts.length !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>Promedio: <span className="text-gray-700 font-bold">{selectedGroup.avgScore.toFixed(1)} pts</span></span>
              </div>
            </div>
            <button
              onClick={() => setSelectedGroup(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Respuestas de la entrega más reciente */}
          <div className="p-6">
            {att && att.answers_snapshot && att.answers_snapshot.length > 0 ? (
              <div>
                <p className="text-xs text-gray-400 mb-4">
                  Entrega más reciente — {new Date(att.completed_at).toLocaleString('es-MX', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })} &nbsp;·&nbsp; {att.score} pts &nbsp;·&nbsp; {att.accuracy?.toFixed(1)}% &nbsp;·&nbsp; {formatTime(att.time_elapsed || 0)}
                </p>
                {att.answers_snapshot.map((snap: any, sIdx: number) => {
                  const originalMatrix = exercise.matrices[snap.matrixIndex ?? sIdx];
                  const correctAnswer = (exercise.correctAnswers || (exercise as any).correct_answers)?.[snap.matrixIndex ?? sIdx];
                  return (
                    <div key={sIdx} className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 mb-4">
                        Matriz {sIdx + 1} de {att.answers_snapshot.length}
                      </p>
                      <div className="grid md:grid-cols-3 gap-5">
                        <div>
                          <p className="text-xs font-bold text-gray-500 text-center mb-2 uppercase">Original</p>
                          <div className="bg-white rounded-lg p-3 flex justify-center border border-gray-200">
                            {originalMatrix && <MatrixInput matrix={originalMatrix} onChange={() => {}} editable={false} />}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-indigo-600 text-center mb-2 uppercase">Respuesta del alumno</p>
                          <div className="bg-indigo-50 rounded-lg p-3 flex justify-center border-2 border-indigo-200">
                            {snap.studentAnswer && (
                              <MatrixInput
                                matrix={snap.studentAnswer}
                                onChange={() => {}}
                                editable={false}
                                correctness={snap.correctness}
                                highlightCorrect={true}
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-green-600 text-center mb-2 uppercase">Respuesta correcta</p>
                          <div className="bg-green-50 rounded-lg p-3 flex justify-center border-2 border-green-200">
                            {correctAnswer && <MatrixInput matrix={correctAnswer} onChange={() => {}} editable={false} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* ── Sección de evidencia al fondo ─────────────────────── */}
                {att.evidence_url && (
                  <div className="mt-2 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => setShowEvidence(!showEvidence)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: showEvidence ? '#b91c1c' : 'linear-gradient(135deg,#dc2626,#b91c1c)',
                        color: '#fff', padding: '10px 22px', borderRadius: '10px',
                        fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(220,38,38,0.35)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,38,38,0.55)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 10px rgba(220,38,38,0.35)')}
                    >
                      <FileText style={{ width: '16px', height: '16px' }} />
                      {showEvidence ? 'Ocultar Evidencia' : 'Ver Evidencia'}
                    </button>

                    {showEvidence && (
                      <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(att.evidence_url) ? (
                          <div>
                            <img
                              src={getEvidenceUrl(att.evidence_url)!}
                              alt="Evidencia"
                              className="w-full max-h-[60vh] object-contain bg-gray-50"
                              onError={() => setEvidenceError('Error al cargar la imagen')}
                            />
                            <div className="p-3 bg-gray-50 border-t flex justify-end">
                              <a
                                href={getEvidenceUrl(att.evidence_url)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs text-indigo-600 font-bold hover:text-indigo-800"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Abrir en nueva pestaña
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 flex flex-col items-center gap-3 bg-gray-50">
                            <div style={{ width: '52px', height: '52px', background: '#dc2626', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(220,38,38,0.4)' }}>
                              <FileText style={{ width: '26px', height: '26px', color: '#fff' }} />
                            </div>
                            <p className="text-sm text-gray-600">Documento PDF adjunto</p>
                            <a
                              href={getEvidenceUrl(att.evidence_url)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: '#fff', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}
                            >
                              <ExternalLink style={{ width: '15px', height: '15px' }} /> Abrir PDF
                            </a>
                          </div>
                        )}
                        {evidenceError && (
                          <div className="p-3 bg-red-50 border-t">
                            <p className="text-sm text-red-700">⚠️ {evidenceError}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <p className="text-sm">Sin respuestas guardadas en esta entrega</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Vista principal: tabla de resultados ────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">

      {/* ── Header principal ─────────────────────────────────────────────── */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" /> Volver
          </button>
          <h1 className="text-2xl font-bold text-[#343A40] mb-2">{exercise.title}</h1>
          <p className="text-sm text-gray-600">
            Código de Clase: <span className="font-bold text-blue-600">{exercise.classCode}</span>
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-sm">Estudiantes</p>
              <Award className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-[#343A40]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-sm">Puntuación Promedio</p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-[#343A40]">{stats.avgScore.toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-sm">Precisión Promedio</p>
              <Target className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-3xl font-bold text-[#343A40]">{stats.avgAcc.toFixed(1)}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-sm">Tiempo Promedio</p>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-[#343A40]">{formatTime(Math.round(stats.avgTime))}</p>
          </div>
        </div>

        {/* Tabla agrupada por alumno */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#343A40]">Resultados por Estudiante</h2>
            <p className="text-sm text-gray-500 mt-1">
              {studentGroups.length === 0
                ? 'Aún no hay entregas para este ejercicio'
                : `${studentGroups.length} alumno${studentGroups.length !== 1 ? 's' : ''} — haz clic en "Ejercicios" para ver sus entregas`}
            </p>
          </div>
          <div className="overflow-x-auto">
            {studentGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FileText className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-sm">Los resultados aparecerán aquí cuando los alumnos entreguen</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estudiante</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Matrícula</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Entregas</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Punt. Promedio</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tiempo Prom.</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Última entrega</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ver</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Calif. Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentGroups.map((group) => (
                    <tr
                      key={group.student_matricula}
                      className="hover:bg-indigo-50 transition-colors cursor-pointer"
                      onClick={() => openGroup(group)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#343A40]">{group.student_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-blue-600 font-bold font-mono bg-blue-50 px-2 py-1 rounded">
                          {group.student_matricula}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">
                          <BookOpen className="w-3.5 h-3.5" />
                          {group.attempts.length}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                          {group.avgScore.toFixed(1)} pts
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatTime(Math.round(group.avgTime))}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">
                          {new Date(group.lastDate).toLocaleString('es-MX', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); openGroup(group); }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'linear-gradient(135deg, #4f46e5, #2563eb)',
                            color: '#fff',
                            padding: '7px 16px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(79,70,229,0.45)',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(79,70,229,0.65)')}
                          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(79,70,229,0.45)')}
                        >
                          <BookOpen style={{ width: '13px', height: '13px' }} />
                          Ejercicios
                        </button>
                      </td>
                      {/* Calif. Final */}
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.1}
                            placeholder="—"
                            value={grades[group.student_matricula] ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= 10)) {
                                setGrades(prev => ({ ...prev, [group.student_matricula]: val }));
                              }
                            }}
                            style={{
                              width: '52px',
                              padding: '4px 6px',
                              border: '1.5px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              textAlign: 'center',
                              color: '#374151',
                              outline: 'none',
                              background: '#f9fafb',
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = '#6366f1')}
                            onBlur={e => {
                              e.currentTarget.style.borderColor = '#d1d5db';
                              saveGrade(group.student_matricula, grades[group.student_matricula] ?? '');
                            }}
                          />
                          <span className="text-sm font-bold text-gray-400">/ 10</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}