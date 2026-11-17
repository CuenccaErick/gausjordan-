import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  ListOrdered,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Trophy,
  XCircle,
  AlertTriangle,
  Copy,
} from 'lucide-react';
import { Matrix } from '../types';
import { PracticeExerciseData } from '../data/practiceExercises';
import { MatrixInput } from './MatrixInput';
import { Logo } from './Logo';

interface PracticeExerciseProps {
  exercise: PracticeExerciseData;
  onBack: () => void;
}

export function PracticeExercise({ exercise, onBack }: PracticeExerciseProps) {
  const buildMatrixFromData = (data: number[][]): Matrix => ({
    rows: data.length,
    cols: data[0].length,
    values: data.map((row) => [...row]) as (number | null)[][],
    operations: Array(data.length)
      .fill(null)
      .map(() => Array(data[0].length).fill(null)),
    isFraction: Array(data.length)
      .fill(null)
      .map(() => Array(data[0].length).fill(false)),
  });

  const buildBlankMatrix = (rows: number, cols: number): Matrix => ({
    rows,
    cols,
    values: Array(rows).fill(null).map(() => Array(cols).fill(null)),
    operations: Array(rows).fill(null).map(() => Array(cols).fill(null)),
    isFraction: Array(rows).fill(null).map(() => Array(cols).fill(false)),
  });

  // State arrays to keep track of user input, verification status, correctness indicators, and accuracy for each step
  const [userSteps, setUserSteps] = useState<Matrix[]>(() =>
    Array(exercise.steps.length)
      .fill(null)
      .map(() => buildBlankMatrix(exercise.initialMatrix.length, exercise.initialMatrix[0].length))
  );

  const [stepVerified, setStepVerified] = useState<boolean[]>(() =>
    Array(exercise.steps.length).fill(false)
  );

  const [stepCorrectness, setStepCorrectness] = useState<(boolean[][] | null)[]>(() =>
    Array(exercise.steps.length).fill(null)
  );

  const [stepAccuracy, setStepAccuracy] = useState<number[]>(() =>
    Array(exercise.steps.length).fill(0)
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [showStep, setShowStep] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [isBackActive, setIsBackActive] = useState(false);

  // Active state aliases for the current step index
  const userMatrix = userSteps[currentStepIndex];
  const isVerified = stepVerified[currentStepIndex];
  const correctness = stepCorrectness[currentStepIndex];
  const accuracy = stepAccuracy[currentStepIndex];

  // Helper to retrieve the reference/previous step matrix
  const getPreviousMatrix = (): Matrix => {
    if (currentStepIndex === 0) {
      return buildMatrixFromData(exercise.initialMatrix);
    } else {
      return buildMatrixFromData(exercise.steps[currentStepIndex - 1].resultMatrix);
    }
  };

  // Helper to copy values from previous matrix to speed up data entry
  const handleCopyPrevious = () => {
    const prev = getPreviousMatrix();
    const nextSteps = [...userSteps];
    nextSteps[currentStepIndex] = {
      ...nextSteps[currentStepIndex],
      values: prev.values.map((row) => [...row]),
      isFraction: prev.isFraction?.map((row) => [...row]) ?? nextSteps[currentStepIndex].isFraction,
      operations: prev.operations?.map((row) => [...row]) ?? nextSteps[currentStepIndex].operations,
    };
    setUserSteps(nextSteps);

    // Reset verification status for the active step since values changed
    if (stepVerified[currentStepIndex]) {
      const nextVerified = [...stepVerified];
      nextVerified[currentStepIndex] = false;
      setStepVerified(nextVerified);

      const nextCorrectness = [...stepCorrectness];
      nextCorrectness[currentStepIndex] = null;
      setStepCorrectness(nextCorrectness);

      const nextAccuracy = [...stepAccuracy];
      nextAccuracy[currentStepIndex] = 0;
      setStepAccuracy(nextAccuracy);
    }
  };

  // Handle manual edits
  const handleMatrixChange = (updatedMatrix: Matrix) => {
    const nextSteps = [...userSteps];
    nextSteps[currentStepIndex] = updatedMatrix;
    setUserSteps(nextSteps);

    // Reset verification status for this step if values are changed
    if (stepVerified[currentStepIndex]) {
      const nextVerified = [...stepVerified];
      nextVerified[currentStepIndex] = false;
      setStepVerified(nextVerified);

      const nextCorrectness = [...stepCorrectness];
      nextCorrectness[currentStepIndex] = null;
      setStepCorrectness(nextCorrectness);

      const nextAccuracy = [...stepAccuracy];
      nextAccuracy[currentStepIndex] = 0;
      setStepAccuracy(nextAccuracy);
    }
  };

  // Verify the active step matrix against the step's expected result matrix
  const handleVerify = () => {
    const targetMatrix = exercise.steps[currentStepIndex].resultMatrix;
    const rows = userMatrix.rows;
    const cols = userMatrix.cols;
    let correct = 0;
    let total = 0;

    const result: boolean[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const userVal = userMatrix.values[i][j];
        const solVal = targetMatrix[i][j];
        total++;
        if (userVal !== null && Math.abs(userVal - solVal) < 0.01) {
          result[i][j] = true;
          correct++;
        }
      }
    }

    const acc = total > 0 ? (correct / total) * 100 : 0;
    const roundedAcc = Math.round(acc);

    const nextVerified = [...stepVerified];
    nextVerified[currentStepIndex] = true;
    setStepVerified(nextVerified);

    const nextCorrectness = [...stepCorrectness];
    nextCorrectness[currentStepIndex] = result;
    setStepCorrectness(nextCorrectness);

    const nextAccuracy = [...stepAccuracy];
    nextAccuracy[currentStepIndex] = roundedAcc;
    setStepAccuracy(nextAccuracy);
  };

  // Reset active step matrix
  const handleResetCurrentStep = () => {
    const nextSteps = [...userSteps];
    nextSteps[currentStepIndex] = buildBlankMatrix(
      exercise.initialMatrix.length,
      exercise.initialMatrix[0].length
    );
    setUserSteps(nextSteps);

    const nextVerified = [...stepVerified];
    nextVerified[currentStepIndex] = false;
    setStepVerified(nextVerified);

    const nextCorrectness = [...stepCorrectness];
    nextCorrectness[currentStepIndex] = null;
    setStepCorrectness(nextCorrectness);

    const nextAccuracy = [...stepAccuracy];
    nextAccuracy[currentStepIndex] = 0;
    setStepAccuracy(nextAccuracy);
  };

  // Reset the whole exercise
  const handleResetAll = () => {
    setUserSteps(
      Array(exercise.steps.length)
        .fill(null)
        .map(() => buildBlankMatrix(exercise.initialMatrix.length, exercise.initialMatrix[0].length))
    );
    setStepVerified(Array(exercise.steps.length).fill(false));
    setStepCorrectness(Array(exercise.steps.length).fill(null));
    setStepAccuracy(Array(exercise.steps.length).fill(0));
    setCurrentStepIndex(0);
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const isExerciseComplete = stepVerified.every((v, idx) => v && stepAccuracy[idx] === 100);

  // Difficulty config styling
  const difficultyConfig = {
    basico: { label: 'Básico', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    intermedio: { label: 'Intermedio', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
    avanzado: { label: 'Avanzado', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  };
  const diff = difficultyConfig[exercise.difficulty];

  // ── Render step matrix (read-only, simple) ──
  const renderStepMatrix = (matrix: number[][]) => (
    <div className="inline-flex items-center">
      {/* Left bracket */}
      <div className="flex flex-col justify-between self-stretch mr-1.5 py-0.5">
        <div style={{ borderLeft: '2.5px solid #343A40', borderTop: '2.5px solid #343A40', width: '10px', height: '6px', borderTopLeftRadius: '2px' }} />
        <div style={{ borderLeft: '2.5px solid #343A40', flex: 1, marginTop: '-1px', marginBottom: '-1px' }} />
        <div style={{ borderLeft: '2.5px solid #343A40', borderBottom: '2.5px solid #343A40', width: '10px', height: '6px', borderBottomLeftRadius: '2px' }} />
      </div>
      <table className="border-collapse">
        <tbody>
          {matrix.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="p-0.5">
                  <div className="flex items-center justify-center bg-white border border-gray-200 rounded text-xs font-mono font-medium text-gray-700" style={{ width: '2.5rem', height: '2rem' }}>
                    {Number.isInteger(cell)
                      ? cell
                      : cell.toFixed(3).replace(/\.?0+$/, '')}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Right bracket */}
      <div className="flex flex-col justify-between self-stretch ml-1.5 py-0.5">
        <div style={{ borderRight: '2.5px solid #343A40', borderTop: '2.5px solid #343A40', width: '10px', height: '6px', borderTopRightRadius: '2px' }} />
        <div style={{ borderRight: '2.5px solid #343A40', flex: 1, marginTop: '-1px', marginBottom: '-1px' }} />
        <div style={{ borderRight: '2.5px solid #343A40', borderBottom: '2.5px solid #343A40', width: '10px', height: '6px', borderBottomRightRadius: '2px' }} />
      </div>
    </div>
  );

  // ── Accuracy feedback ──
  const getAccuracyFeedback = () => {
    if (accuracy >= 90)
      return {
        icon: <Trophy className="w-6 h-6" />,
        label: '¡Excelente! Lo lograste',
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-700',
        iconColor: 'text-green-500',
      };
    if (accuracy >= 50)
      return {
        icon: <AlertTriangle className="w-6 h-6" />,
        label: '¡Buen intento! Revisa las celdas rojas',
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        text: 'text-yellow-700',
        iconColor: 'text-yellow-500',
      };
    return {
      icon: <XCircle className="w-6 h-6" />,
      label: 'Sigue practicando, revisa los pasos',
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-700',
      iconColor: 'text-red-500',
    };
  };

  const currentExStep = exercise.steps[currentStepIndex];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Navbar */}
      <header className="relative z-20 bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Info del Ejercicio */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0">
              <Logo variant="icon" className="w-full h-full" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-extrabold text-slate-800 text-base md:text-lg">Gauss-Jordan Academy</h1>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${diff.bg} ${diff.text} ${diff.border}`}
                >
                  {diff.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Campo de Práctica - Ejercicio: <span className="text-slate-700 font-bold">{exercise.title}</span>
              </p>
            </div>
          </div>

          {/* Controles de la derecha */}
          <div className="flex items-center gap-3.5 justify-between md:justify-end w-full md:w-auto">
            <button
              onClick={handleResetAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar Ejercicio
            </button>

            <div className="flex items-center gap-3.5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Estudiante Invitado</p>
                <p className="text-xs text-slate-500 font-medium">Práctica Libre</p>
              </div>
              <button
                onClick={onBack}
                onMouseEnter={() => setIsBackHovered(true)}
                onMouseLeave={() => {
                  setIsBackHovered(false);
                  setIsBackActive(false);
                }}
                onMouseDown={() => setIsBackActive(true)}
                onMouseUp={() => setIsBackActive(false)}
                style={{
                  backgroundColor: isBackActive 
                    ? '#581c87' 
                    : isBackHovered 
                      ? '#7e22ce' 
                      : '#6b21a8',
                  color: '#ffffff',
                }}
              className="px-4 py-2 rounded-xl transition-all duration-200 shadow-sm flex items-center gap-2 font-bold text-xs md:text-sm cursor-pointer border border-transparent"
              title="Volver al Menú"
            >
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
              <span>Volver al Menú</span>
            </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid lg:grid-cols-5 gap-8 md:gap-10">
          {/* ── Left: Matrix area (3 cols) ── */}
          <div className="lg:col-span-3 space-y-6 sm:space-y-8">
            {isExerciseComplete ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <Trophy className="w-10 h-10 text-green-600 animate-bounce" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
                  ¡Excelente Trabajo!
                </h2>
                <p className="text-gray-700 max-w-md mx-auto mb-6">
                  Has resuelto correctamente todos los pasos del ejercicio <strong>{exercise.title}</strong> usando el método de Gauss-Jordan.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={handleResetAll}
                    className="px-6 py-3 rounded-xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 shadow-sm"
                  >
                    Resolver de nuevo
                  </button>
                  <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md"
                  >
                    Volver a Ejercicios
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Step Info */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                      Paso {currentStepIndex + 1} de {exercise.steps.length}
                    </span>
                    <span className="font-mono text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                      Operación: {exercise.steps[currentStepIndex].operation}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    {exercise.steps[currentStepIndex].description}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Aplica la operación indicada sobre la matriz anterior para obtener la nueva matriz.
                  </p>
                </div>

                {/* Workspace Cards */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 md:p-10 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {/* Previous Matrix */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">
                        Matriz Anterior
                      </h4>
                      <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 md:p-10 flex justify-center border border-gray-150 overflow-auto">
                        <MatrixInput
                          matrix={getPreviousMatrix()}
                          onChange={() => {}}
                          editable={false}
                        />
                      </div>
                    </div>

                    {/* Active Matrix */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                          Tu Nueva Matriz
                        </h4>
                        {!isVerified && (
                          <button
                            onClick={handleCopyPrevious}
                            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 transition-all active:scale-95"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Anterior
                          </button>
                        )}
                      </div>
                      <div className="bg-indigo-50/30 rounded-2xl p-6 sm:p-8 md:p-10 flex justify-center border border-indigo-150 overflow-auto">
                        <MatrixInput
                          matrix={userMatrix}
                          onChange={handleMatrixChange}
                          editable={!isVerified || accuracy !== 100}
                          correctness={correctness ?? undefined}
                          highlightCorrect={isVerified}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reset row buttons for current step */}
                  {!isVerified && (
                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={handleResetCurrentStep}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Reiniciar Paso
                      </button>
                    </div>
                  )}
                </div>

                {/* Validation and errors feedback */}
                {isVerified && accuracy !== 100 && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Hay errores en la matriz ({accuracy}% correcto)</p>
                      <p className="text-xs text-red-600">Corrige las celdas marcadas en rojo para poder continuar.</p>
                    </div>
                  </div>
                )}

                {/* Action navigation bar */}
                <div className="flex items-center gap-6 mt-2">
                  {/* Step Back button */}
                  <button
                    disabled={currentStepIndex === 0}
                    onClick={handleStepBack}
                    className="flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-40"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Paso Anterior
                  </button>

                  {/* Verify or Next Matrix buttons */}
                  {!isVerified || accuracy !== 100 ? (
                    <button
                      onClick={handleVerify}
                      disabled={!userMatrix.values.every((row) => row.every((cell) => cell !== null))}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Verificar Paso
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 animate-pulse"
                    >
                      Siguiente Matriz
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Right: Hints & Steps (2 cols) ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hints panel */}
            <div className={`rounded-xl shadow-md border transition-all duration-300 overflow-hidden ${showHint ? 'bg-amber-50/30 border-amber-200' : 'bg-white border-gray-100'}`}>
              <button
                onClick={() => setShowHint(!showHint)}
                className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
                  showHint ? 'bg-amber-50 text-amber-900 hover:bg-amber-100/75' : 'bg-white hover:bg-amber-50/35 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showHint ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700'}`}>
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm sm:text-base">Pistas</span>
                  <span className={`text-xs font-semibold ${showHint ? 'text-amber-700' : 'text-slate-400'}`}>
                    ({currentHint + 1}/{exercise.hints.length})
                  </span>
                </div>
                {showHint ? (
                  <ChevronUp className="w-5 h-5 text-amber-700" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 space-y-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3.5">
                        <p className="text-sm text-yellow-800">{exercise.hints[currentHint]}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setCurrentHint((h) => Math.max(0, h - 1))}
                          disabled={currentHint === 0}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Anterior
                        </button>
                        <button
                          onClick={() =>
                            setCurrentHint((h) => Math.min(exercise.hints.length - 1, h + 1))
                          }
                          disabled={currentHint === exercise.hints.length - 1}
                          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-30 transition-colors"
                        >
                          Siguiente
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Steps panel */}
            <div className={`rounded-xl shadow-md border transition-all duration-300 overflow-hidden ${showStep ? 'bg-indigo-50/30 border-indigo-200' : 'bg-white border-gray-100'}`}>
              <button
                onClick={() => setShowStep(!showStep)}
                className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
                  showStep ? 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100/75' : 'bg-white hover:bg-indigo-50/35 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showStep ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    <ListOrdered className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm sm:text-base">Ver Pasos</span>
                  <span className={`text-xs font-semibold ${showStep ? 'text-indigo-700' : 'text-slate-400'}`}>
                    ({currentStepIndex + 1}/{exercise.steps.length})
                  </span>
                </div>
                {showStep ? (
                  <ChevronUp className="w-5 h-5 text-indigo-700" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {showStep && exercise.steps[currentStepIndex] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full font-mono">
                          {exercise.steps[currentStepIndex].operation}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">{exercise.steps[currentStepIndex].description}</p>

                      <div className="flex justify-center py-2 overflow-x-auto">
                        {renderStepMatrix(exercise.steps[currentStepIndex].resultMatrix)}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <button
                          onClick={() => setCurrentStepIndex((s) => Math.max(0, s - 1))}
                          disabled={currentStepIndex === 0}
                          className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Anterior
                        </button>
                        <div className="flex gap-1">
                          {exercise.steps.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentStepIndex(i)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                i === currentStepIndex
                                  ? 'bg-indigo-500'
                                  : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() =>
                            setCurrentStepIndex((s) =>
                              Math.min(exercise.steps.length - 1, s + 1)
                            )
                          }
                          disabled={currentStepIndex === exercise.steps.length - 1}
                          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-30 transition-colors"
                        >
                          Siguiente
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
