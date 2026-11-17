import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, BookOpen, PartyPopper, Sparkles, ArrowLeft } from 'lucide-react';
import { tutorialSteps } from '../data/practiceExercises';
import { Logo } from './Logo';

interface GaussJordanTutorialProps {
  onFinish: () => void;
  onBack: () => void;
}

export function GaussJordanTutorial({ onFinish, onBack }: GaussJordanTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const [isBackActive, setIsBackActive] = useState(false);

  const totalSteps = tutorialSteps.length;
  const step = tutorialSteps[currentStep];
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  const renderMatrix = (matrix: number[][], highlightRows?: number[], labels?: string[]) => {
    return (
      <div className="flex flex-col items-center gap-2">
        {/* Labels row */}
        {labels && (
          <div className="flex items-center">
            {/* Spacer for left bracket */}
            <div style={{ width: '14px' }} />
            <table className="border-collapse">
              <thead>
                <tr>
                  {labels.map((label, i) => (
                    <th
                      key={i}
                      className="px-1"
                      style={{
                        width: '3rem',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#6366f1',
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
            {/* Spacer for right bracket */}
            <div style={{ width: '14px' }} />
          </div>
        )}

        <div className="inline-flex items-center">
          {/* Left bracket */}
          <div className="flex flex-col justify-between self-stretch mr-2 py-1">
            <div
              style={{
                borderLeft: '3px solid #343A40',
                borderTop: '3px solid #343A40',
                width: '12px',
                height: '8px',
                borderTopLeftRadius: '2px',
              }}
            />
            <div
              style={{
                borderLeft: '3px solid #343A40',
                flex: 1,
                marginTop: '-1px',
                marginBottom: '-1px',
              }}
            />
            <div
              style={{
                borderLeft: '3px solid #343A40',
                borderBottom: '3px solid #343A40',
                width: '12px',
                height: '8px',
                borderBottomLeftRadius: '2px',
              }}
            />
          </div>

          {/* Matrix table */}
          <table className="border-collapse">
            <tbody>
              {matrix.map((row, rowIndex) => {
                const isHighlighted = highlightRows?.includes(rowIndex);
                return (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="p-0.5">
                        <div
                          className={`flex items-center justify-center border rounded-md font-mono text-sm font-medium transition-colors ${isHighlighted
                            ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                            : 'bg-white border-gray-200 text-gray-700'
                            }`}
                          style={{
                            width: '3rem',
                            height: '2.5rem',
                          }}
                        >
                          {Number.isInteger(cell)
                            ? cell
                            : cell.toFixed(cell % 1 === 0 ? 0 : 3).replace(/\.?0+$/, '')}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Right bracket */}
          <div className="flex flex-col justify-between self-stretch ml-2 py-1">
            <div
              style={{
                borderRight: '3px solid #343A40',
                borderTop: '3px solid #343A40',
                width: '12px',
                height: '8px',
                borderTopRightRadius: '2px',
              }}
            />
            <div
              style={{
                borderRight: '3px solid #343A40',
                flex: 1,
                marginTop: '-1px',
                marginBottom: '-1px',
              }}
            />
            <div
              style={{
                borderRight: '3px solid #343A40',
                borderBottom: '3px solid #343A40',
                width: '12px',
                height: '8px',
                borderBottomRightRadius: '2px',
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Navbar */}
      <header className="relative z-20 bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Info del Tutorial */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0">
              <Logo variant="icon" className="w-full h-full" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 text-base md:text-lg">Gauss-Jordan Academy</h1>
              <p className="text-xs text-slate-500 font-semibold">
                Campo de Práctica - Tutorial: <span className="text-slate-700 font-bold">Paso {currentStep + 1} de {totalSteps}</span>
              </p>
            </div>
          </div>

          {/* Derecha */}
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
              title="Volver"
            >
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            {/* Final step special design */}
            {step.isFinal ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 sm:p-6 md:p-10 text-center shadow-lg">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <PartyPopper className="w-10 h-10 text-green-600" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold text-green-800 mb-4"
                >
                  {step.title}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/70 backdrop-blur rounded-xl p-4 sm:p-5 md:p-6 mb-6 max-w-lg mx-auto"
                >
                  <p className="text-gray-700 whitespace-pre-line text-sm md:text-base leading-relaxed">
                    {step.explanation}
                  </p>
                </motion.div>

                {step.matrix && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center mb-8"
                  >
                    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-green-200">
                      {renderMatrix(step.matrix, step.highlight)}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-2 text-green-600 text-sm mb-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>¡Ahora es tu turno de practicar!</span>
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </div>
            ) : (
              /* Normal step design */
              <div className="space-y-6">
                {/* Step number badge + title */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                    {step.stepNumber}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#343A40]">{step.title}</h2>
                  </div>
                </div>

                {/* Explanation box */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
                  <p className="text-gray-700 whitespace-pre-line text-sm md:text-base leading-relaxed">
                    {step.explanation}
                  </p>
                </div>

                {/* Operation badge */}
                {step.operation && (
                  <div className="flex justify-center mb-6 mt-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      /* Aquí forzamos los colores directamente para que no fallen */
                      style={{
                        backgroundColor: '#eef2ff',
                        color: '#3730a3',
                        border: '2px solid #c7d2fe'
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-md"
                    >
                      <span style={{ opacity: 0.8 }}>Operación:</span>
                      <span className="font-mono text-base tracking-wider">{step.operation}</span>
                    </motion.div>
                  </div>
                )}

                {/* Matrix display */}
                {step.matrix && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex justify-center"
                  >
                    <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-md border border-gray-100">
                      {renderMatrix(step.matrix, step.highlight, step.matrixLabels)}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="bg-white border-t border-gray-200 shadow-inner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-all ${currentStep === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          {/* Step dots indicator */}
          <div className="hidden md:flex items-center gap-1.5">
            {tutorialSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`rounded-full transition-all duration-300 ${i === currentStep
                  ? 'w-8 h-2.5 bg-indigo-500'
                  : i < currentStep
                    ? 'w-2.5 h-2.5 bg-indigo-300 hover:bg-indigo-400'
                    : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
                  }`}
              />
            ))}
          </div>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(totalSteps - 1, s + 1))}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <motion.button
              onClick={onFinish}
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-5 h-5" />
              ¡Empezar a Practicar!
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
