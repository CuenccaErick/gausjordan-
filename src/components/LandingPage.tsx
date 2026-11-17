import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, CheckCircle, GraduationCap, PenTool, Sparkles, TrendingUp, Clock, Target } from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onPractice?: () => void;
  onStudentClick?: () => void;
}

export function LandingPage({ onGetStarted, onLogin, onPractice, onStudentClick }: LandingPageProps) {
  const [isRegHover, setRegHover] = useState(false);
  const [isLoginHover, setLoginHover] = useState(false);
  const [isProfHover, setProfHover] = useState(false);
  const [isStudHover, setStudHover] = useState(false);
  const [isPracHover, setPracHover] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header / Navegación - Blanco aparte */}
      <header className="relative z-20 bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-20 h-20 md:w-24 md:h-24">
              <Logo variant="icon" className="w-full h-full" />
            </div>
            <span className="text-lg md:text-2xl font-extrabold text-slate-800 hidden sm:inline">
              Gauss-Jordan Academy
            </span>
            <span className="text-lg font-extrabold text-slate-800 sm:hidden">
              GJ Academy
            </span>
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onLogin}
              onMouseEnter={() => setLoginHover(true)}
              onMouseLeave={() => setLoginHover(false)}
              style={{ color: isLoginHover ? '#6d28d9' : '#475569', fontWeight: 600 }}
              className="transition-colors px-2 md:px-4 py-2 text-sm md:text-base"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={onGetStarted}
              onMouseEnter={() => setRegHover(true)}
              onMouseLeave={() => setRegHover(false)}
              style={{ backgroundColor: isRegHover ? '#6b21a8' : '#511682' }}
              className="text-white px-4 md:px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm md:text-base font-medium"
            >
              Registrarse
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor del resto de la página con degradado de fondo */}
      <div
        className="flex-1 relative z-10"
        style={{ background: "linear-gradient(135deg, #0d0518 0%, #1a0535 40%, #0f0a2e 100%)" }}
      >
        {/* Sección Hero con elementos flotantes propios */}
        <div className="relative w-full overflow-hidden">
        {/* Elementos flotantes de la sección Hero */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <motion.div
            className="absolute text-white text-6xl font-mono"
            style={{ left: '5%', top: '2.5rem', opacity: 0.4 }}
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            [1]
          </motion.div>
          <motion.div
            className="absolute text-white text-5xl font-mono"
            style={{ right: '5%', top: '5rem', opacity: 0.4 }}
            animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            [0]
          </motion.div>
        </div>

          <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Contenido de texto */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
                Domina el Método de Gauss-Jordan
              </h1>
              <p className="text-lg md:text-xl text-white mb-6 md:mb-8">
                La plataforma interactiva donde profesores crean desafíos y estudiantes resuelven matrices en tiempo real.
              </p>

              {/* CTAs Duales */}
              <div className="space-y-3 md:space-y-4">
                <button
                  onClick={onLogin}
                  onMouseEnter={() => setProfHover(true)}
                  onMouseLeave={() => setProfHover(false)}
                  style={{
                    background: isProfHover
                      ? 'linear-gradient(to right, #631c9e, #7c3aed)'
                      : 'linear-gradient(to right, #511682, #6d28d9)'
                  }}
                  className="w-full text-white px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 hover:scale-105"
                >
                  <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-base md:text-lg font-semibold">
                    Soy Profesor: Crear Ejercicios
                  </span>
                </button>

                <button
                  onClick={onStudentClick || onLogin}
                  onMouseEnter={() => setStudHover(true)}
                  onMouseLeave={() => setStudHover(false)}
                  style={{
                    borderColor: '#511682',
                    color: '#511682',
                    backgroundColor: isStudHover ? '#f5f3ff' : '#ffffff'
                  }}
                  className="w-full border-2 px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 hover:scale-105"
                >
                  <PenTool className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-base md:text-lg font-semibold">
                    Soy Estudiante: Unirme a Clase
                  </span>
                </button>

                {/* Campo de Práctica - sin registro */}
                <button
                  onClick={() => onPractice?.()}
                  onMouseEnter={() => setPracHover(true)}
                  onMouseLeave={() => setPracHover(false)}
                  style={{
                    borderColor: isPracHover ? '#c98730' : '#e2a049',
                    color: '#ffffff',
                    backgroundColor: isPracHover ? '#c98730' : '#e2a049'
                  }}
                  className="w-full border-2 px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 hover:scale-105 group"
                >
                  <Target className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#ffffff' }} />
                  <div className="flex flex-col items-start">
                    <span className="text-base md:text-lg font-semibold"> Campo de Práctica</span>
                    <span className="text-xs text-yellow-100/90 group-hover:text-white">Sin registro necesario</span>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Animación de Matriz */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <MatrixAnimation />
            </motion.div>
          </div>
        </section>
      </div>

      {/*  Sección Informativa */}
      <section className="relative z-10 bg-slate-900/60 backdrop-blur-md border-y border-purple-950/40 py-20 overflow-hidden">
        {/* Elementos flotantes de la sección Informativa */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <motion.div
            className="absolute text-white text-5xl font-mono"
            style={{ left: '8%', top: '2.5rem', opacity: 0.4 }}
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            [-2]
          </motion.div>
          <motion.div
            className="absolute text-white text-5xl font-mono"
            style={{ right: '8%', bottom: '2.5rem', opacity: 0.4 }}
            animate={{ rotate: [0, 10, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            =
          </motion.div>
        </div>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                ¿Cómo funciona?
              </h2>
              <p className="text-lg text-white max-w-3xl mx-auto font-medium">
                El Método Gauss-Jordan es un algoritmo del álgebra lineal utilizado para resolver sistemas de ecuaciones lineales y encontrar matrices inversas. Transformamos una matriz compleja en su forma escalonada reducida mediante operaciones elementales de fila.
              </p>
            </motion.div>

            {/* Tarjetas de pasos encerradas en un div de otro color */}
            <div className="bg-purple-950/30 border border-purple-500/20 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
              <div className="grid md:grid-cols-3 gap-8">
                <StepCard
                  number={1}
                  icon={<BookOpen className="w-8 h-8" color='white' />}
                  title="Escribe la Matriz"
                  description="Comienza ingresando tu sistema de ecuaciones como una matriz aumentada."
                  delay={0}
                />
                <StepCard
                  number={2}
                  icon={<Users className="w-8 h-8" color='white' />}
                  title="Aplica Operaciones"
                  description="Realiza operaciones elementales de fila: intercambio, multiplicación y suma de filas."
                  delay={0.2}
                />
                <StepCard
                  number={3}
                  icon={<CheckCircle className="w-8 h-8" color='white' />}
                  title="Obtén la Solución"
                  description="Llega a la forma escalonada reducida y lee directamente las soluciones del sistema."
                  delay={0.4}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Características */}
        <section className="relative z-10 py-20 overflow-hidden">
          {/* Elementos flotantes de la sección de Características */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <motion.div
              className="absolute text-white text-4xl font-mono"
              style={{ right: '8%', top: '2.5rem', opacity: 0.4 }}
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              +
            </motion.div>
            <motion.div
              className="absolute text-white text-6xl font-mono"
              style={{ left: '8%', bottom: '2.5rem', opacity: 0.4 }}
              animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              [I]
            </motion.div>
            <motion.div
              className="absolute text-white text-5xl font-mono"
              style={{ left: '5%', top: '50%', opacity: 0.4 }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              [y]
            </motion.div>
            <motion.div
              className="absolute text-white text-4xl font-mono"
              style={{ right: '8%', bottom: '8rem', opacity: 0.4 }}
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              [x]
            </motion.div>
          </div>
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Una Plataforma Completa
              </h2>
              <p className="text-lg text-white font-medium">
                Herramientas diseñadas para profesores y estudiantes
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Sparkles className="w-10 h-10" />}
                title="Feedback Instantáneo"
                description="Retroalimentación visual en tiempo real: verde para correcto, rojo para incorrecto."
                delay={0}
              />
              <FeatureCard
                icon={<Clock className="w-10 h-10" />}
                title="Seguimiento de Progreso"
                description="Rastrea tiempo, eficacia, aciertos y puntuación de cada estudiante."
                delay={0.2}
              />
              <FeatureCard
                icon={<TrendingUp className="w-10 h-10" />}
                title="Análisis Detallado"
                description="Estadísticas completas para identificar áreas de mejora y celebrar logros."
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* Footer - Blanco */}
        <footer className="relative z-10 bg-white border-t border-purple-100 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16">
                  <Logo variant="icon" className="w-full h-full" />
                </div>
                <span className="text-sm text-slate-600">
                  © 2026 Gauss-Jordan Academy. IPN escuela superior de computo.  Isaac O & Erick C.
                </span>
              </div>
              <div className="flex gap-6 text-sm text-slate-600 font-medium">
                <a href="#" className="hover:text-purple-650 transition-colors">
                  Contacto
                </a>
                <a href="#" className="hover:text-purple-650 transition-colors">
                  Sobre Nosotros
                </a>
                <a href="#" className="hover:text-purple-650 transition-colors">
                  Términos
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Componente de Animación de Matriz
function MatrixAnimation() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* Matriz inicial */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200"
        >
          {/* Matriz con corchetes */}
          <div className="flex items-center gap-2">
            {/* Corchete izquierdo */}
            <div className="flex flex-col justify-between self-stretch py-1">
              <div style={{
                borderLeft: '3px solid #343A40',
                borderTop: '3px solid #343A40',
                width: '10px',
                height: '6px'
              }}></div>
              <div style={{
                borderLeft: '3px solid #343A40',
                height: '30px'
              }}></div>
              <div style={{
                borderLeft: '3px solid #343A40',
                borderBottom: '3px solid #343A40',
                width: '10px',
                height: '6px'
              }}></div>
            </div>

            {/* Contenido de la matriz */}
            <div className="text-[#343A40] font-mono text-base space-y-2 py-1">
              <div className="flex gap-3">
                <span className="w-8 text-center">2</span>
                <span className="w-8 text-center">1</span>
                <span className="text-gray-400">|</span>
                <span className="w-8 text-center">5</span>
              </div>
              <div className="flex gap-3">
                <span className="w-8 text-center">4</span>
                <span className="w-8 text-center">3</span>
                <span className="text-gray-400">|</span>
                <span className="w-8 text-center">11</span>
              </div>
            </div>

            {/* Corchete derecho */}
            <div className="flex flex-col justify-between self-stretch py-1">
              <div style={{
                borderRight: '3px solid #343A40',
                borderTop: '3px solid #343A40',
                width: '10px',
                height: '6px'
              }}></div>
              <div style={{
                borderRight: '3px solid #343A40',
                height: '30px'
              }}></div>
              <div style={{
                borderRight: '3px solid #343A40',
                borderBottom: '3px solid #343A40',
                width: '10px',
                height: '6px'
              }}></div>
            </div>
          </div>

          <div className="text-xs text-red-600 mt-3 text-center font-semibold">
            Problema
          </div>
        </motion.div>

        {/* Flecha animada */}
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-purple-800"
        >


          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 20 L28 20 M28 20 L22 14 M28 20 L22 26"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Matriz solución */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200"
        >
          {/* Matriz con corchetes */}
          <div className="flex items-center gap-2">
            {/* Corchete izquierdo */}
            <div className="flex flex-col justify-between self-stretch py-1">
              <div style={{
                borderLeft: '3px solid #343A40',
                borderTop: '3px solid #343A40',
                width: '10px',
                height: '6px'
              }}></div>
              <div style={{
                borderLeft: '3px solid #343A40',
                height: '30px'
              }}></div>
              <div style={{
                borderLeft: '3px solid #343A40',
                borderBottom: '3px solid #343A40',
                width: '10px',
                height: '6px'
              }}></div>
            </div>

            {/* Contenido de la matriz */}
            <div className="text-[#343A40] font-mono text-base space-y-2 py-1">
              <div className="flex gap-3">
                <span className="w-8 text-center">1</span>
                <span className="w-8 text-center">0</span>
                <span className="text-gray-400">|</span>
                <span className="w-8 text-center">2</span>
              </div>
              <div className="flex gap-3">
                <span className="w-8 text-center">0</span>
                <span className="w-8 text-center">1</span>
                <span className="text-gray-400">|</span>
                <span className="w-8 text-center">1</span>
              </div>
            </div>

            {/* Corchete derecho */}
            <div className="flex flex-col justify-between self-stretch py-1">
              <div style={{
                borderRight: '3px solid #343A40',
                borderTop: '3px solid #343A40',
                width: '10px',
                height: '6px'
              }}></div>
              <div style={{
                borderRight: '3px solid #343A40',
                height: '30px'
              }}></div>
              <div style={{
                borderRight: '3px solid #343A40',
                borderBottom: '3px solid #343A40',
                width: '10px',
                height: '6px'
              }}></div>
            </div>
          </div>

          <div className="text-xs text-green-600 mt-3 text-center font-semibold">
            Solución ✓
          </div>
        </motion.div>
      </div>

      {/* Operaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-6 text-center"
      >
        <div className="inline-block bg-purple-50 rounded-lg px-4 py-2 text-sm text-purple-850 font-medium border border-purple-100">
          F₂ = F₂ - 2F₁ → F₂ = 2F₂ → F₁ = F₁ - ½F₂
        </div>
      </motion.div>
    </div>
  );
}

// Componente de Tarjeta de Paso
interface StepCardProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function StepCard({ number, icon, title, description, delay }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
          {number}
        </div>
        <div className="text-purple-300">{icon}</div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white font-light text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Componente de Tarjeta de Característica
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white font-light text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}