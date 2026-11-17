import { useState } from 'react';
import { GraduationCap, UserCircle, ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { motion } from 'motion/react';

interface RoleSelectionProps {
  userName: string;
  onSelectRole: (role: 'teacher' | 'student') => void;
  onBack?: () => void;
}

export function RoleSelection({ userName, onSelectRole, onBack }: RoleSelectionProps) {
  const [isBackHover, setBackHover] = useState(false);
  const [isTeacherHover, setTeacherHover] = useState(false);
  const [isStudentHover, setStudentHover] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Navbar / Cabecera */}
      <header className="w-full bg-white border-b border-purple-100 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo y Marca */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <Logo variant="icon" className="w-full h-full" />
            </div>
            <span className="text-base md:text-lg font-bold text-slate-800 hidden sm:inline">
              Gauss-Jordan Academy
            </span>
          </div>

          {/* Botón Volver */}
          {onBack && (
            <button
              onClick={onBack}
              onMouseEnter={() => setBackHover(true)}
              onMouseLeave={() => setBackHover(false)}
              style={{
                color: isBackHover ? '#ffffff' : '#6c757d',
                backgroundColor: isBackHover ? '#511682' : '#f8f9fa',
                borderColor: isBackHover ? '#511682' : '#cbd5e1'
              }}
              className="flex items-center gap-2 transition-all text-sm font-bold px-4 py-2 rounded-lg border shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </button>
          )}
        </div>
      </header>

      {/* Contenedor de contenido centrado verticalmente en el espacio restante */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
            Hola, {userName}
          </h1>
          <p className="text-[#6C757D] text-lg font-medium">
            ¿Cómo deseas ingresar hoy?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full">
          {/* Opción Profesor */}
          <button
            onClick={() => onSelectRole('teacher')}
            onMouseEnter={() => setTeacherHover(true)}
            onMouseLeave={() => setTeacherHover(false)}
            style={{
              backgroundColor: isTeacherHover ? '#f3e8ff' : '#f3e8ff80',
              borderColor: '#c084fc'
            }}
            className="backdrop-blur-sm border rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 group text-left"
          >
            <div className="flex flex-col items-center">
              <div
                style={{
                  background: isTeacherHover
                    ? 'linear-gradient(to bottom right, #6b21a8, #7c3aed)'
                    : 'linear-gradient(to bottom right, #511682, #6d28d9)'
                }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all shadow-md"
              >
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-[#343A40] mb-3 text-center font-bold">
                Soy Profesor
              </h2>
              <p className="text-[#6C757D] text-center text-sm leading-relaxed">
                Crear ejercicios, generar códigos de clase y ver resultados de estudiantes
              </p>
            </div>
          </button>

          {/* Opción Estudiante */}
          <button
            onClick={() => onSelectRole('student')}
            onMouseEnter={() => setStudentHover(true)}
            onMouseLeave={() => setStudentHover(false)}
            style={{
              backgroundColor: isStudentHover ? '#fef3c7' : '#fef3c780',
              borderColor: '#fbbf24'
            }}
            className="backdrop-blur-sm border rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 hover:scale-105 group text-left"
          >
            <div className="flex flex-col items-center">
              <div
                style={{
                  background: isStudentHover
                    ? 'linear-gradient(to bottom right, #d97706, #fbbf24)'
                    : 'linear-gradient(to bottom right, #e2a049, #fbbf24)'
                }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all shadow-md"
              >
                <UserCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-[#343A40] mb-3 text-center font-bold">
                Soy Estudiante
              </h2>
              <p className="text-[#6C757D] text-center text-sm leading-relaxed">
                Ingresar con código de clase y resolver ejercicios de matrices
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
