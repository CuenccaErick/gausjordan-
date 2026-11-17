import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Exercise, User, Matrix } from '../types';
import { createEmptyMatrix, compareMatrices, calculateScore, formatTime } from '../utils/matrixUtils';
import { supabase } from '../lib/supabaseClient';
import { WelcomeStep, ViewProblemStep, SolveMatrixStep, VerificationResultStep } from './StudentExerciseSteps';

interface ExerciseSessionProps {
  exercise: Exercise;
  student: User;
  onComplete: () => void;
}

export function ExerciseSession({ exercise, student, onComplete }: ExerciseSessionProps) {
  const [currentMatrixIndex, setCurrentMatrixIndex] = useState(0);
  const [viewState, setViewState] = useState<'welcome' | 'view-problem' | 'solve' | 'verification'>('welcome');

  const correctAnswersData = exercise.correctAnswers || (exercise as any).correct_answers || [];

  const [studentAnswers, setStudentAnswers] = useState<Matrix[]>(
    exercise.matrices.map(m => createEmptyMatrix(m.rows, m.cols))
  );
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentCorrectness, setCurrentCorrectness] = useState<boolean[][] | null>(null);
  const [currentAccuracy, setCurrentAccuracy] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [finalResults, setFinalResults] = useState<any>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const uploadEvidence = async (file: File): Promise<string | null> => {
    try {
      // Validaciones adicionales
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_FILE_SIZE) {
        console.error('Archivo demasiado grande:', file.size);
        return null;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        console.error('Tipo de archivo no soportado:', file.type);
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const safeName = student.name
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .substring(0, 20); // Limitar longitud del nombre
      
      const fileName = `${exercise.id}/${safeName}_${Date.now()}.${fileExt}`;

      console.log('📤 Subiendo evidencia:', {
        fileName,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        fileType: file.type,
      });

      const { error, data } = await supabase.storage
        .from('evidence-files')
        .upload(fileName, file, { 
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Error subiendo evidencia:', error);
        return null;
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('evidence-files')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        console.error('No se pudo obtener URL pública');
        return null;
      }

      console.log('✅ Evidencia subida exitosamente:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err) {
      console.error('❌ Error inesperado al subir evidencia:', err);
      return null;
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);

    try {
      let totalCorrect = 0;
      let totalCells = 0;
      const allCorrectness: boolean[][][] = [];

      exercise.matrices.forEach((_, i) => {
        const res = compareMatrices(studentAnswers[i], correctAnswersData[i]);
        totalCorrect += res.correctCells;
        totalCells += res.totalCells;
        allCorrectness.push(res.correct);
      });

      const accuracy = totalCells > 0 ? (totalCorrect / totalCells) * 100 : 0;
      const score = calculateScore(accuracy, elapsedTime);

      console.log('📊 Resultados calculados:', {
        totalCorrect,
        totalCells,
        accuracy: `${accuracy.toFixed(2)}%`,
        score,
        tiempoElapsedSeconds: elapsedTime,
      });

      // Subir evidencia si existe
      let evidenceUrl: string | null = null;
      if (evidenceFile) {
        console.log('📎 Procesando archivo de evidencia...');
        evidenceUrl = await uploadEvidence(evidenceFile);
        if (!evidenceUrl) {
          console.warn('⚠️ No se pudo subir la evidencia, continuando sin ella...');
        }
      }

      // Guardar respuestas del alumno como snapshot
      const answersSnapshot = studentAnswers.map((ans, i) => ({
        matrixIndex: i,
        studentAnswer: ans,
        correctness: allCorrectness[i],
      }));

      console.log('💾 Guardando intento en BD...');
      
      const { error } = await supabase
        .from('student_attempts')
        .insert([{
          exercise_id: exercise.id,
          student_id: student.id.startsWith('guest_') ? null : student.id,
          student_name: student.name,
          student_matricula: (student as any).matricula || '',
          score: score,
          accuracy: accuracy,
          time_elapsed: elapsedTime,
          completed_at: new Date().toISOString(),
          evidence_url: evidenceUrl,
          answers_snapshot: answersSnapshot,
        }]);

      if (error) {
        console.error('❌ Error guardando intento en BD:', error);
        alert('Error al guardar tu respuesta. Por favor intenta de nuevo.');
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Intento guardado exitosamente en BD');

      setFinalResults({ accuracy, score, correctCells: totalCorrect, totalCells });
      setShowResults(true);
    } catch (err) {
      console.error('❌ Error inesperado en handleFinish:', err);
      alert('Error inesperado. Por favor recarga la página e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults && finalResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12">
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              finalResults.accuracy >= 70 ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {finalResults.accuracy >= 70
                ? <CheckCircle className="w-12 h-12 text-green-600" />
                : <AlertCircle className="w-12 h-12 text-yellow-600" />}
            </div>
            <h2 className="text-3xl text-[#343A40] font-bold mb-2">
              {finalResults.accuracy >= 70 ? '¡Excelente trabajo!' : '¡Buen intento!'}
            </h2>
            <p className="text-gray-600 mb-8">Has completado: {exercise.title}</p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-sm text-gray-600 mb-2">Puntuación</p>
                <p className="text-4xl text-blue-600 font-bold">{finalResults.score}</p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-6">
                <p className="text-sm text-gray-600 mb-2">Precisión</p>
                <p className="text-4xl text-indigo-600 font-bold">{finalResults.accuracy.toFixed(1)}%</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <p className="text-sm text-gray-600 mb-2">Tiempo</p>
                <p className="text-4xl text-green-600 font-bold">{formatTime(elapsedTime)}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <p className="text-sm text-gray-600 mb-2">Matrices</p>
                <p className="text-4xl text-purple-600 font-bold">{exercise.matrices.length}</p>
              </div>
            </div>
            {evidenceFile && (
              <p className="text-sm text-green-600 mb-6 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Evidencia enviada correctamente
              </p>
            )}
            <button
              onClick={onComplete}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold shadow-md"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === 'welcome') {
    return (
      <WelcomeStep
        title={exercise.title}
        description={exercise.instructions}
        onNext={() => setViewState('view-problem')}
      />
    );
  }

  if (viewState === 'view-problem') {
    return (
      <ViewProblemStep
        matrix={exercise.matrices[currentMatrixIndex]}
        matrixNumber={currentMatrixIndex + 1}
        totalMatrices={exercise.matrices.length}
        onNext={() => setViewState('solve')}
      />
    );
  }

  if (viewState === 'solve') {
    return (
      <SolveMatrixStep
        problemMatrix={exercise.matrices[currentMatrixIndex]}
        studentAnswer={studentAnswers[currentMatrixIndex]}
        matrixNumber={currentMatrixIndex + 1}
        totalMatrices={exercise.matrices.length}
        onAnswerChange={(m) => {
          const n = [...studentAnswers];
          n[currentMatrixIndex] = m;
          setStudentAnswers(n);
        }}
        evidenceFile={evidenceFile}
        onEvidenceChange={setEvidenceFile}
        isLastMatrix={currentMatrixIndex === exercise.matrices.length - 1}
        isSubmitting={isSubmitting}
        onVerify={() => {
          const res = compareMatrices(
            studentAnswers[currentMatrixIndex],
            correctAnswersData[currentMatrixIndex]
          );
          setCurrentCorrectness(res.correct);
          setCurrentAccuracy(res.accuracy);
          setViewState('verification');
        }}
      />
    );
  }

  if (viewState === 'verification' && currentCorrectness) {
    const currentRes = compareMatrices(
      studentAnswers[currentMatrixIndex],
      correctAnswersData[currentMatrixIndex]
    );
    return (
      <VerificationResultStep
        problemMatrix={exercise.matrices[currentMatrixIndex]}
        studentAnswer={studentAnswers[currentMatrixIndex]}
        correctAnswer={correctAnswersData[currentMatrixIndex]}
        correctness={currentCorrectness}
        accuracy={currentAccuracy}
        correctCells={currentRes.correctCells}
        totalCells={currentRes.totalCells}
        matrixNumber={currentMatrixIndex + 1}
        totalMatrices={exercise.matrices.length}
        onContinue={() => {
          if (currentMatrixIndex < exercise.matrices.length - 1) {
            setCurrentMatrixIndex(currentMatrixIndex + 1);
            setViewState('view-problem');
          } else {
            handleFinish();
          }
        }}
        onRetry={() => {
          setViewState('solve');
          setCurrentCorrectness(null);
        }}
      />
    );
  }

  return null;
}