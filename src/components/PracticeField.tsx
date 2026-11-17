import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Sparkles, GraduationCap } from 'lucide-react';
import { practiceExercises, PracticeExerciseData } from '../data/practiceExercises';
import { GaussJordanTutorial } from './GaussJordanTutorial';
import { PracticeExercise } from './PracticeExercise';
import { Logo } from './Logo';

interface PracticeFieldProps {
  onBack: () => void;
}

type PracticeView = 'welcome' | 'tutorial' | 'menu' | 'exercise';

const categoryIcons: Record<PracticeExerciseData['category'], string> = {
  sistema2x2: '',
  sistema3x3: '',
  reduccion: '',
  escalonada: '',
};

const difficultyConfig = {
  basico: {
    label: 'Básico',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cardBg: 'bg-gradient-to-br from-white to-emerald-50/10 border-emerald-100 hover:border-emerald-400 hover:bg-emerald-50/30',
    iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    btn: '!text-white shadow-emerald-200',
    btnColor: '#059669'
  },
  intermedio: {
    label: 'Intermedio',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    cardBg: 'bg-gradient-to-br from-white to-amber-50/10 border-amber-100 hover:border-amber-400 hover:bg-amber-50/30',
    iconBg: 'bg-amber-50 text-amber-700 border border-amber-100',
    btn: '!text-white shadow-amber-200',
    btnColor: '#d97706'
  },
  avanzado: {
    label: 'Avanzado',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    cardBg: 'bg-gradient-to-br from-white to-rose-50/10 border-rose-100 hover:border-rose-400 hover:bg-rose-50/30',
    iconBg: 'bg-rose-50 text-rose-700 border border-rose-100',
    btn: '!text-white shadow-rose-200',
    btnColor: '#e11d48'
  },
};

export function PracticeField({ onBack }: PracticeFieldProps) {
  const [view, setView] = useState<PracticeView>('welcome');
  const [selectedExercise, setSelectedExercise] = useState<PracticeExerciseData | null>(null);
  const [tutorialSource, setTutorialSource] = useState<'welcome' | 'menu'>('welcome');
  const [selectedOption, setSelectedOption] = useState<'tutorial' | 'practice' | null>(null);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [isBackActive, setIsBackActive] = useState(false);

  // ── Welcome ──
  if (view === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
        {/* Navbar */}
        <header className="relative z-20 bg-white border-b border-purple-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                <Logo variant="icon" className="w-full h-full" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-800 text-base md:text-lg">Gauss-Jordan Academy</h1>
                <p className="text-xs text-slate-500 font-semibold">Campo de Práctica</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
                title="Volver al Inicio"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                <span>Volver al Inicio</span>
              </button>
            </div>
          </div>
        </header>

        {/* Contenido Central */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl w-full"
          >
            {/* Logo oficial */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="mb-6 flex justify-center"
            >
              <div className="w-24 h-24 flex items-center justify-center">
                <Logo variant="icon" className="w-full h-full" />
              </div>
            </motion.div>

            {/* Título - Gris muy oscuro para contraste perfecto */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight"
            >
              Campo de Práctica
            </motion.h1>

            {/* Subtítulo - Gris medio, centrado y con ancho limitado */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed font-medium px-4 max-w-2xl mx-auto"
            >
              Aquí podrás practicar y dominar el método de Gauss-Jordan sin necesidad de cuenta.
              Aprende con un tutorial interactivo y pon a prueba tus conocimientos con ejercicios reales.
            </motion.p>

            {/* Tarjetas de Acción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-2 gap-6 max-w-2xl mx-auto px-4"
            >
              {/* Tarjeta Tutorial */}
              <button
                onClick={() => {
                  if (selectedOption === 'tutorial') {
                    setTutorialSource('welcome');
                    setView('tutorial');
                  } else {
                    setSelectedOption('tutorial');
                  }
                }}
                style={{
                  backgroundColor: selectedOption === 'tutorial' ? '#f3e8ff' : undefined,
                  borderColor: selectedOption === 'tutorial' ? '#a855f7' : undefined,
                }}
                className={`rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col text-left ${selectedOption === 'tutorial'
                    ? 'shadow-xl scale-102 -translate-y-1'
                    : 'bg-white border-purple-100 hover:border-purple-500 hover:bg-purple-50/20 shadow-md hover:shadow-[0_10px_25px_-5px_rgba(147,51,234,0.15)] hover:scale-102 hover:-translate-y-1'
                  }`}
              >
                <div className="h-32 w-full bg-purple-50 flex items-center justify-center overflow-hidden border-b border-purple-100">
                  <img
                    src="/tutorial_card_image.png"
                    alt="Tutorial"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex-1 w-full flex flex-col justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <BookOpen className={`w-5 h-5 transition-colors ${selectedOption === 'tutorial' ? 'text-purple-700' : 'text-purple-600 group-hover:text-purple-700'}`} />
                      <h3 className={`font-extrabold text-base transition-colors ${selectedOption === 'tutorial' ? 'text-purple-900' : 'text-slate-800 group-hover:text-purple-800'}`}>Ver Tutorial</h3>
                    </div>
                    <p className={`text-xs leading-relaxed mb-3 transition-colors ${selectedOption === 'tutorial' ? 'text-purple-950' : 'text-slate-600 group-hover:text-purple-950'}`}>
                      Domina paso a paso el algoritmo mediante una guía interactiva con ejemplos visuales claros.
                    </p>
                  </div>
                  <span className={`text-xs font-bold transition-colors flex items-center gap-1 mt-auto ${selectedOption === 'tutorial' ? 'text-purple-800' : 'text-purple-600 group-hover:text-purple-800'}`}>
                    Ver Tutorial &rarr;
                  </span>
                </div>
              </button>

              {/* Tarjeta Practicar */}
              <button
                onClick={() => {
                  if (selectedOption === 'practice') {
                    setView('menu');
                  } else {
                    setSelectedOption('practice');
                  }
                }}
                style={{
                  backgroundColor: selectedOption === 'practice' ? '#d1fae5' : undefined,
                  borderColor: selectedOption === 'practice' ? '#10b981' : undefined,
                }}
                className={`rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col text-left ${selectedOption === 'practice'
                    ? 'shadow-xl scale-102 -translate-y-1'
                    : 'bg-white border-purple-100 hover:border-emerald-500 hover:bg-emerald-50/20 shadow-md hover:shadow-[0_10px_25px_-5px_rgba(16,185,129,0.15)] hover:scale-102 hover:-translate-y-1'
                  }`}
              >
                <div className="h-32 w-full bg-emerald-50/10 flex items-center justify-center overflow-hidden border-b border-purple-100">
                  <img
                    src="/practice_card_image.png"
                    alt="Práctica"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex-1 w-full flex flex-col justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className={`w-5 h-5 transition-colors ${selectedOption === 'practice' ? 'text-emerald-700' : 'text-emerald-600 group-hover:text-emerald-700'}`} />
                      <h3 className={`font-extrabold text-base transition-colors ${selectedOption === 'practice' ? 'text-emerald-900' : 'text-slate-800 group-hover:text-emerald-800'}`}>Practicar Ejercicios</h3>
                    </div>
                    <p className={`text-xs leading-relaxed mb-3 transition-colors ${selectedOption === 'practice' ? 'text-emerald-950' : 'text-slate-600 group-hover:text-emerald-950'}`}>
                      Resuelve matrices con retroalimentación instantánea y mejora tu destreza matemática en tiempo real.
                    </p>
                  </div>
                  <span className={`text-xs font-bold transition-colors flex items-center gap-1 mt-auto ${selectedOption === 'practice' ? 'text-emerald-800' : 'text-emerald-650 group-hover:text-emerald-800'}`}>
                    Comenzar Práctica &rarr;
                  </span>
                </div>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Tutorial ──
  if (view === 'tutorial') {
    return <GaussJordanTutorial onFinish={() => setView('menu')} onBack={() => setView(tutorialSource)} />;
  }

  // ── Exercise ──
  if (view === 'exercise') {
    if (!selectedExercise) {
      setView('menu');
      return null;
    }
    return (
      <PracticeExercise
        exercise={selectedExercise}
        onBack={() => {
          setSelectedExercise(null);
          setView('menu');
        }}
      />
    );
  }

  // ── Menu ──
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Navbar */}
      <header className="relative z-20 bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
              <Logo variant="icon" className="w-full h-full" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 text-base md:text-lg">Gauss-Jordan Academy</h1>
              <p className="text-xs text-slate-500 font-semibold">Campo de Práctica - Ejercicios</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700">Estudiante Invitado</p>
              <p className="text-xs text-slate-500 font-medium">Práctica Libre</p>
            </div>
              <button
                onClick={() => setView('welcome')}
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
                title="Volver"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                <span>Volver</span>
              </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        {/* Title section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
            Elige tu ejercicio
          </h2>
          <p className="text-gray-600 text-base md:text-lg font-medium">
            Selecciona un ejercicio para practicar el método de Gauss-Jordan
          </p>
        </motion.div>

        {/* Exercise grid */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {practiceExercises.map((ex, index) => {
            const diff = difficultyConfig[ex.difficulty] || difficultyConfig.basico;
            return (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`rounded-2xl border transition-all duration-300 shadow-md hover:shadow-xl flex flex-col p-6 sm:p-8 items-center text-center justify-between ${diff.cardBg}`}
              >
                <div className="w-full flex flex-col items-center">
                  {/* Top row: category icon + difficulty badge (centered/stacked) */}
                  <div className="flex flex-col items-center mb-4">
                    <span className={`text-2xl p-2.5 rounded-xl shadow-sm font-semibold flex items-center justify-center mb-2.5 ${diff.iconBg}`}>
                      {categoryIcons[ex.category] || (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></svg>
                      )}
                    </span>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-xs ${diff.bg}`}>
                      {diff.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2 leading-tight text-center">
                    {ex.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm mb-5 leading-relaxed text-center">
                    {ex.description}
                  </p>
                </div>

                <div className="w-full flex flex-col items-center">
                  {/* Info chips (centered) */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-slate-100 text-slate-600 shadow-xs flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {ex.steps.length} pasos
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-slate-100 text-slate-600 shadow-xs flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></svg>
                      Matriz {ex.initialMatrix.length}×{ex.initialMatrix[0].length}
                    </span>
                  </div>

                  {/* Practice button */}
                  <button
                    onClick={() => {
                      setSelectedExercise(ex);
                      setView('exercise');
                    }}
                    style={{
                      backgroundColor: diff.btnColor,
                      color: 'white',
                    }}
                    className={`w-full max-w-xs py-3 rounded-xl font-extrabold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 ${diff.btn}`}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    Comenzar Práctica &rarr;
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tutorial reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => {
              setTutorialSource('menu');
              setView('tutorial');
            }}
            className="text-base text-indigo-600 hover:text-indigo-800 transition-colors font-bold flex items-center justify-center gap-2 mx-auto bg-indigo-50 px-6 py-3 rounded-full hover:bg-indigo-100"
          >
            <BookOpen className="w-5 h-5" />
            ¿Necesitas repasar? Ver Tutorial de nuevo
          </button>
        </motion.div>
      </div>
    </div>
  );
}